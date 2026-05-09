'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const CHIPS = [
  { label: 'Puntuación en 6 módulos',       icon: '📊' },
  { label: 'Recomendaciones por módulo',     icon: '🎯' },
  { label: 'Desglose por red social',        icon: '📱' },
  { label: 'Plataformas de reserva',         icon: '🏨' },
  { label: 'Comparación con la competencia', icon: '📈' },
  { label: 'Descargable en PDF',             icon: '📄' },
]

const INTERVAL = 5000

export default function StickyTeaser({ slug, pricing }: Props) {
  const [atBottom,    setAtBottom]    = useState(false)
  const [current,     setCurrent]     = useState(0)
  const [direction,   setDirection]   = useState(1)
  const [progressKey, setProgressKey] = useState(0)

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

  useEffect(() => {
    if (atBottom) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(prev => (prev + 1) % CHIPS.length)
      setProgressKey(k => k + 1)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [atBottom])

  function goTo(i: number) {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
    setProgressKey(k => k + 1)
  }

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

  /* ── COLLAPSED — chips carousel ─────────────────────────────── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">

      {/* Chips row */}
      <div className="border-b border-gray-100 px-4 sm:px-6 py-2.5 relative overflow-hidden">
        <div className="mx-auto max-w-5xl flex items-center gap-3">

          {/* Chip animado */}
          <div className="relative h-7 flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={{
                  enter:  (d: number) => ({ y: d > 0 ? 14 : -14, opacity: 0 }),
                  center: { y: 0, opacity: 1 },
                  exit:   (d: number) => ({ y: d > 0 ? -14 : 14, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center"
              >
                <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-1.5 max-w-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {CHIPS[current].icon} {CHIPS[current].label}
                  </span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1 shrink-0">
            {CHIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-4 h-1.5 bg-gray-700'
                    : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-100">
          <div key={progressKey} className="h-full bg-gray-400 animate-teaser-progress" />
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
