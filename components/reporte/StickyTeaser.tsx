'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle2, Info } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug:     string
  pricing?: CountryPricing | null
}

const CHIPS = [
  {
    label:  'Puntuación en 6 módulos',
    icon:   '📊',
    detail: 'Google Maps, sitio web, reputación, redes sociales, IA & SEO y plataformas de reserva — todo en un solo número.',
  },
  {
    label:  'Recomendaciones por módulo',
    icon:   '🎯',
    detail: 'Para cada módulo, qué mejorar primero, cómo hacerlo y qué impacto tiene en tu visibilidad y reservas.',
  },
  {
    label:  'Desglose por red social',
    icon:   '📱',
    detail: 'Tips específicos para Instagram, Facebook, TikTok, YouTube y TripAdvisor — según si los tienes o no.',
  },
  {
    label:  'Plataformas de reserva',
    icon:   '🏨',
    detail: 'Estado en Booking.com, Airbnb, Expedia, Despegar y TripAdvisor con botones directos para reservar.',
  },
  {
    label:  'Vs la competencia',
    icon:   '📈',
    detail: 'Benchmark vs negocios similares en tu ciudad: dónde estás parado frente al mercado real.',
  },
  {
    label:  'Descargable en PDF',
    icon:   '📄',
    detail: 'Guarda o imprime tu reporte en cualquier momento para compartirlo con tu equipo o contabilidad.',
  },
]

function ChipWithPopover({ chip }: { chip: typeof CHIPS[number] }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Popover */}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-56 z-50 pointer-events-none">
          <div className="bg-gray-900 rounded-xl px-3.5 py-3 shadow-xl">
            <p className="text-xs font-bold text-white leading-tight mb-1">
              {chip.icon} {chip.label}
            </p>
            <p className="text-xs text-white/60 leading-snug">{chip.detail}</p>
          </div>
          <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 mx-auto -mt-1.5 rounded-sm" />
        </div>
      )}

      {/* Chip */}
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 cursor-help transition-colors group
        bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20">
        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
        <span className="text-xs font-medium text-gray-600 dark:text-white/75 whitespace-nowrap">
          {chip.label}
        </span>
        <Info className="w-2.5 h-2.5 text-gray-300 dark:text-white/25 group-hover:text-gray-500 dark:group-hover:text-white/60 shrink-0 transition-colors" />
      </span>
    </div>
  )
}

export default function StickyTeaser({ slug, pricing }: Props) {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total    = document.documentElement.scrollHeight
      setAtBottom(scrolled >= total - 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const baseBar = 'fixed bottom-0 left-0 right-0 z-30 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]'

  /* ── EXPANDED — chips grid al llegar al fondo ─────── */
  if (atBottom) {
    return (
      <div className={baseBar}>
        {/* Grid con label + descripción */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-3">
          <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {CHIPS.map((c) => (
              <div key={c.label} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-white/85 leading-tight">{c.icon} {c.label}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40 leading-snug mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Fila inferior */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0
                bg-blue-50 border border-blue-200 text-blue-700
                dark:bg-blue-500/20 dark:border-blue-400/30 dark:text-blue-300">
                Reporte completo
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:block">
                Descubre qué te está costando clientes
              </p>
            </div>
          </div>
          <a
            href={`/pago/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all shrink-0 active:scale-95
              bg-gray-900 text-white hover:bg-gray-700
              dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            {pricing ? `Ver reporte — ${pricing.price_display}` : 'Ver reporte'}
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    )
  }

  /* ── COLLAPSED ──────────────────────────────────────── */
  return (
    <div className={baseBar}>

      {/* Mobile: chips arriba, botón abajo */}
      <div className="sm:hidden px-4 py-2 flex flex-col gap-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1.5">
          {CHIPS.map((chip) => (
            <ChipWithPopover key={chip.label} chip={chip} />
          ))}
        </div>
        <a
          href={`/pago/${slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95
            bg-gray-900 text-white hover:bg-gray-700
            dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {pricing ? `Ver reporte — ${pricing.price_display}` : 'Ver reporte'}
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Desktop: layout horizontal original */}
      <div className="hidden sm:flex mx-auto max-w-6xl px-6 py-2.5 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0
              bg-blue-50 border border-blue-200 text-blue-700
              dark:bg-blue-500/20 dark:border-blue-400/30 dark:text-blue-300">
              Reporte completo
            </span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Descubre qué te está costando clientes
            </p>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {CHIPS.map((chip) => (
              <ChipWithPopover key={chip.label} chip={chip} />
            ))}
          </div>
        </div>
        <a
          href={`/pago/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all shrink-0 active:scale-95
            bg-gray-900 text-white hover:bg-gray-700
            dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {pricing ? `Ver reporte — ${pricing.price_display}` : 'Ver reporte'}
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  )
}
