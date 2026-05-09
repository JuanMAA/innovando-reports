'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export default function BotonDescargarPDF({ nombre }: { nombre: string }) {
  const [loading, setLoading] = useState(false)

  function handlePrint() {
    setLoading(true)
    // Pequeño delay para que el estado de loading no aparezca en el PDF
    setTimeout(() => {
      window.print()
      setLoading(false)
    }, 120)
  }

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      className="print:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4 text-gray-400" />
      {loading ? 'Preparando…' : 'Descargar PDF'}
    </button>
  )
}
