'use client'

import { useState } from 'react'
import type { BenchmarkData, BenchmarkGroup } from '@/lib/benchmark'

// ── Tipos locales ────────────────────────────────────────────
interface BusinessMetrics {
  score_total:    number
  score_p2a:      number
  score_p2c:      number
  score_p2f:      number
  rating:         number | null
  num_reviews:    number
  lh_performance: number | null
}

interface Props {
  business:  BusinessMetrics
  benchmark: BenchmarkData
  businessName: string
}

// ── Constantes de módulos ────────────────────────────────────
const MODULOS = [
  { key: 'p2a', label: 'Ficha Google',     hint: 'Fotos, horarios, descripción, teléfono',          bizKey: 'score_p2a', benchKey: 'avg_p2a',  max: 30, color: 'bg-blue-500'    },
  { key: 'p2c', label: 'Reputación',        hint: 'Reseñas, rating, tendencia, palabras clave',       bizKey: 'score_p2c', benchKey: 'avg_p2c',  max: 25, color: 'bg-violet-500' },
  { key: 'p2f', label: 'Plataformas OTA',  hint: 'Booking, Airbnb, TripAdvisor, Expedia, Despegar',  bizKey: 'score_p2f', benchKey: 'avg_p2f',  max: 25, color: 'bg-emerald-500'},
  { key: 'lh',  label: 'Sitio web',         hint: 'Velocidad, SEO técnico, buenas prácticas',         bizKey: 'lh_performance', benchKey: 'avg_lh', max: 100, color: 'bg-amber-500', isLh: true },
] as const

// ── Helpers ──────────────────────────────────────────────────
function pctColor(pct: number) {
  if (pct >= 75) return 'text-emerald-600'
  if (pct >= 50) return 'text-blue-600'
  if (pct >= 25) return 'text-amber-600'
  return 'text-red-500'
}

function diffLabel(mine: number, avg: number) {
  const d = Math.round((mine - avg) * 10) / 10
  if (Math.abs(d) < 1) return <span className="text-gray-400 text-xs">≈ igual</span>
  return d > 0
    ? <span className="text-emerald-600 text-xs font-semibold">+{d} pts ↑</span>
    : <span className="text-red-500 text-xs font-semibold">{d} pts ↓</span>
}

function PercentilBadge({ pct }: { pct: number }) {
  const color = pct >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
              : pct >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800'
              : pct >= 25 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800'
              :             'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800'
  const label = pct >= 75 ? 'Top 25%'
              : pct >= 50 ? 'Sobre promedio'
              : pct >= 25 ? 'Bajo promedio'
              :             'Bottom 25%'
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2 py-0.5 ${color}`}>
      {label}
    </span>
  )
}

// ── Barra comparativa ────────────────────────────────────────
function CompareBar({
  myValue, avgValue, max, color, label, myLabel, avgLabel, isPercent = false
}: {
  myValue: number | null
  avgValue: number | null
  max: number
  color: string
  label: string
  myLabel: string
  avgLabel: string
  isPercent?: boolean
}) {
  if (myValue === null && avgValue === null) return null
  const myPct  = myValue  !== null ? Math.min(100, (myValue  / max) * 100) : null
  const avgPct = avgValue !== null ? Math.min(100, (avgValue / max) * 100) : null

  const fmt = (v: number) => isPercent ? `${Math.round(v)}` : v.toFixed(1)

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      {/* Mi barra */}
      {myPct !== null && (
        <div className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-700 text-right shrink-0 dark:text-gray-300">{myLabel}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${myPct}%` }} />
          </div>
          <span className="w-10 text-xs font-semibold text-gray-800 text-right shrink-0 dark:text-gray-200">
            {fmt(myValue!)}
          </span>
        </div>
      )}
      {/* Barra promedio */}
      {avgPct !== null && (
        <div className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-400 text-right shrink-0 dark:text-gray-500">{avgLabel}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden relative dark:bg-gray-800">
            <div className="h-full rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: `${avgPct}%` }} />
          </div>
          <span className="w-10 text-xs text-gray-400 text-right shrink-0 dark:text-gray-500">
            {fmt(avgValue!)}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Tarjeta de grupo ─────────────────────────────────────────
function GroupCard({
  group, business, active, onClick
}: {
  group: BenchmarkGroup
  business: BusinessMetrics
  active: boolean
  onClick: () => void
}) {
  const diff = business.score_total - group.avg_score

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${
        active
          ? 'border-blue-400 bg-blue-50 shadow-sm dark:border-blue-500 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700'
      }`}
    >
      <p className="text-xs text-gray-500 mb-0.5 dark:text-gray-400">{group.sublabel}</p>
      <p className="font-semibold text-gray-900 text-sm leading-snug dark:text-gray-100">{group.label}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Prom. score</span>
        <span className="font-bold text-gray-800 dark:text-gray-200">{group.avg_score}</span>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">Tu diferencia</span>
        <span className={`text-xs font-bold ${diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {diff >= 0 ? '+' : ''}{Math.round(diff * 10) / 10} pts
        </span>
      </div>
      {group.pct_score !== undefined && (
        <div className="mt-2">
          <PercentilBadge pct={group.pct_score} />
        </div>
      )}
    </button>
  )
}

// ── Panel detallado de un grupo ──────────────────────────────
function GroupDetail({ group, business, catLabel }: { group: BenchmarkGroup; business: BusinessMetrics; catLabel: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-5 dark:border-gray-700 dark:bg-gray-900">

      {/* Header */}
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{group.label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{group.sublabel}</p>
      </div>

      {/* Score principal con percentil */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{business.score_total}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">tu score</p>
        </div>
        <div className="flex-1">
          <div className="flex items-end justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Tú</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{business.score_total}/100</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2 dark:bg-gray-700">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${business.score_total}%` }} />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">Promedio</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{group.avg_score}/100</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div className="h-full rounded-full bg-gray-400" style={{ width: `${group.avg_score}%` }} />
          </div>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${pctColor(group.pct_score)}`}>{group.pct_score}°</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">percentil</p>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Métricas clave</p>

        {/* Rating */}
        <CompareBar
          myValue={business.rating}
          avgValue={group.avg_rating}
          max={5}
          color="bg-amber-400"
          label="Rating Google ⭐"
          myLabel="Tu rating"
          avgLabel="Promedio"
        />

        {/* Reseñas */}
        <CompareBar
          myValue={business.num_reviews}
          avgValue={group.avg_reviews}
          max={Math.max(business.num_reviews, group.avg_reviews, 1) * 1.2}
          color="bg-blue-400"
          label="Número de reseñas"
          myLabel="Tus reseñas"
          avgLabel="Promedio"
          isPercent
        />
      </div>

      {/* Módulos detallados */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Detalle por área</p>
        {MODULOS.map(mod => {
          const myVal  = (business as any)[mod.bizKey]  as number | null
          const avgVal = (group   as any)[mod.benchKey] as number | null
          if (myVal === null && avgVal === null) return null
          const diff = (myVal !== null && avgVal !== null) ? myVal - avgVal : null
          return (
            <div key={mod.key} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 font-medium dark:text-gray-300">{mod.label}</span>
                  <div className="flex items-center gap-1.5">
                    {diff !== null && diffLabel(myVal!, avgVal!)}
                    <span className="text-xs text-gray-800 font-semibold dark:text-gray-200">{myVal ?? '—'}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative dark:bg-gray-800">
                  {/* Barra promedio (fondo) */}
                  {avgVal !== null && (
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gray-200 dark:bg-gray-700"
                      style={{ width: `${Math.min(100, (avgVal / mod.max) * 100)}%` }}
                    />
                  )}
                  {/* Barra mía (encima) */}
                  {myVal !== null && (
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${mod.color}`}
                      style={{ width: `${Math.min(100, (myVal / mod.max) * 100)}%` }}
                    />
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">{mod.hint}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────
export default function ComparacionBenchmark({ business, benchmark, businessName }: Props) {
  const { groups, catLabel } = benchmark
  const [activeIdx, setActiveIdx] = useState(0)

  if (!groups.length) return null

  const activeGroup = groups[activeIdx]

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5 dark:text-gray-500">Comparación competitiva</p>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">¿Cómo se posiciona {businessName}?</h2>
        <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">
          Comparado contra {catLabel.toLowerCase()} similares en distintos niveles geográficos.
        </p>
      </div>

      {/* Selector de grupos */}
      <div className={`grid gap-3 ${groups.length >= 4 ? 'grid-cols-2 lg:grid-cols-4' : groups.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
        {groups.map((g, i) => (
          <GroupCard
            key={i}
            group={g}
            business={business}
            active={activeIdx === i}
            onClick={() => setActiveIdx(i)}
          />
        ))}
      </div>

      {/* Detalle del grupo seleccionado */}
      <GroupDetail group={activeGroup} business={business} catLabel={catLabel} />

      {/* Nota metodológica */}
      <p className="text-[11px] text-gray-400 leading-relaxed dark:text-gray-500">
        * Los promedios se calculan sobre negocios activos en nuestra base de datos al momento del análisis.
        {benchmark.catKeyword && ` Categoría "${catLabel}" detectada automáticamente desde Google Maps.`}
      </p>
    </div>
  )
}
