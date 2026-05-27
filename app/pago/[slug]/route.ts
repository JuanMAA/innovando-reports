/**
 * GET /pago/[slug]?service=reporte_completo
 *
 * Inicia el flujo de pago para desbloquear un informe.
 *   1. Resuelve el business por slug
 *   2. Crea la orden directamente en BD vía la capa local de pagos
 *      (sin saltar a innovando-landing).
 *   3. Redirige al usuario a la URL de pago devuelta por la pasarela.
 *
 * El webhook de la pasarela (/api/payments/webhook/[gateway]) marcará
 * reports.is_unlocked = true cuando se confirme.
 */

import { NextResponse, type NextRequest } from 'next/server'
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const url      = new URL(req.url)
  const service  = url.searchParams.get('service') ?? 'reporte_completo'
  const locale   = url.searchParams.get('locale')  ?? 'es'
  const gwParam  = url.searchParams.get('gateway') as PaymentGatewayName | null

  const sb = createAdminClient()
  const { data: business } = await sb
    .from('businesses')
    .select('id, name, country, latest_report_id, latest_huella_report_id')
    .eq('slug', slug)
    .maybeSingle<{
      id: string; name: string; country: string;
      latest_report_id: string | null;
      latest_huella_report_id: string | null;
    }>()

  if (!business) {
    return NextResponse.json({ error: 'business_not_found' }, { status: 404 })
  }

  const reportId = service === 'huella_digital'
    ? business.latest_huella_report_id
    : business.latest_report_id

  if (!reportId) {
    return NextResponse.json({ error: 'report_not_found_for_business' }, { status: 404 })
  }

  const country = (business.country ?? 'cl').toUpperCase()
  const origin  = url.origin
  const reportPath = service === 'huella_digital' ? 'huella-digital' : 'presencia-digital'
  const reportUrl  = `${origin}/${slug}/${reportPath}`

  // ── Pricing: country_pricing (BD) → fallback const ─────────────
  let amount: number   | null = null
  let currency: string | null = null
  let label = service

  const cp = await sb.from('country_pricing')
    .select('price, currency, price_display')
    .eq('country', country.toLowerCase())
    .eq('service', service)
    .eq('active', true)
    .maybeSingle()
  if (cp.data) {
    amount   = Number(cp.data.price)
    currency = cp.data.currency
    label    = cp.data.price_display || service
  } else {
    const pr = getPricingForService(service, country)
    if (pr) { amount = pr.amount; currency = pr.currency; label = pr.label }
  }
  if (amount === null || !currency) {
    return NextResponse.json({ error: 'no_pricing_for_service', service, country }, { status: 400 })
  }

  // ── Crear orden en payment_orders ────────────────────────────
  const gatewayName: PaymentGatewayName = gwParam ?? getDefaultGateway(country)
  const { data: order, error: insErr } = await sb
    .from('payment_orders')
    .insert({
      business_id:   business.id,
      service_value: service,
      service_label: label,
      amount,
      currency,
      gateway:       gatewayName,
      status:        'pending',
      buyer_country: country,
      metadata:      { report_id: reportId, source: 'reports', slug },
    })
    .select('*')
    .single()

  if (insErr || !order) {
    console.error('[pago] db insert', insErr)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  // ── URLs de retorno ──────────────────────────────────────────
  const siteUrl  = process.env.NEXT_PUBLIC_REPORTS_URL ?? origin
  const defaults = makeOrderUrls(siteUrl, locale, order.id, gatewayName)
  const urls = {
    successUrl: `${reportUrl}?paid=1`,
    failureUrl: `${reportUrl}?paid=failed`,
    pendingUrl: `${reportUrl}?paid=pending`,
    webhookUrl: defaults.webhookUrl,
  }

  // ── Llamar a la pasarela ─────────────────────────────────────
  try {
    const gw = getGateway(gatewayName)
    const result = await gw.createOrder({
      orderId:      order.id,
      serviceValue: service,
      serviceLabel: label,
      amount,
      currency:     currency as any,
      buyerCountry: country,
      successUrl:   urls.successUrl,
      failureUrl:   urls.failureUrl,
      pendingUrl:   urls.pendingUrl,
      webhookUrl:   urls.webhookUrl,
      metadata:     { report_id: reportId, business_id: business.id, source: 'reports' },
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

    return NextResponse.redirect(result.paymentUrl, { status: 303 })
  } catch (e: any) {
    console.error('[pago] gateway error', e)
    await sb.from('payment_orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', order.id)
    return NextResponse.json({ error: 'gateway_error', message: e?.message ?? 'unknown' }, { status: 502 })
  }
}
