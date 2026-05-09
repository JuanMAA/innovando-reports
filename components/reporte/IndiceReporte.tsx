'use client'

import { useEffect, useState } from 'react'
import { Download, ArrowUp } from 'lucide-react'

interface Seccion {
  id:     string
  label:  string
  score?: number
  max?:   number
}

interface Props {
  nombre:      string
  scoreTotal:  number
  secciones:   Seccion[]
}

function scoreColor(pct: number) {
  if (pct >= 0.7) return 'text-green-600'
  if (pct >= 0.4) return 'text-amber-500'
  return 'text-red-500'
}

function dotColor(pct: number) {
  if (pct >= 0.7) return 'bg-green-500'
  if (pct >= 0.4) return 'bg-amber-400'
  return 'bg-red-400'
}

function totalColor(score: number) {
  if (score >= 70) return 'text-green-500'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

export default function IndiceReporte({ nombre, scoreTotal, secciones }: Props) {
  const [active,  setActive]  = useState<string>(secciones[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [showUp,  setShowUp]  = useState(false)

  // Scroll spy
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    secciones.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [secciones])

  // Show "up" button after scrolling
  useEffect(() => {
    const onScroll = () => setShowUp(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePrint() {
    setLoading(true)
    setTimeout(() => { window.print(); setLoading(false) }, 120)
  }

  return (
    <div className="print:hidden fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-0.5">

      {/* Score total */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400 font-medium">Score</span>
        <span className={`text-2xl font-black tabular-nums leading-none ${totalColor(scoreTotal)}`}>
          {scoreTotal}
        </span>
        <span className="text-xs text-gray-300 font-normal leading-none self-end mb-0.5">/100</span>
      </div>

      {/* Secciones */}
      {secciones.map((sec) => {
        const isActive = active === sec.id
        const hasPct   = sec.score != null && sec.max != null
        const pct      = hasPct ? sec.score! / sec.max! : null

        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="group flex items-center gap-2 py-0.5"
          >
            {/* Score badge */}
            {hasPct && pct !== null ? (
              <span className={`text-xs font-bold tabular-nums transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } ${scoreColor(pct)}`}>
                {sec.score}/{sec.max}
              </span>
            ) : (
              <span className="w-8" /> /* spacer para alinear */
            )}

            {/* Label */}
            <span className={`text-xs whitespace-nowrap transition-all duration-200 ${
              isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-400 group-hover:text-gray-600'
            }`}>
              {sec.label}
            </span>

            {/* Dot */}
            <span className={`rounded-full shrink-0 transition-all duration-300 ${
              isActive && pct !== null ? `w-2 h-2 ${dotColor(pct)}`
              : isActive              ? 'w-2 h-2 bg-gray-800'
              : 'w-1.5 h-1.5 bg-gray-200 group-hover:bg-gray-400'
            }`} />
          </button>
        )
      })}

      {/* Separador */}
      <div className="w-px h-3 bg-gray-200 self-end mr-[3px] my-1.5" />

      {/* PDF */}
      <button
        onClick={handlePrint}
        disabled={loading}
        className="group flex items-center gap-2 py-0.5"
      >
        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors whitespace-nowrap flex items-center gap-1">
          <Download className="w-3 h-3" />
          {loading ? 'Preparando…' : 'PDF'}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors shrink-0" />
      </button>

      {/* Volver arriba */}
      <button
        onClick={scrollTop}
        className={`group flex items-center gap-2 py-0.5 transition-opacity duration-300 ${
          showUp ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors whitespace-nowrap flex items-center gap-1">
          <ArrowUp className="w-3 h-3" />
          Inicio
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors shrink-0" />
      </button>

    </div>
  )
}
