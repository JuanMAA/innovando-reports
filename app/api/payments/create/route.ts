import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getGateway,
  getDefaultGateway,
  getPricingForService,
  makeOrderUrls,
  type PaymentGatewayName,
} from '@/lib/payments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  service_value: z.string().min(1).max(120),
  lead_id:       z.string().uuid().nullish(),
  business_id:   z.string().uuid().nullish(),

  country:       z.string().max(8).nullish(),
  locale:        z.string().max(8).default('es'),

  buyer_name:    z.string().max(200).nullish(),
  buyer_email:   z.string().email().nullish(),
  buyer_phone:   z.string().max(50).nullish(),

  gateway:       z.enum(['mercadopago', 'stripe', 'paypal', 'flow', 'khipu']).nullish(),

  amount_override:   z.number().positive().nullish(),
  currency_override: z.string().max(8).nullish(),

  metadata:      z.record(z.string(), z.unknown()).nullish(),

  return_success_url: z.string().url().max(500).nullish(),
  return_failure_url: z.string().url().max(500).nullish(),
  return_pending_url: z.string().url().max(500).nullish(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_payload', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const input = parsed.data
  const sb    = createAdminClient()

  // Hidratar buyer + country desde lead o business
  let lead: any = null
  if (input.lead_id) {
    const r = await sb.from('leads').select('*').eq('id', input.lead_id).maybeSingle()
    lead = r.data
  }
  let business: any = null
  if (input.business_id) {
    const r = await sb.from('businesses')
      .select('id, name, country, latest_report_id')
      .eq('id', input.business_id).maybeSingle()
    business = r.data
  }

  const buyerName    = input.buyer_name  ?? lead?.name              ?? null
  const buyerEmail   = input.buyer_email ?? lead?.email             ?? null
  const buyerPhone   = input.buyer_phone ?? lead?.phone             ?? null
  const buyerCountry = (
    input.country
    ?? lead?.country
    ?? business?.country
    ?? 'CL'
  ).toUpperCase()

  // Resolver pricing: amount_override > country_pricing (BD) > PRICING const
  let amount: number   | null = input.amount_override   ?? null
  let currency: string | null = input.currency_override ?? null
  let label = input.service_value

  if (amount === null) {
    const cp = await sb.from('country_pricing')
      .select('price, currency, price_display')
      .eq('country', buyerCountry.toLowerCase())
      .eq('service', input.service_value)
      .eq('active', true)
      .maybeSingle()
    if (cp.data) {
      amount   = Number(cp.data.price)
      currency = cp.data.currency
      label    = cp.data.price_display || input.service_value
    }
  }
  if (amount === null) {
    const pr = getPricingForService(input.service_value, buyerCountry)
    if (pr) { amount = pr.amount; currency = pr.currency; label = pr.label }
  }
  if (amount === null || !currency) {
    return NextResponse.json({ error: 'no_pricing_for_service' }, { status: 400 })
  }

  // Auto-inyectar report_id si business_id existe y no se pasó
  const finalMetadata = { ...(input.metadata ?? {}) } as Record<string, unknown>
  if (!finalMetadata.report_id && business?.latest_report_id) {
    finalMetadata.report_id = business.latest_report_id
  }

  // Crear fila pending en BD
  const gatewayName: PaymentGatewayName = input.gateway ?? getDefaultGateway(buyerCountry)
  const { data: order, error: insErr } = await sb
    .from('payment_orders')
    .insert({
      lead_id:       input.lead_id ?? null,
      business_id:   input.business_id ?? null,
      service_value: input.service_value,
      service_label: label,
      amount,
      currency,
      gateway:       gatewayName,
      status:        'pending',
      buyer_name:    buyerName,
      buyer_email:   buyerEmail,
      buyer_phone:   buyerPhone,
      buyer_country: buyerCountry,
      metadata:      finalMetadata,
    })
    .select('*')
    .single()

  if (insErr || !order) {
    console.error('[api/payments/create] db insert', insErr)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  // Construir URLs (base = la propia app de reports)
  const siteUrl  = process.env.NEXT_PUBLIC_REPORTS_URL ?? 'https://reports.innovando.cl'
  const defaults = makeOrderUrls(siteUrl, input.locale, order.id, gatewayName)
  const urls = {
    successUrl: input.return_success_url ?? defaults.successUrl,
    failureUrl: input.return_failure_url ?? defaults.failureUrl,
    pendingUrl: input.return_pending_url ?? defaults.pendingUrl,
    webhookUrl: defaults.webhookUrl,
  }

  try {
    const gw = getGateway(gatewayName)
    const result = await gw.createOrder({
      orderId:      order.id,
      serviceValue: input.service_value,
      serviceLabel: label,
      amount,
      currency:     currency as any,
      buyerName:    buyerName    ?? undefined,
      buyerEmail:   buyerEmail   ?? undefined,
      buyerPhone:   buyerPhone   ?? undefined,
      buyerCountry: buyerCountry ?? undefined,
      successUrl:   urls.successUrl,
      failureUrl:   urls.failureUrl,
      pendingUrl:   urls.pendingUrl,
      webhookUrl:   urls.webhookUrl,
      metadata:     { lead_id: input.lead_id, business_id: input.business_id, ...finalMetadata },
    })

    await sb.from('payment_orders')
      .update({
        gateway_order_id: result.gatewayOrderId,
        payment_url:      result.paymentUrl,
        success_url:      urls.successUrl,
        failure_url:      urls.failureUrl,
        pending_url:      urls.pendingUrl,
        expires_at:       result.expiresAt?.toISOString() ?? null,
        updated_at:       new Date().toISOString(),
      })
      .eq('id', order.id)

    return NextResponse.json({
      ok:           true,
      order_id:     order.id,
      payment_url:  result.paymentUrl,
      gateway:      gatewayName,
      amount,
      currency,
      stub:         !!(result.rawResponse as any)?.stub,
    })
  } catch (e: any) {
    console.error('[api/payments/create] gateway error', e)
    await sb.from('payment_orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', order.id)
    return NextResponse.json({ error: 'gateway_error', message: e?.message ?? 'unknown' }, { status: 502 })
  }
}
