'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle2, Zap, Info } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
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
          {/* Arrow */}
          <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 mx-auto -mt-1.5 rounded-sm" />
        </div>
      )}

      {/* Chip */}
      <span className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3.5 py-1.5 cursor-help transition-colors group">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {chip.label}
        </span>
        <Info className="w-3 h-3 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
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

  /* ── EXPANDED — fondo oscuro al llegar al fondo ─────────────── */
  if (atBottom) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{ background: 'linear-gradient(135deg,#111827 0%,#1f2937 60%,#111827 100%)' }}
      >
        <div className="border-b border-white/10 px-4 sm:px-6 py-4">
          <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
            {CHIPS.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-white/75">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Listo para desbloquear tu reporte
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-white leading-snug">
                Descubre qué te está costando clientes
              </p>
              <p className="text-sm text-white/50 mt-0.5">
                Sin suscripción · acceso único · entrega en horas
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {pricing && (
                <div className="text-center hidden sm:block">
                  <p className="text-xs text-white/40 font-medium">Solo</p>
                  <p className="text-2xl font-black text-white">{pricing.price_display}</p>
                </div>
              )}
              <a
                href={`/pago/${slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-black text-gray-900 hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
              >
                {pricing ? `Ver reporte — ${pricing.price_display}` : 'Ver reporte completo'}
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── COLLAPSED — chips estáticos ───────────────────────────── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">

      {/* Chips row */}
      <div className="border-b border-gray-100 px-4 sm:px-6 py-2">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-x-2 gap-y-1.5 justify-start sm:justify-center">
          {CHIPS.map((chip) => (
            <ChipWithPopover key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              Descubre qué te está costando clientes
            </p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              Sin suscripción · acceso único · entrega en horas
            </p>
          </div>
          <a
            href={`/pago/${slug}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            {pricing ? `Ver reporte — ${pricing.price_display}` : 'Ver reporte'}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
