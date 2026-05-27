import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params
  const sb = createAdminClient()
  const r = await sb
    .from('payment_orders')
    .select('id, service_value, service_label, amount, currency, status, gateway, payment_url, paid_at, created_at')
    .eq('id', orderId)
    .maybeSingle()

  if (!r.data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  return NextResponse.json(r.data)
}
