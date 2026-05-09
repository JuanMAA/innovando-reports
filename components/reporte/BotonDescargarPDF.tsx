'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export default function BotonDescargarPDF({ nombre }: { nombre: string }) {
  const [loading, setLoading] = useState(false)

  function handlePrint() {
    setLoading(true)
    setTimeout(() => {
      window.print()
      setLoading(false)
    }, 120)
  }

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      title={loading ? 'Preparando PDF…' : `Descargar PDF — ${nombre}`}
      className="print:hidden fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 rounded-2xl bg-gray-900 border border-gray-700 px-3 py-3.5 shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-50 group"
    >
      <Download className="w-4 h-4 text-white" />
      <span
        className="text-white font-semibold tracking-widest"
        style={{ fontSize: '10px', writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.12em' }}
      >
        {loading ? 'PREPARANDO…' : 'DESCARGAR PDF'}
      </span>
    </button>
  )
}
