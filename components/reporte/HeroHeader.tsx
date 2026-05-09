'use client'

import { useEffect, useState, useRef } from 'react'

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
  if (pct >= 0.7) return { bar: 'bg-green-500', txt: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' }
  if (pct >= 0.4) return { bar: 'bg-amber-400', txt: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400' }
  return { bar: 'bg-red-400', txt: 'text-red-600 dark:text-red-400', dot: 'bg-red-400' }
}

function totalColor(score: number) {
  if (score >= 70) return 'text-green-600 dark:text-green-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

export default function HeroHeader({ nombre, ciudad, scoreTotal, modulos, secciones, subtitulo }: Props) {
  const [compact, setCompact] = useState(false)
  const [active,  setActive]  = useState(secciones[0]?.id ?? '')
  const heroRef = useRef<HTMLDivElement>(null)

  // El compact bar aparece cuando el hero se ha ido del viewport
  useEffect(() => {
    const onScroll = () => {
      const heroH = heroRef.current?.offsetHeight ?? 200
      setCompact(window.scrollY > heroH - 20)
    }
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

  // ── Shared module bars markup ─────────────────────────────
  const moduloBars = (
    <div className="flex items-center gap-3 flex-1">
      {modulos.map(({ code, score, max }) => {
        const pct = Math.min(1, score / max)
        const { bar, txt } = pctColors(pct)
        return (
          <div key={code} className="flex flex-col items-center gap-1 w-8">
            <span className={`text-xs font-bold tabular-nums leading-none ${txt}`}>{score}</span>
            <div className="w-full h-1 rounded-full bg-gray-200 dark:bg-gray-700">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct * 100}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-600 leading-none">{code}</span>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {/* ── HERO — flujo normal, NO sticky ───────────────────
          Scrollea con la página sin causar layout shifts.         */}
      <div
        ref={heroRef}
        className="print:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">

          {/* Fila: brand + barras + score total */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-black tracking-widest text-gray-300 dark:text-white/30 uppercase shrink-0">
              Innovando
            </span>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 shrink-0" />
            {moduloBars}
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight uppercase tracking-wider">
                Score total
              </p>
              <p className={`text-2xl font-black tabular-nums leading-tight ${totalColor(scoreTotal)}`}>
                {scoreTotal}
                <span className="text-xs text-gray-300 dark:text-gray-600 font-normal">/100</span>
              </p>
            </div>
          </div>

          {/* Nombre del negocio */}
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">
            {subtitulo ?? 'Reporte de presencia digital'}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {nombre}
          </h1>
          {ciudad && (
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">{ciudad}</p>
          )}

        </div>
      </div>

      {/* ── COMPACT BAR — fixed, entra desde arriba con translateY ──
          No afecta el layout (position: fixed), sin saltos.         */}
      <div
        className={`print:hidden fixed top-0 left-0 right-0 z-20 h-14
          bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
          shadow-sm dark:shadow-black/30
          transition-transform duration-200 ease-out
          ${compact ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-full flex items-center gap-3">

          {/* Brand */}
          <button
            onClick={scrollTop}
            className="text-xs font-black tracking-widest text-gray-300 dark:text-white/30 uppercase shrink-0 hover:text-gray-500 dark:hover:text-white/60 transition-colors"
          >
            Innovando
          </button>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 shrink-0" />

          {/* Nombre */}
          <button
            onClick={scrollTop}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 truncate shrink-0 max-w-[140px] hidden sm:block hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {nombre}
          </button>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 shrink-0 hidden sm:block" />

          {/* Secciones nav */}
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-100 dark:bg-white/10 font-bold text-gray-900 dark:text-white'
                      : 'font-medium text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {hasPct && pct !== null && colors && (
                    <span className={`font-bold tabular-nums text-[11px] ${colors.txt}`}>
                      {sec.score}
                    </span>
                  )}
                  {sec.label}
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      colors ? colors.dot : 'bg-gray-800 dark:bg-white'
                    }`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Score total */}
          <span className={`text-sm font-black tabular-nums shrink-0 ${totalColor(scoreTotal)}`}>
            {scoreTotal}
            <span className="text-xs text-gray-300 dark:text-gray-600 font-normal">/100</span>
          </span>

        </div>
      </div>
    </>
  )
}
