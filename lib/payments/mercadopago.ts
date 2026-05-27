/**
 * Adapter: Mercado Pago Checkout Pro
 *
 * Docs: https://www.mercadopago.cl/developers/es/reference/preferences/_checkout_preferences/post
 *
 * ENV requeridas:
 *   MP_ACCESS_TOKEN       — token de la cuenta (sandbox o prod)
 *   MP_WEBHOOK_SECRET     — secret para validar firma `x-signature`
 *
 * Sin credenciales el adapter retorna stubs (no llama a la API real),
 * así podés probar el flujo BD + UI end-to-end antes de habilitar el cobro.
 */

import crypto from 'node:crypto'
import type {
  PaymentGateway,
  CreateOrderInput,
  CreateOrderResult,
  WebhookEvent,
  PaymentStatus,
} from './types'

const MP_API_BASE = 'https://api.mercadopago.com'

function isConfigured(): boolean {
  return !!process.env.MP_ACCESS_TOKEN
}

/** Mapea estados de MP a los internos. */
function mapMpStatus(s: string | undefined | null): PaymentStatus {
  switch (s) {
    case 'approved':    return 'paid'
    case 'authorized':  return 'paid'
    case 'pending':     return 'pending'
    case 'in_process':  return 'pending'
    case 'rejected':    return 'failed'
    case 'cancelled':   return 'cancelled'
    case 'refunded':    return 'refunded'
    case 'charged_back':return 'refunded'
    default:            return 'pending'
  }
}

export const mercadopagoGateway: PaymentGateway = {
  name: 'mercadopago',

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    // ── Stub mode (sin credenciales): devolvemos una URL fake para que el
    // flujo UI funcione en dev. La orden queda en 'pending' y nunca se paga.
    if (!isConfigured()) {
      return {
        gatewayOrderId: `STUB-${input.orderId}`,
        paymentUrl:     `${input.successUrl}?stub=1&order=${input.orderId}`,
        rawResponse:    { stub: true, reason: 'MP_ACCESS_TOKEN not set' },
      }
    }

    const body = {
      external_reference: input.orderId,
      items: [{
        id:          input.serviceValue,
        title:       input.serviceLabel,
        quantity:    1,
        currency_id: input.currency,
        unit_price:  input.amount,
      }],
      payer: {
        name:    input.buyerName,
        email:   input.buyerEmail,
        phone:   input.buyerPhone ? { number: input.buyerPhone } : undefined,
      },
      back_urls: {
        success: input.successUrl,
        failure: input.failureUrl,
        pending: input.pendingUrl,
      },
      auto_return:   'approved',
      notification_url: input.webhookUrl,
      metadata:      input.metadata ?? {},
      statement_descriptor: 'INNOVANDO',
    }

    const res = await fetch(`${MP_API_BASE}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`mercadopago.createOrder: HTTP ${res.status} ${errText}`)
    }

    const data = await res.json() as {
      id: string
      init_point: string
      sandbox_init_point: string
      expires?: boolean
      expiration_date_to?: string | null
    }

    const useSandbox = process.env.MP_ACCESS_TOKEN?.startsWith('TEST-')

    return {
      gatewayOrderId: data.id,
      paymentUrl:     useSandbox ? data.sandbox_init_point : data.init_point,
      expiresAt:      data.expiration_date_to ? new Date(data.expiration_date_to) : null,
      rawResponse:    data,
    }
  },

  async parseWebhook(headers, rawBody): Promise<WebhookEvent> {
    let payload: any = {}
    try { payload = JSON.parse(rawBody) } catch { /* keep {} */ }

    // ── Validación de firma (MP envía `x-signature` con HMAC SHA256) ──
    const signatureOk = verifyMpSignature(headers, rawBody)

    // MP manda dos shapes según el evento:
    //   1. { type: "payment", data: { id: "123" } }
    //   2. { action: "payment.created", data: { id: "123" } }
    const type =
      (payload.action as string | undefined) ??
      (payload.type   as string | undefined) ??
      'unknown'

    const gatewayPaymentId =
      payload?.data?.id?.toString() ??
      payload?.resource?.toString() ??
      undefined

    // Para saber el estado, idealmente consultamos /v1/payments/{id}.
    // Acá lo dejamos en pending y el handler decide si fetcha estado.
    return {
      gateway:        'mercadopago',
      type,
      gatewayPaymentId,
      status:         undefined,
      signatureOk,
      rawPayload:     payload,
    }
  },

  async fetchOrderStatus(gatewayOrderId: string) {
    if (!isConfigured()) {
      return { status: 'pending' as PaymentStatus }
    }
    // gatewayOrderId acá es el `preference_id`. Para conseguir el pago real
    // necesitaríamos search por external_reference. Lo dejamos como TODO si
    // querés implementarlo.
    return { status: 'pending' as PaymentStatus }
  },
}

/* ── Helpers de firma ────────────────────────────────────────────── */

function verifyMpSignature(
  headers: Record<string, string | undefined>,
  rawBody: string,
): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return false

  const sig = headers['x-signature'] || headers['X-Signature']
  const requestId = headers['x-request-id'] || headers['X-Request-Id']
  if (!sig || !requestId) return false

  // Formato esperado: "ts=...,v1=..."
  const parts = Object.fromEntries(
    sig.split(',').map(p => p.trim().split('=')).map(([k, v]) => [k, v]),
  )
  const ts = parts.ts
  const v1 = parts.v1
  if (!ts || !v1) return false

  // Manifest según docs: id:<data.id>;request-id:<req-id>;ts:<ts>;
  let dataId = ''
  try {
    const body = JSON.parse(rawBody)
    dataId = String(body?.data?.id ?? '')
  } catch { /* sin body válido → fallaremos abajo */ }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1))
  } catch {
    return false
  }
}
