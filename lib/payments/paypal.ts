/**
 * Adapter: PayPal Orders v2 (fetch-based, sin SDK).
 *
 * ENV requeridas:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_WEBHOOK_ID          (de la app de webhook en el panel)
 *   PAYPAL_ENV                 'sandbox' | 'live' (default: sandbox)
 *
 * Sin PAYPAL_CLIENT_ID → modo STUB.
 *
 * Docs:
 *   - Orders v2:   https://developer.paypal.com/docs/api/orders/v2/
 *   - Webhook verify: https://developer.paypal.com/api/rest/webhooks/rest/#link-webhookmessage
 */

import type {
  PaymentGateway,
  CreateOrderInput,
  CreateOrderResult,
  WebhookEvent,
  PaymentStatus,
} from './types'

function isConfigured(): boolean {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
}

function paypalBase(): string {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

/** Cache simple del access token (válido 9h aprox). */
let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token

  const basic = Buffer
    .from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`)
    .toString('base64')

  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization:  `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) {
    const e = await res.text().catch(() => '')
    throw new Error(`paypal.getAccessToken: HTTP ${res.status} ${e}`)
  }
  const data = await res.json() as { access_token: string; expires_in: number }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

function mapPaypalStatus(s: string | undefined): PaymentStatus {
  switch (s) {
    case 'COMPLETED': return 'paid'
    case 'APPROVED':  return 'paid'      // capturado por webhook normalmente
    case 'CREATED':   return 'pending'
    case 'PAYER_ACTION_REQUIRED':
    case 'SAVED':     return 'pending'
    case 'VOIDED':    return 'cancelled'
    case 'DECLINED':  return 'failed'
    default:          return 'pending'
  }
}

function mapPaypalEvent(type: string): PaymentStatus | undefined {
  if (type === 'CHECKOUT.ORDER.APPROVED')        return 'paid'
  if (type === 'PAYMENT.CAPTURE.COMPLETED')      return 'paid'
  if (type === 'PAYMENT.CAPTURE.DENIED')         return 'failed'
  if (type === 'PAYMENT.CAPTURE.REFUNDED')       return 'refunded'
  if (type === 'PAYMENT.CAPTURE.REVERSED')       return 'refunded'
  if (type === 'CHECKOUT.ORDER.VOIDED')          return 'cancelled'
  return undefined
}

export const paypalGateway: PaymentGateway = {
  name: 'paypal' as any, // expand union si el linter molesta

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    if (!isConfigured()) {
      return {
        gatewayOrderId: `STUB-${input.orderId}`,
        paymentUrl:     `${input.successUrl}?stub=1&gw=paypal&order=${input.orderId}`,
        rawResponse:    { stub: true, reason: 'PAYPAL_CLIENT_ID/SECRET not set' },
      }
    }

    const token = await getAccessToken()

    // PayPal exige 2 decimales (excepto JPY/HUF/TWD que son enteros)
    const zeroDecimal = ['JPY', 'HUF', 'TWD']
    const value = zeroDecimal.includes(input.currency.toUpperCase())
      ? input.amount.toFixed(0)
      : input.amount.toFixed(2)

    const body = {
      intent: 'CAPTURE' as const,
      purchase_units: [{
        reference_id: input.orderId,
        description:  input.serviceLabel.slice(0, 127),
        custom_id:    input.serviceValue,
        amount: {
          currency_code: input.currency.toUpperCase(),
          value,
        },
      }],
      application_context: {
        brand_name:  'Innovando',
        landing_page: 'NO_PREFERENCE',
        user_action:  'PAY_NOW',
        return_url:   input.successUrl,
        cancel_url:   input.failureUrl,
      },
    }

    const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': input.orderId,    // idempotencia
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const e = await res.text().catch(() => '')
      throw new Error(`paypal.createOrder: HTTP ${res.status} ${e}`)
    }
    const data = await res.json() as {
      id: string
      status: string
      links: Array<{ rel: string; href: string; method: string }>
    }

    const approve = data.links.find(l => l.rel === 'approve' || l.rel === 'payer-action')
    if (!approve) throw new Error('paypal.createOrder: no approve link in response')

    return {
      gatewayOrderId: data.id,
      paymentUrl:     approve.href,
      rawResponse:    data,
    }
  },

  async parseWebhook(headers, rawBody): Promise<WebhookEvent> {
    const signatureOk = await verifyPaypalSignature(headers, rawBody)
    let payload: any = {}
    try { payload = JSON.parse(rawBody) } catch {}

    const type = (payload?.event_type as string) ?? 'unknown'
    const resource = payload?.resource ?? {}

    // ID que matchea con la orden que creamos:
    //   - CHECKOUT.ORDER.* → resource.id (order_id)
    //   - PAYMENT.CAPTURE.* → resource.supplementary_data.related_ids.order_id
    const gatewayOrderId =
      resource?.supplementary_data?.related_ids?.order_id ??
      (type.startsWith('CHECKOUT.ORDER') ? resource.id : undefined)

    const gatewayPaymentId =
      type.startsWith('PAYMENT.CAPTURE') ? resource.id : undefined

    return {
      gateway:        'paypal' as any,
      type,
      gatewayOrderId,
      gatewayPaymentId,
      status:         mapPaypalEvent(type) ?? mapPaypalStatus(resource?.status),
      signatureOk,
      rawPayload:     payload,
    }
  },

  async fetchOrderStatus(gatewayOrderId: string) {
    if (!isConfigured()) return { status: 'pending' as PaymentStatus }
    const token = await getAccessToken()
    const r = await fetch(`${paypalBase()}/v2/checkout/orders/${gatewayOrderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!r.ok) return { status: 'pending' as PaymentStatus }
    const data = await r.json() as { status: string }
    return { status: mapPaypalStatus(data.status) }
  },
}

/* ── Verificación firma PayPal (server-to-server hash) ────────────
 * PayPal NO usa HMAC simple — pide hacer un call a /v1/notifications/verify-webhook-signature.
 * Si no tenemos PAYPAL_WEBHOOK_ID configurado, marcamos signatureOk:false.
 */
async function verifyPaypalSignature(
  headers: Record<string, string | undefined>,
  rawBody: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId || !isConfigured()) return false

  const required = [
    'paypal-auth-algo',
    'paypal-cert-url',
    'paypal-transmission-id',
    'paypal-transmission-sig',
    'paypal-transmission-time',
  ]
  for (const h of required) if (!headers[h]) return false

  try {
    const token = await getAccessToken()
    const body = {
      auth_algo:         headers['paypal-auth-algo'],
      cert_url:          headers['paypal-cert-url'],
      transmission_id:   headers['paypal-transmission-id'],
      transmission_sig:  headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id:        webhookId,
      webhook_event:     JSON.parse(rawBody),
    }
    const r = await fetch(`${paypalBase()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!r.ok) return false
    const data = await r.json() as { verification_status: string }
    return data.verification_status === 'SUCCESS'
  } catch {
    return false
  }
}
