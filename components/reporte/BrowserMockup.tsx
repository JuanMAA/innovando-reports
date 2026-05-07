'use client'

import { useState } from 'react'
import { RefreshCw, Lock, Monitor, Smartphone } from 'lucide-react'

interface Props {
  src: string
  title: string
  displayUrl: string
}

export default function BrowserMockup({ src, title, displayUrl }: Props) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="flex-1 flex flex-col items-center">
      {/* View toggle */}
      <div className="flex items-center gap-1 bg-gray-200 rounded-xl p-1 mb-4 shadow-inner">
        <button
          onClick={() => setView('desktop')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'desktop'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Escritorio
        </button>
        <button
          onClick={() => setView('mobile')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'mobile'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Móvil
        </button>
      </div>

      {/* Browser window */}
      <div
        className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-300 bg-white transition-all duration-300 ${
          view === 'mobile' ? 'w-[390px]' : 'w-full'
        }`}
        style={{ height: 'calc(100vh - 160px)', minWidth: view === 'desktop' ? '100%' : undefined }}
      >
        {/* Browser chrome */}
        <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            {/* Nav buttons */}
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

            {/* Address bar */}
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
