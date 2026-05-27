import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGateway, type PaymentGatewayName } from '@/lib/payments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID_GATEWAYS: PaymentGatewayName[] = ['mercadopago', 'stripe', 'paypal', 'flow', 'khipu']

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gateway: string }> },
) {
  const { gateway } = await params
  const gatewayName = gateway as PaymentGatewayName
  if (!VALID_GATEWAYS.includes(gatewayName)) {
    return NextResponse.json({ error: 'invalid_gateway' }, { status: 404 })
  }

  const rawBody = await req.text()
  const headers: Record<string, string | undefined> = {}
  req.headers.forEach((v, k) => { headers[k.toLowerCase()] = v })

  let gw
  try { gw = getGateway(gatewayName) }
  catch (e: any) {
    return NextResponse.json({ error: 'unsupported_gateway', message: e.message }, { status: 501 })
  }

  let event
  try {
    event = await gw.parseWebhook(headers, rawBody)
  } catch (e: any) {
    console.error('[webhook] parse error', e)
    return NextResponse.json({ error: 'parse_failed' }, { status: 400 })
  }

  const sb = createAdminClient()

  let orderId: string | null = null
  if (event.gatewayOrderId) {
    const r = await sb.from('payment_orders')
      .select('id')
      .eq('gateway', gatewayName)
      .eq('gateway_order_id', event.gatewayOrderId)
      .maybeSingle()
    if (r.data) orderId = r.data.id
  }
  if (!orderId && event.gatewayPaymentId) {
    const r = await sb.from('payment_orders')
      .select('id')
      .eq('gateway', gatewayName)
      .eq('gateway_payment_id', event.gatewayPaymentId)
      .maybeSingle()
    if (r.data) orderId = r.data.id
  }

  await sb.from('payment_events').insert({
    order_id:     orderId,
    gateway:      gatewayName,
    event_type:   event.type,
    payload:      event.rawPayload as any,
    signature_ok: event.signatureOk,
  })

  const requireSig = !!(
    (gatewayName === 'mercadopago' && process.env.MP_WEBHOOK_SECRET)     ||
    (gatewayName === 'stripe'      && process.env.STRIPE_WEBHOOK_SECRET) ||
    (gatewayName === 'paypal'      && process.env.PAYPAL_WEBHOOK_ID)
  )
  if (requireSig && !event.signatureOk) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  if (orderId && event.status) {
    const patch: Record<string, unknown> = {
      status:     event.status,
      updated_at: new Date().toISOString(),
    }
    if (event.gatewayPaymentId) patch.gateway_payment_id = event.gatewayPaymentId
    if (event.status === 'paid') patch.paid_at = new Date().toISOString()

    await sb.from('payment_orders').update(patch).eq('id', orderId)

    // ── Side-effect: desbloquear reporte si corresponde ────────────
    if (event.status === 'paid') {
      const { data: order } = await sb.from('payment_orders')
        .select('id, service_value, metadata')
        .eq('id', orderId).maybeSingle()

      const reportId = (order?.metadata as any)?.report_id as string | undefined
      const isUnlockService = order?.service_value === 'reporte_completo'
                           || order?.service_value === 'huella_digital'
                           || order?.service_value === 'informe_presencia_digital'

      if (reportId && isUnlockService) {
        await sb.from('reports').update({
          is_unlocked:     true,
          unlocked_at:     new Date().toISOString(),
          unlock_order_id: orderId,
        }).eq('id', reportId)
      }
    }
  }

  return NextResponse.json({ ok: true, order_id: orderId, status: event.status ?? null })
}
