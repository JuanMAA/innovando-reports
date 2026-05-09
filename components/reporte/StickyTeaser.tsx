'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const INCLUIDO = [
  { label: 'Puntuación en 6 módulos',           detail: 'Google Maps, web, reputación, redes, IA y plataformas' },
  { label: 'Recomendaciones por módulo',         detail: 'Acciones concretas para mejorar cada área' },
  { label: 'Desglose por red social',            detail: 'Instagram, Facebook, TikTok, YouTube y TripAdvisor' },
  { label: 'Plataformas de reserva',             detail: 'Booking, Airbnb, Expedia, Despegar y TripAdvisor' },
  { label: 'Comparación con la competencia',     detail: 'Benchmarking vs negocios similares en tu ciudad' },
  { label: 'Descargable en PDF',                 detail: 'Comparte o imprime tu reporte cuando quieras' },
]

// Solo los más cortos para la barra colapsada (caben en una línea)
const INCLUIDO_SHORT = [
  '6 módulos analizados',
  'Redes sociales',
  'Plataformas de reserva',
  'Comparación competitiva',
  'Descargable en PDF',
]

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

  /* ── EXPANDED — al llegar al fondo ─────────────────────────── */
  if (atBottom) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-500"
        style={{ background: 'linear-gradient(135deg,#111827 0%,#1f2937 60%,#111827 100%)' }}
      >
        {/* Grid de features */}
        <div className="border-b border-white/10 px-4 sm:px-6 py-4">
          <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
            {INCLUIDO.map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white/85 leading-tight">{item.label}</p>
                  <p className="text-xs text-white/40 leading-tight hidden sm:block">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA principal */}
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

  /* ── COLLAPSED — estado normal ──────────────────────────────── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition-all duration-500">

      {/* Marquee row */}
      <div className="border-b border-gray-100 py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Duplicamos para loop continuo */}
          {[...INCLUIDO_SHORT, ...INCLUIDO_SHORT].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 mx-5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="text-xs text-gray-500 font-medium">{item}</span>
            </div>
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
              6 módulos · redes · plataformas · benchmark · PDF · sin suscripción
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pricing && (
              <span className="hidden md:inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900">
                {pricing.price_display}
              </span>
            )}
            <a
              href={`/pago/${slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
            >
              <span className="hidden sm:inline">Ver reporte —</span>
              <span>{pricing ? pricing.price_display : 'Ver precio'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
