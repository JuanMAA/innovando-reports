'use client'

import { useState, useRef } from 'react'
import { RefreshCw, Lock, Monitor, Smartphone, ChevronDown, Loader2 } from 'lucide-react'

interface Props {
  src: string
  title: string
  businessSlug: string
}

const DOMAIN_SUFFIXES = [
  { label: 'innovando.cl', suffix: '.innovando.cl', badge: 'Gratis' },
  { label: 'innpage.net',  suffix: '.innpage.net',  badge: 'Gratis' },
  { label: '.cl',          suffix: '.cl',           badge: 'Personalizado' },
]

const STYLE_OPTIONS = [
  { value: 'classic',     label: 'Clásico',     emoji: '🏠', desc: 'Limpio y profesional, ideal para cualquier rubro' },
  { value: 'airbnb',      label: 'Airbnb',      emoji: '🌿', desc: 'Fotos protagonistas con sidebar de reserva' },
  { value: 'masonry',     label: 'Masonry',      emoji: '🖼️', desc: 'Oscuro y artístico, fotos en columnas tipo Pinterest' },
  { value: 'tripadvisor', label: 'TripAdvisor',  emoji: '🌍', desc: 'Rating prominente, perfecto para turismo y gastronomía' },
  { value: 'linktree',    label: 'Linktree',     emoji: '🔗', desc: 'Minimalista y directo, solo los datos clave' },
] as const

type StyleValue = typeof STYLE_OPTIONS[number]['value']

export default function BrowserMockup({ src, title, businessSlug }: Props) {
  const defaultBase = businessSlug.replace(/-/g, '')

  const [view, setView]             = useState<'desktop' | 'mobile'>('desktop')
  const [suffixIdx, setSuffixIdx]   = useState(0)
  const [suffixOpen, setSuffixOpen] = useState(false)
  const [styleOpen,  setStyleOpen]  = useState(false)
  const [domainBase, setDomainBase] = useState(defaultBase)
  const [style, setStyle]           = useState<StyleValue>('classic')
  const [iframeKey, setIframeKey]   = useState(0)   // increment → force iframe remount
  const [loading, setLoading]       = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = `${domainBase || defaultBase}${DOMAIN_SUFFIXES[suffixIdx].suffix}`
  const iframeSrc  = `${src}${src.includes('?') ? '&' : '?'}style=${style}`

  const changeStyle = (newStyle: StyleValue) => {
    if (newStyle === style) return
    setStyle(newStyle)
    setLoading(true)
    setIframeKey(k => k + 1)
  }

  const handleRefresh = () => {
    setLoading(true)
    setIframeKey(k => k + 1)
  }

  const handleDomainInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow lowercase letters, numbers and hyphens only
    setDomainBase(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  return (
    <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 120px)' }}>

      {/* Controls: domain + style (stacked on mobile, row on desktop) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 px-1">

        {/* Domain editor */}
        <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-sm w-full sm:w-auto">
          <span className="pl-3 text-xs text-gray-400 font-semibold shrink-0 select-none">dominio:</span>
          <input
            ref={inputRef}
            value={domainBase}
            onChange={handleDomainInput}
            placeholder={defaultBase}
            className="flex-1 sm:w-32 min-w-0 px-2 py-2.5 text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 cursor-text"
            spellCheck={false}
            autoComplete="off"
          />
          {/* Suffix selector */}
          <div className="relative border-l border-gray-200 shrink-0">
            <button
              onClick={() => setSuffixOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-r-xl transition-colors"
            >
              <span className="font-medium">{DOMAIN_SUFFIXES[suffixIdx].label}</span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                DOMAIN_SUFFIXES[suffixIdx].badge === 'Gratis'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {DOMAIN_SUFFIXES[suffixIdx].badge}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {suffixOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSuffixOpen(false)} />
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[220px]">
                  {DOMAIN_SUFFIXES.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setSuffixIdx(i); setSuffixOpen(false) }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${i === suffixIdx ? 'bg-gray-50' : ''}`}
                    >
                      <span className="font-medium text-gray-800">{domainBase || defaultBase}{opt.suffix}</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        opt.badge === 'Gratis' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{opt.badge}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Style selector — custom dropdown with fixed "estilo:" label */}
        <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-sm w-full sm:flex-1 sm:max-w-sm">
          <span className="pl-3 text-xs text-gray-400 font-semibold shrink-0 select-none">estilo:</span>
          <button
            onClick={() => setStyleOpen(o => !o)}
            className="flex-1 flex items-center justify-between gap-2 px-2 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-r-xl transition-colors min-w-0"
          >
            <span className="truncate">
              {STYLE_OPTIONS.find(o => o.value === style)?.emoji}{' '}
              {STYLE_OPTIONS.find(o => o.value === style)?.label}
            </span>
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0" />
              : <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
          </button>
          {styleOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStyleOpen(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full min-w-[260px]">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { changeStyle(opt.value); setStyleOpen(false) }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl text-left ${opt.value === style ? 'bg-gray-50' : ''}`}
                  >
                    <span className="text-base shrink-0">{opt.emoji}</span>
                    <span>
                      <span className="font-semibold text-gray-900 block">{opt.label}</span>
                      <span className="text-xs text-gray-400">{opt.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View toggle — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-200 rounded-xl p-1 shadow-inner shrink-0">
          <button
            onClick={() => setView('desktop')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Escritorio
          </button>
          <button
            onClick={() => setView('mobile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Móvil
          </button>
        </div>
      </div>

      {/* Browser window */}
      <div className={`flex flex-col flex-1 rounded-2xl shadow-2xl overflow-hidden border border-gray-300 bg-white transition-all duration-300 mx-auto ${
        view === 'mobile' ? 'w-[390px]' : 'w-full'
      }`}>

        {/* Browser chrome */}
        <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <button
              onClick={handleRefresh}
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300 shadow-sm min-w-0">
              <Lock className="w-3 h-3 text-green-500 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{displayUrl}</span>
            </div>
          </div>
        </div>

        {/* iframe wrapper with fade loading overlay */}
        <div className="relative flex-1">
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white pointer-events-none transition-opacity duration-500"
            style={{ opacity: loading ? 1 : 0 }}
          >
            <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              Cargando {STYLE_OPTIONS.find(o => o.value === style)?.label}…
            </p>
          </div>
          <iframe
            key={iframeKey}
            src={iframeSrc}
            className="absolute inset-0 w-full h-full border-0"
            title={title}
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
