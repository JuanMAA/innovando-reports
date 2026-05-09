'use client'

import { useEffect, useState } from 'react'

interface Seccion {
  id:     string
  label:  string
  score?: number
  max?:   number
}

interface Modulo {
  code:  string
  score: number
  max:   number
}

interface Props {
  nombre:     string
  ciudad?:    string
  scoreTotal: number
  modulos:    Modulo[]
  secciones:  Seccion[]
  subtitulo?: string
}

function pctColors(pct: number) {
  if (pct >= 0.7) return { bar: 'bg-green-500', txt: 'text-green-400', dot: 'bg-green-500' }
  if (pct >= 0.4) return { bar: 'bg-amber-400', txt: 'text-amber-400', dot: 'bg-amber-400' }
  return { bar: 'bg-red-400', txt: 'text-red-400', dot: 'bg-red-400' }
}

function totalColor(score: number) {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

export default function HeroHeader({ nombre, ciudad, scoreTotal, modulos, secciones, subtitulo }: Props) {
  const [compact,  setCompact]  = useState(false)
  const [active,   setActive]   = useState(secciones[0]?.id ?? '')

  // Comprimir al scrollear
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll spy
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    secciones.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [secciones])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="print:hidden bg-gray-900 border-b border-gray-700 sticky top-0 z-20">

      {/* ── HERO EXPANDIDO ─────────────────────────────── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: compact ? '0px' : '260px', opacity: compact ? 0 : 1 }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">

          {/* Fila: brand + barras de módulos + score total */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-black tracking-widest text-white/30 uppercase shrink-0">
              Innovando
            </span>
            <div className="w-px h-4 bg-gray-700 shrink-0" />

            <div className="flex items-center gap-3 flex-1">
              {modulos.map(({ code, score, max }) => {
                const pct = Math.min(1, score / max)
                const { bar, txt } = pctColors(pct)
                return (
                  <div key={code} className="flex flex-col items-center gap-1 w-8">
                    <span className={`text-xs font-bold tabular-nums leading-none ${txt}`}>{score}</span>
                    <div className="w-full h-1 rounded-full bg-gray-700">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-600 leading-none">{code}</span>
                  </div>
                )
              })}
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-wider">Score total</p>
              <p className={`text-2xl font-black tabular-nums leading-tight ${totalColor(scoreTotal)}`}>
                {scoreTotal}<span className="text-xs text-gray-600 font-normal">/100</span>
              </p>
            </div>
          </div>

          {/* Nombre del negocio */}
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
            {subtitulo ?? 'Reporte de presencia digital'}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {nombre}
          </h1>
          {ciudad && <p className="text-base text-gray-400 mt-2">{ciudad}</p>}

        </div>
      </div>

      {/* ── BARRA COMPACTA ─────────────────────────────── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: compact ? '56px' : '0px', opacity: compact ? 1 : 0 }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-0 h-14 flex items-center gap-3">

          {/* Brand — click vuelve arriba */}
          <button
            onClick={scrollTop}
            className="text-xs font-black tracking-widest text-white/30 uppercase shrink-0 hover:text-white/60 transition-colors"
          >
            Innovando
          </button>

          <div className="w-px h-4 bg-gray-700 shrink-0" />

          {/* Nombre truncado — click vuelve arriba */}
          <button
            onClick={scrollTop}
            className="text-sm font-semibold text-gray-300 truncate shrink-0 max-w-[140px] hidden sm:block hover:text-white transition-colors"
          >
            {nombre}
          </button>

          <div className="w-px h-4 bg-gray-700 shrink-0 hidden sm:block" />

          {/* Secciones — scroll spy nav */}
          <div className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
            {secciones.map((sec) => {
              const isActive = active === sec.id
              const hasPct   = sec.score != null && sec.max != null
              const pct      = hasPct ? sec.score! / sec.max! : null
              const colors   = pct !== null ? pctColors(pct) : null

              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 font-bold text-white'
                      : 'font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {/* Score badge si tiene */}
                  {hasPct && pct !== null && colors && (
                    <span className={`font-bold tabular-nums text-[11px] ${colors.txt}`}>
                      {sec.score}
                    </span>
                  )}

                  {sec.label}

                  {/* Dot activo */}
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      colors ? colors.dot : 'bg-white'
                    }`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Score total compacto */}
          <div className="shrink-0">
            <span className={`text-sm font-black tabular-nums ${totalColor(scoreTotal)}`}>
              {scoreTotal}
            </span>
            <span className="text-xs text-gray-600 font-normal">/100</span>
          </div>

        </div>
      </div>

    </div>
  )
}
