'use client'

import { useState } from 'react'
import { RefreshCw, Lock, Monitor, Smartphone, ChevronDown } from 'lucide-react'

interface Props {
  src: string
  title: string
  businessSlug: string
}

const DOMAIN_OPTIONS = [
  { label: 'innovando.cl', suffix: '.innovando.cl', badge: 'Gratis' },
  { label: 'innpage.net', suffix: '.innpage.net', badge: 'Gratis' },
  { label: 'dominio propio', suffix: '.cl', badge: 'Personalizado' },
]

export default function BrowserMockup({ src, title, businessSlug }: Props) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')
  const [domain, setDomain] = useState(0)
  const [domainOpen, setDomainOpen] = useState(false)

  const base = businessSlug.replace(/-/g, '')
  const displayUrl = `${base}${DOMAIN_OPTIONS[domain].suffix}`

  return (
    <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 120px)' }}>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-3 px-1">

        {/* Domain selector */}
        <div className="relative">
          <button
            onClick={() => setDomainOpen(!domainOpen)}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="text-gray-400 text-xs">Dominio:</span>
            <span className="font-semibold text-gray-900">{DOMAIN_OPTIONS[domain].label}</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              DOMAIN_OPTIONS[domain].badge === 'Gratis'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {DOMAIN_OPTIONS[domain].badge}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {domainOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[220px] overflow-hidden">
              {DOMAIN_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => { setDomain(i); setDomainOpen(false) }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${i === domain ? 'bg-gray-50' : ''}`}
                >
                  <span className="font-medium text-gray-800">{base}{opt.suffix}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    opt.badge === 'Gratis'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-xl p-1 shadow-inner">
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
            <div className="flex items-center gap-1 shrink-0">
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300 shadow-sm min-w-0">
              <Lock className="w-3 h-3 text-green-500 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{displayUrl}</span>
            </div>
          </div>
        </div>

        {/* iframe */}
        <iframe
          src={src}
          className="flex-1 w-full border-0"
          title={title}
        />
      </div>
    </div>
  )
}
