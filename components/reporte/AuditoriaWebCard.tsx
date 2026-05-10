'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Globe } from 'lucide-react'
import { Business } from '@/types'

interface Props {
  business: Business
}

const METRICS = [
  {
    key: 'lh_performance',
    label: 'Velocidad',
    hint: 'Qué tan rápido carga el sitio en móvil. Bajo 50 hace que Google lo penalice y los usuarios lo abandonen.',
  },
  {
    key: 'lh_seo',
    label: 'SEO técnico',
    hint: 'Si Google puede leer e indexar el sitio correctamente para mostrarlo en búsquedas.',
  },
  {
    key: 'lh_accessibility',
    label: 'Accesibilidad',
    hint: 'Qué tan fácil es navegar el sitio para todos los usuarios, incluyendo personas con discapacidad.',
  },
  {
    key: 'lh_best_practices',
    label: 'Buenas prácticas',
    hint: 'Seguridad, HTTPS activo, ausencia de errores de consola y uso correcto de recursos.',
  },
] as const

function metricColor(score: number) {
  if (score >= 70) return { bar: 'bg-green-500', text: 'text-green-600' }
  if (score >= 50) return { bar: 'bg-amber-400', text: 'text-amber-600' }
  return { bar: 'bg-red-400', text: 'text-red-600' }
}

export default function AuditoriaWebCard({ business }: Props) {
  const perf = business.lh_performance
  const lcpSeconds = business.lh_lcp_ms ? (business.lh_lcp_ms / 1000).toFixed(1) : null
  const lcpOk = business.lh_lcp_ms ? business.lh_lcp_ms < 3000 : null

  const hostname = business.website
    ? (() => { try { return new URL(business.website.startsWith('http') ? business.website : `https://${business.website}`).hostname } catch { return business.website } })()
    : null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Sub-header: URL + badge LCP */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-gray-400 shrink-0" />
          <p className="text-sm font-semibold text-gray-700 truncate">
            {hostname ?? 'Sin sitio web propio'}
          </p>
        </div>
        {lcpSeconds && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            lcpOk
              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
          }`}>
            {lcpOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {lcpSeconds}s carga
          </div>
        )}
      </div>

      {/* Métricas */}
      {perf != null ? (
        <div className="flex flex-col gap-4 px-6 py-5">
          {METRICS.map((metric, i) => {
            const score = business[metric.key as keyof Business] as number | null
            if (score == null) return null
            const colors = metricColor(score)
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 items-center"
              >
                <div>
                  <span className="text-base text-gray-700 font-medium">{metric.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{metric.hint}</p>
                </div>
                <span className={`text-base font-bold tabular-nums ${colors.text}`}>{score}</span>
                <div className="col-span-2 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: i * 0.07 + 0.15, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${colors.bar}`}
                  />
                </div>
              </motion.div>
            )
          })}

          {lcpSeconds && !lcpOk && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800 leading-relaxed">
                Tu sitio tarda <strong>{lcpSeconds}s</strong> en cargar en móvil.
                El 53% de los usuarios abandona sitios que tardan más de 3 segundos.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-400">No se encontraron datos de auditoría para este sitio.</p>
        </div>
      )}
    </div>
  )
}
