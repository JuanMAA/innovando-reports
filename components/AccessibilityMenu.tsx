'use client'

import { useState, useEffect } from 'react'
import {
  Accessibility, Moon, Sun, Type, Contrast,
  RotateCcw, X, Minus, Plus, Palette, FlipVertical2, Link,
} from 'lucide-react'

type Prefs = {
  darkMode:       boolean
  fontSize:       number   // 0 | 1 | 2
  highContrast:   boolean
  grayscale:      boolean
  invertColors:   boolean
  highlightLinks: boolean
}

const DEFAULTS: Prefs = {
  darkMode:       false,
  fontSize:       0,
  highContrast:   false,
  grayscale:      false,
  invertColors:   false,
  highlightLinks: false,
}

function applyPrefs(p: Prefs) {
  const html = document.documentElement
  const filters: string[] = []
  if (p.darkMode)     filters.push('invert(1) hue-rotate(180deg)')
  if (p.invertColors) filters.push('invert(1)')
  if (p.grayscale)    filters.push('grayscale(1)')
  if (p.highContrast) filters.push('contrast(1.5) saturate(1.1)')
  html.style.filter   = filters.join(' ')
  html.dataset.darkMode      = p.darkMode      ? '1' : '0'
  html.dataset.highlightLinks = p.highlightLinks ? '1' : '0'
  html.style.fontSize = (['100%', '112%', '130%'] as const)[p.fontSize]
}

function Toggle({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
      {label}
      {active && <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
    </button>
  )
}

export default function AccessibilityMenu() {
  const [open,  setOpen]  = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y-prefs')
      if (saved) {
        const p = JSON.parse(saved) as Prefs
        setPrefs(p)
        applyPrefs(p)
      }
    } catch {}
  }, [])

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    applyPrefs(next)
    localStorage.setItem('a11y-prefs', JSON.stringify(next))
  }

  const reset = () => {
    setPrefs(DEFAULTS)
    applyPrefs(DEFAULTS)
    localStorage.removeItem('a11y-prefs')
  }

  const hasAny = prefs.darkMode || prefs.highContrast || prefs.grayscale ||
                 prefs.invertColors || prefs.highlightLinks || prefs.fontSize > 0

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Menú de accesibilidad"
        aria-expanded={open}
        className="print:hidden fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
      >
        <Accessibility className="w-5 h-5" />
        {hasAny && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Opciones de accesibilidad"
          className="print:hidden fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl w-72 overflow-hidden"
          style={{ bottom: '4.5rem', right: '1.25rem' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-bold text-gray-900">Accesibilidad</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">

            {/* Dark mode */}
            <Toggle
              active={prefs.darkMode}
              onClick={() => update({ darkMode: !prefs.darkMode })}
              icon={prefs.darkMode
                ? <Sun  className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
              label={prefs.darkMode ? 'Modo claro' : 'Modo oscuro'}
            />

            {/* Invert colors */}
            <Toggle
              active={prefs.invertColors}
              onClick={() => update({ invertColors: !prefs.invertColors })}
              icon={<FlipVertical2 className="w-4 h-4" />}
              label="Invertir colores"
            />

            {/* Grayscale */}
            <Toggle
              active={prefs.grayscale}
              onClick={() => update({ grayscale: !prefs.grayscale })}
              icon={<Palette className="w-4 h-4" />}
              label="Escala de grises"
            />

            {/* High contrast */}
            <Toggle
              active={prefs.highContrast}
              onClick={() => update({ highContrast: !prefs.highContrast })}
              icon={<Contrast className="w-4 h-4" />}
              label="Alto contraste"
            />

            {/* Highlight links */}
            <Toggle
              active={prefs.highlightLinks}
              onClick={() => update({ highlightLinks: !prefs.highlightLinks })}
              icon={<Link className="w-4 h-4" />}
              label="Resaltar enlaces"
            />

            {/* Font size */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
              <Type className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-700 flex-1">Tamaño de texto</span>
              <button
                onClick={() => update({ fontSize: Math.max(0, prefs.fontSize - 1) })}
                disabled={prefs.fontSize === 0}
                aria-label="Reducir texto"
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-gray-500 w-6 text-center tabular-nums">
                {(['A', 'A+', 'A++'] as const)[prefs.fontSize]}
              </span>
              <button
                onClick={() => update({ fontSize: Math.min(2, prefs.fontSize + 1) })}
                disabled={prefs.fontSize === 2}
                aria-label="Aumentar texto"
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset */}
            {hasAny && (
              <button
                onClick={reset}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer todo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global CSS overrides */}
      <style>{`
        html[data-dark-mode="1"] img,
        html[data-dark-mode="1"] video {
          filter: invert(1) hue-rotate(180deg);
        }
        html[data-highlight-links="1"] a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 3px !important;
          outline: 2px solid currentColor;
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </>
  )
}
