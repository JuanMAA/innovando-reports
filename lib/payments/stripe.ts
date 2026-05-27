/**
 * Adapter: Stripe Checkout (fetch-based, sin SDK).
 *
 * ENV requeridas:
 *   STRIPE_SECRET_KEY       sk_test_... | sk_live_...
 *   STRIPE_WEBHOOK_SECRET   whsec_...   (para validar firma del webhook)
 *
 * Sin STRIPE_SECRET_KEY → modo STUB (devuelve URL fake).
 *
 * Docs:
 *   - Checkout Sessions: https://stripe.com/docs/api/checkout/sessions/create
 *   - Webhook signature: https://stripe.com/docs/webhooks/signatures
 */

import crypto from 'node:crypto'
import type {
  PaymentGateway,
  CreateOrderInput,
  CreateOrderResult,
  WebhookEvent,
  PaymentStatus,
} from './types'

const STRIPE_API = 'https://api.stripe.com/v1'

function isConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

/** Mapea event types de Stripe a status interno. */
function mapStripeEvent(type: string): PaymentStatus | undefined {
  switch (type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'payment_intent.succeeded':
      return 'paid'
    case 'checkout.session.async_payment_failed':
    case 'payment_intent.payment_failed':
      return 'failed'
    case 'checkout.session.expired':
      return 'expired'
    case 'charge.refunded':
      return 'refunded'
    default:
      return undefined
  }
}

/** Stripe API espera form-encoded para el endpoint sessions/create. */
function toFormEncoded(obj: Record<string, any>, prefix = ''): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object') {
          parts.push(toFormEncoded(item, `${key}[${i}]`))
        } else {
          parts.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`)
        }
      })
    } else if (typeof v === 'object') {
      parts.push(toFormEncoded(v, key))
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
    }
  }
  return parts.filter(Boolean).join('&')
}

export const stripeGateway: PaymentGateway = {
  name: 'stripe',

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    if (!isConfigured()) {
      return {
        gatewayOrderId: `STUB-${input.orderId}`,
        paymentUrl:     `${input.successUrl}?stub=1&gw=stripe&order=${input.orderId}`,
        rawResponse:    { stub: true, reason: 'STRIPE_SECRET_KEY not set' },
      }
    }

    // Stripe expresa montos como enteros en la unidad mínima (centavos para USD,
    // pero zero-decimal currencies como CLP/JPY/KRW NO se multiplican.)
    const zeroDecimal = ['JPY', 'KRW', 'CLP', 'VND', 'XPF']
    const unitAmount = zeroDecimal.includes(input.currency.toUpperCase())
      ? Math.round(input.amount)
      : Math.round(input.amount * 100)

    const body = toFormEncoded({
      mode: 'payment',
      success_url: input.successUrl,
      cancel_url:  input.failureUrl,
      customer_email: input.buyerEmail,
      client_reference_id: input.orderId,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: unitAmount,
          product_data: {
            name: input.serviceLabel,
            metadata: { service_value: input.serviceValue },
          },
        },
      }],
      metadata: {
        order_id:      input.orderId,
        service_value: input.serviceValue,
        ...(input.metadata ?? {}),
      },
    })

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`stripe.createOrder: HTTP ${res.status} ${errText}`)
    }
    const data = await res.json() as { id: string; url: string; expires_at?: number }

    return {
      gatewayOrderId: data.id,
      paymentUrl:     data.url,
      expiresAt:      data.expires_at ? new Date(data.expires_at * 1000) : null,
      rawResponse:    data,
    }
  },

  async parseWebhook(headers, rawBody): Promise<WebhookEvent> {
    const signatureOk = verifyStripeSignature(headers, rawBody)
    let payload: any = {}
    try { payload = JSON.parse(rawBody) } catch {}

    const type = (payload?.type as string) ?? 'unknown'
    const obj  = payload?.data?.object ?? {}
    const status = mapStripeEvent(type)

    return {
      gateway:          'stripe',
      type,
      gatewayOrderId:   obj.id,                                                // session_id
      gatewayPaymentId: obj.payment_intent ?? obj.id,
      status,
      signatureOk,
      rawPayload:       payload,
    }
  },
}

/* ── Verificación firma Stripe (HMAC SHA256) ─────────────────────── */
// Formato del header: t=<unix>,v1=<hex>,v0=<hex>
function verifyStripeSignature(
  headers: Record<string, string | undefined>,
  rawBody: string,
): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return false

  const header = headers['stripe-signature']
  if (!header) return false

  const parts = Object.fromEntries(
    header.split(',').map(p => p.trim().split('=')).map(([k, ...rest]) => [k, rest.join('=')]),
  )
  const ts = parts.t
  const v1 = parts.v1
  if (!ts || !v1) return false

  const signedPayload = `${ts}.${rawBody}`
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  } catch {
    return false
  }
}
