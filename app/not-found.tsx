'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, ExternalLink, Heart, Globe, Smartphone,
  ChevronLeft, AlertCircle,
} from 'lucide-react'

type Theme = {
  slug:        string
  label:       string
  hex:         string
  text:        string
  iconBg:      string
  Icon:        React.ComponentType<{ className?: string }>
}

const DEMOS: Theme[] = [
  {
    slug:   'presencia-digital',
    label:  'Informe de Presencia Digital',
    hex:    '#0d9488',
    text:   'text-teal-700',
    iconBg: 'bg-teal-100',
    Icon:   Smartphone,
  },
  {
    slug:   'auditoria-web',
    label:  'Auditoría de Sitio Web',
    hex:    '#2563eb',
    text:   'text-blue-700',
    iconBg: 'bg-blue-100',
    Icon:   Globe,
  },
  {
    slug:   'huella-digital',
    label:  'Auditoría Huella Digital',
    hex:    '#7c3aed',
    text:   'text-violet-700',
    iconBg: 'bg-violet-100',
    Icon:   Heart,
  },
]

const COUNTDOWN_SECONDS = 10
const REDIRECT_TARGET   = 'https://innovando.cl'

export default function NotFound() {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const [paused, setPaused]           = useState(false)

  useEffect(() => {
    if (paused) return
    if (secondsLeft <= 0) {
      window.location.href = REDIRECT_TARGET
      return
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, paused])

  const pct = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100
  const C = 2 * Math.PI * 44

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >

        {/* Card principal */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">

          {/* Top — countdown + 404 */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 flex flex-col items-center text-center gap-4">

            <div className="relative">
              <svg width="120" height="120" className="-rotate-90">
                <circle cx="60" cy="60" r="44" stroke="currentColor" className="text-gray-100 dark:text-slate-800" strokeWidth="8" fill="none" />
                <circle
                  cx="60" cy="60" r="44"
                  stroke="#475569" strokeWidth="8" fill="none"
                  strokeDasharray={C}
                  strokeDashoffset={C - (pct / 100) * C}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-200">404</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-3 h-3" />
              Página no encontrada
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Esta URL no existe
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Es posible que el enlace esté roto o que el reporte ya no esté disponible.
              Te redirigimos a <span className="font-mono text-xs">innovando.cl</span> en{' '}
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">{secondsLeft}s</span>.
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <a
                href={REDIRECT_TARGET}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-slate-700 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Ir a innovando.cl
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {paused ? 'Reanudar' : 'Pausar'}
              </button>
              <button
                type="button"
                onClick={() => history.back()}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-800" />

          {/* Quick access — demos */}
          <div className="px-6 py-6 sm:px-10 bg-gray-50/50 dark:bg-slate-950/40">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
              Tal vez te interese ver un informe de ejemplo
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMOS.map((t) => {
                const T = t.Icon
                return (
                  <a
                    key={t.slug}
                    href={`/demo/${t.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.iconBg}`}>
                      <T className={`w-4 h-4 ${t.text}`} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">{t.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                        Ver demo →
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pie */}
        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6 inline-flex items-center gap-1.5 w-full justify-center">
          <ExternalLink className="w-3 h-3" />
          reports.innovando.cl
        </p>
      </motion.div>
    </div>
  )
}
