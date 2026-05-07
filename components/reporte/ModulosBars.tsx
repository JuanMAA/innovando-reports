'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Report } from '@/types'

interface Props {
  report: Report
  teaser?: boolean
}

const MODULOS = [
  { key: 'score_p2a', label: 'Google Maps', desc: 'Ficha y reseñas', max: 15, code: 'P2a',
    hint: 'Completitud del perfil, fotos, calificación y cantidad de reseñas.' },
  { key: 'score_p2b', label: 'Sitio web', desc: 'Presencia propia', max: 20, code: 'P2b',
    hint: 'Velocidad de carga, SEO técnico, adaptación a móvil y seguridad HTTPS.' },
  { key: 'score_p2c', label: 'Reputación', desc: 'Calificaciones', max: 20, code: 'P2c',
    hint: 'Promedio de estrellas y volumen de reseñas en Google.' },
  { key: 'score_p2d', label: 'Redes sociales', desc: 'Instagram y más', max: 10, code: 'P2d',
    hint: 'Presencia activa en Instagram y Facebook.' },
  { key: 'score_p2e', label: 'SEO', desc: 'Posicionamiento', max: 10, code: 'P2e',
    hint: 'Aparición en búsquedas de Google para términos clave del negocio.' },
  { key: 'score_p2f', label: 'Plataformas', desc: 'Booking, Airbnb…', max: 25, code: 'P2f',
    hint: 'Presencia y completitud en Booking, Airbnb, TripAdvisor y similares.' },
] as const

const VISIBLE_IN_TEASER = new Set(['P2a', 'P2b', 'P2c'])

function barColor(pct: number) {
  if (pct >= 0.7) return 'bg-green-500'
  if (pct >= 0.4) return 'bg-amber-400'
  return 'bg-red-400'
}

function scoreLabel(pct: number) {
  if (pct >= 0.7) return 'text-green-600'
  if (pct >= 0.4) return 'text-amber-600'
  return 'text-red-500'
}

export default function ModulosBars({ report, teaser = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {MODULOS.map((modulo, i) => {
        const rawScore = report[modulo.key as keyof Report] as number
        const score = Math.min(rawScore, modulo.max)
        const pct = Math.min(1, rawScore / modulo.max)
        const isLocked = teaser && !VISIBLE_IN_TEASER.has(modulo.code)

        return (
          <motion.div
            key={modulo.code}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-base font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                  {modulo.label}
                </span>
                <span className={`text-sm ml-2 ${isLocked ? 'text-gray-300' : 'text-gray-400'}`}>
                  {modulo.desc}
                </span>
              </div>
              {isLocked ? (
                <Lock className="w-4 h-4 text-gray-300 shrink-0" />
              ) : (
                <span className={`text-base font-bold tabular-nums shrink-0 ${scoreLabel(pct)}`}>
                  {score}
                  <span className="text-gray-300 font-normal text-sm">/{modulo.max}</span>
                </span>
              )}
            </div>

            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              {isLocked ? (
                <div className="h-full w-1/3 rounded-full bg-gray-200 opacity-50" />
              ) : (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ delay: i * 0.07 + 0.15, duration: 0.65, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor(pct)}`}
                />
              )}
            </div>

            {isLocked ? (
              <p className="text-xs text-gray-300 mt-1">Incluido en el reporte completo</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1.5">{modulo.hint}</p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
