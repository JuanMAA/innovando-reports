'use client'

import { useMemo } from 'react'
import {
  Heart, MessageCircle, TrendingUp, ThumbsUp, ThumbsDown, Quote,
  Sparkles, AlertTriangle, CheckCircle2, Minus,
} from 'lucide-react'
import { SentimientosData, SentimientosResena } from '@/types'

interface Props {
  data: SentimientosData
}

/* ── helpers ──────────────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 75) return { stroke: '#16a34a', text: 'text-green-600 dark:text-green-400', label: 'Sentimiento muy positivo', dot: 'bg-green-500' }
  if (score >= 55) return { stroke: '#65a30d', text: 'text-lime-600 dark:text-lime-400',   label: 'Sentimiento positivo',     dot: 'bg-lime-500'  }
  if (score >= 40) return { stroke: '#d97706', text: 'text-amber-600 dark:text-amber-400', label: 'Sentimiento mixto',        dot: 'bg-amber-500' }
  return                 { stroke: '#dc2626', text: 'text-red-600 dark:text-red-400',     label: 'Sentimiento negativo',     dot: 'bg-red-500'   }
}

function sentimientoBadge(s: SentimientosResena['sentimiento']) {
  if (s === 'positivo') return { bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300', icon: <ThumbsUp  className="w-3 h-3" />, label: 'Positiva' }
  if (s === 'negativo') return { bg: 'bg-red-50 dark:bg-red-500/15',         text: 'text-red-700 dark:text-red-300',         icon: <ThumbsDown className="w-3 h-3" />, label: 'Negativa' }
  return                       { bg: 'bg-gray-100 dark:bg-gray-800',         text: 'text-gray-600 dark:text-gray-400',       icon: <Minus     className="w-3 h-3" />, label: 'Neutra'   }
}

function plataformaLabel(p: string) {
  const m: Record<string, string> = {
    google:      'Google',
    booking:     'Booking',
    airbnb:      'Airbnb',
    tripadvisor: 'TripAdvisor',
    expedia:     'Expedia',
    despegar:    'Despegar',
  }
  return m[p.toLowerCase()] ?? p
}

/* ── Sub-componentes ──────────────────────────────────────────────── */

function Gauge({ score }: { score: number }) {
  const SIZE = 180
  const STROKE = 14
  const RADIUS = (SIZE - STROKE) / 2
  const C = 2 * Math.PI * RADIUS
  const offset = C - (score / 100) * C
  const { stroke, text, label } = scoreColor(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            stroke="currentColor" className="text-gray-200 dark:text-gray-800"
            strokeWidth={STROKE} fill="none"
          />
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            stroke={stroke} strokeWidth={STROKE} fill="none"
            strokeDasharray={C} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tabular-nums ${text}`}>{score}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-0.5">
            de 100
          </span>
        </div>
      </div>
      <p className={`text-sm font-semibold ${text}`}>{label}</p>
    </div>
  )
}

function DistribucionBar({
  pos, neu, neg,
}: { pos: number; neu: number; neg: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="bg-emerald-500" style={{ width: `${pos}%` }} />
        <div className="bg-gray-400 dark:bg-gray-600" style={{ width: `${neu}%` }} />
        <div className="bg-red-500"     style={{ width: `${neg}%` }} />
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> {pos}% positivas
        </span>
        <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-400" /> {neu}% neutras
        </span>
        <span className="flex items-center gap-1.5 text-red-700 dark:text-red-300">
          <span className="w-2 h-2 rounded-full bg-red-500" /> {neg}% negativas
        </span>
      </div>
    </div>
  )
}

function TemaRow({
  tema, menciones, max, positivo,
}: { tema: string; menciones: number; max: number; positivo: boolean }) {
  const pct = Math.max(8, (menciones / max) * 100)
  const bar = positivo ? 'bg-emerald-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 w-32 truncate">{tema}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500 w-10 text-right">{menciones}</span>
    </div>
  )
}

function PalabraChip({ palabra, peso, sentimiento }: { palabra: string; peso: number; sentimiento: 'pos' | 'neu' | 'neg' }) {
  // peso 0-100 → tamaño y opacidad
  const size = peso > 75 ? 'text-lg'  : peso > 50 ? 'text-base' : peso > 30 ? 'text-sm' : 'text-xs'
  const tone = sentimiento === 'pos'
    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30'
    : sentimiento === 'neg'
    ? 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/30'
    : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold ${size} ${tone}`}>
      {palabra}
    </span>
  )
}

function ResenaCard({ r }: { r: SentimientosResena }) {
  const badge = sentimientoBadge(r.sentimiento)
  return (
    <article className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col gap-2.5">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{r.autor}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {plataformaLabel(r.plataforma)} · {r.fecha}
          </span>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text}`}>
          {badge.icon}
          {badge.label}
        </span>
      </header>

      <div className="flex items-center gap-0.5 text-amber-400 text-xs leading-none">
        {'★'.repeat(Math.round(r.rating))}
        <span className="text-gray-300 dark:text-gray-700">{'★'.repeat(5 - Math.round(r.rating))}</span>
        <span className="ml-1.5 text-[11px] text-gray-500 tabular-nums">{r.rating.toFixed(1)}</span>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <Quote className="inline w-3 h-3 text-gray-300 dark:text-gray-600 mr-1 -mt-0.5" />
        {r.texto}
      </p>
    </article>
  )
}

function EvolucionChart({ data }: { data: NonNullable<SentimientosData['evolucion']> }) {
  if (!data.length) return null
  const W = 100
  const H = 30
  const max = 100
  const min = 0
  const step = data.length > 1 ? W / (data.length - 1) : 0
  const points = data
    .map((d, i) => `${i * step},${H - ((d.score - min) / (max - min)) * H}`)
    .join(' ')

  const ultimo = data[data.length - 1].score
  const primero = data[0].score
  const delta = ultimo - primero

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Evolución últimos {data.length} meses
        </p>
        <span className={`text-xs font-bold tabular-nums ${delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {delta >= 0 ? '+' : ''}{delta} pts
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-16">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500 dark:text-blue-400"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
        {data.map((d, i) => <span key={i}>{d.mes}</span>)}
      </div>
    </div>
  )
}

/* ── Componente principal ─────────────────────────────────────────── */

export default function AnalisisSentimientos({ data }: Props) {
  const maxTemaPos = useMemo(
    () => Math.max(1, ...data.temas_positivos.map(t => t.menciones)),
    [data.temas_positivos],
  )
  const maxTemaNeg = useMemo(
    () => Math.max(1, ...data.temas_negativos.map(t => t.menciones)),
    [data.temas_negativos],
  )

  return (
    <div className="flex flex-col gap-5">

      {/* Header info */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-500/10 dark:via-gray-900 dark:to-blue-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Análisis de sentimientos
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{data.resenas_analizadas.toLocaleString('es-CL')}</span> reseñas analizadas
              {data.total_resenas > data.resenas_analizadas && (
                <span> de <span className="font-semibold text-gray-700 dark:text-gray-300">{data.total_resenas.toLocaleString('es-CL')}</span> totales</span>
              )}
              {' '}· procesadas con IA para detectar emociones, temas recurrentes y oportunidades de mejora.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen + Gauge + Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5">
        {/* Gauge */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
          <Gauge score={data.sentiment_score} />
        </div>

        {/* Resumen + barras */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col gap-5">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.resumen}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Distribución
            </p>
            <DistribucionBar pos={data.positivas_pct} neu={data.neutras_pct} neg={data.negativas_pct} />
          </div>

          {data.evolucion && data.evolucion.length > 1 && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <EvolucionChart data={data.evolucion} />
            </div>
          )}
        </div>
      </div>

      {/* Temas + - */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Lo que aman */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Lo que más destacan</h3>
            <span className="ml-auto text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">Top {data.temas_positivos.length}</span>
          </div>
          {data.temas_positivos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.temas_positivos.map((t, i) => (
                <TemaRow key={i} tema={t.tema} menciones={t.menciones} max={maxTemaPos} positivo />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">Sin temas positivos suficientes para destacar.</p>
          )}
        </div>

        {/* A mejorar */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Oportunidades de mejora</h3>
            <span className="ml-auto text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">Top {data.temas_negativos.length}</span>
          </div>
          {data.temas_negativos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.temas_negativos.map((t, i) => (
                <TemaRow key={i} tema={t.tema} menciones={t.menciones} max={maxTemaNeg} positivo={false} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">No se detectaron quejas recurrentes 🎉</p>
          )}
        </div>
      </div>

      {/* Palabras clave */}
      {data.palabras_clave.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Palabras más mencionadas</h3>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {data.palabras_clave.map((p, i) => (
              <PalabraChip key={i} palabra={p.palabra} peso={p.peso} sentimiento={p.sentimiento} />
            ))}
          </div>
        </div>
      )}

      {/* Reseñas destacadas */}
      {data.resenas_destacadas.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Reseñas destacadas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.resenas_destacadas.map((r, i) => (
              <ResenaCard key={i} r={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
