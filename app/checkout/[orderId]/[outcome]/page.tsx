/**
 * Outcome page genérica: success | failed | pending.
 * Las pasarelas redirigen acá tras el pago (back_urls).
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'

type Outcome = 'success' | 'failed' | 'pending'

interface Props {
  params: Promise<{ orderId: string; outcome: Outcome }>
}

const COPY: Record<Outcome, { title: string; subtitle: string; cta: string; emoji: string; tone: string }> = {
  success: {
    title:    '¡Pago recibido!',
    subtitle: 'Tu informe ya está desbloqueado. Si no lo ves, refrescá la página en unos segundos.',
    cta:      'Volver al informe',
    emoji:    '✓',
    tone:     'emerald',
  },
  pending: {
    title:    'Pago en revisión',
    subtitle: 'Tu pago quedó pendiente de confirmación. Apenas se aprueba, el informe se desbloquea automáticamente.',
    cta:      'Ver mi informe',
    emoji:    '⏳',
    tone:     'amber',
  },
  failed: {
    title:    'No se pudo cobrar',
    subtitle: 'La pasarela rechazó el pago o lo cancelaste. Podés intentar de nuevo o escribirnos por WhatsApp.',
    cta:      'Volver',
    emoji:    '✕',
    tone:     'rose',
  },
}

export default async function CheckoutOutcomePage({ params }: Props) {
  const { orderId, outcome } = await params
  if (!['success', 'failed', 'pending'].includes(outcome)) notFound()
  const t = COPY[outcome]

  const siteUrl = process.env.NEXT_PUBLIC_REPORTS_URL ?? 'https://reports.innovando.cl'
  let order: any = null
  try {
    const res = await fetch(`${siteUrl}/api/payments/status/${orderId}`, { cache: 'no-store' })
    if (res.ok) order = await res.json()
  } catch { /* ignore */ }

  // Si conocemos el business slug del lead/business, podríamos volver al reporte.
  // Por simplicidad mandamos al home (el botón de WhatsApp resuelve el resto).
  const homeUrl = '/'

  const ring = t.tone === 'emerald' ? 'ring-emerald-200 bg-emerald-50 text-emerald-700'
            : t.tone === 'amber'    ? 'ring-amber-200 bg-amber-50 text-amber-700'
            : 'ring-rose-200 bg-rose-50 text-rose-700'

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ring-4 ${ring} text-3xl font-bold`}>
          {t.emoji}
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t.subtitle}</p>

        {order && (
          <div className="mt-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-left text-xs space-y-1">
            <div className="flex justify-between"><span className="text-gray-400">Servicio</span><span className="font-semibold">{order.service_label}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Monto</span><span className="font-semibold">{order.currency} {Number(order.amount).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Estado</span><span className="font-mono uppercase">{order.status}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Orden</span><span className="font-mono">{order.id.slice(0, 8)}…</span></div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={homeUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-5 py-2.5"
          >
            {t.cta}
          </Link>
          <a
            href="https://wa.me/56987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ¿Necesitás ayuda? Escribinos por WhatsApp →
          </a>
        </div>
      </div>
    </div>
  )
}
