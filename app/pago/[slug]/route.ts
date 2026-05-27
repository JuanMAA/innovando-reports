/**
 * GET /pago/[slug]?service=reporte_completo
 *
 * Inicia el flujo de pago para desbloquear un informe:
 *   1. Resuelve el business por slug
 *   2. Llama al API de pagos en innovando-landing
 *   3. Redirige al usuario a la URL de pago devuelta
 *
 * El webhook de la pasarela marcará `reports.is_unlocked = true`
 * cuando el pago se confirme; el success_url devuelve al usuario al reporte.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? 'https://innovando.cl'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const url      = new URL(req.url)
  const service  = url.searchParams.get('service') ?? 'reporte_completo'
  const locale   = url.searchParams.get('locale')  ?? 'es'

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

  // Elegir qué reporte vamos a desbloquear según el service
  const reportId = service === 'huella_digital'
    ? business.latest_huella_report_id
    : business.latest_report_id

  if (!reportId) {
    return NextResponse.json({ error: 'report_not_found_for_business' }, { status: 404 })
  }

  // Volver al reporte cuando el pago termine
  const origin    = url.origin
  const reportUrl = service === 'huella_digital'
    ? `${origin}/${slug}/huella-digital`
    : `${origin}/${slug}/presencia-digital`

  // Llamar al landing para crear la orden
  const body = {
    service_value: service,
    business_id:   business.id,
    country:       business.country?.toUpperCase() ?? 'CL',
    locale,
    metadata: { report_id: reportId, source: 'reports' },
    return_success_url: `${reportUrl}?paid=1`,
    return_failure_url: `${reportUrl}?paid=failed`,
    return_pending_url: `${reportUrl}?paid=pending`,
  }

  let payload: any = {}
  try {
    const r = await fetch(`${LANDING_URL}/api/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    payload = await r.json().catch(() => ({}))
    if (!r.ok) {
      console.error('[pago] landing API error', r.status, payload)
      return NextResponse.json({ error: 'payment_create_failed', detail: payload }, { status: 502 })
    }
  } catch (e: any) {
    console.error('[pago] fetch failed', e)
    return NextResponse.json({ error: 'payment_create_unreachable' }, { status: 502 })
  }

  const paymentUrl = payload.payment_url
  if (!paymentUrl) {
    return NextResponse.json({ error: 'no_payment_url' }, { status: 500 })
  }

  return NextResponse.redirect(paymentUrl, { status: 303 })
}
