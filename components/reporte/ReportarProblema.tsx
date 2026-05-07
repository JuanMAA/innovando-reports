'use client'

import { useState } from 'react'
import { Flag, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  businessId: string
}

const ISSUE_TYPES = [
  { value: 'wrong_profile', label: 'El negocio no es el correcto' },
  { value: 'incorrect_link', label: 'Hay un enlace incorrecto' },
  { value: 'outdated_info', label: 'La información está desactualizada' },
]

export default function ReportarProblema({ businessId }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('outdated_info')
  const [detalle, setDetalle] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/reportes/problema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, type, detalle }),
      })
      setSent(true)
    } catch {
      // silently fail — best effort
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">¿Algo no está bien?</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
              Si encuentras un error en este reporte, puedes avisarnos para que lo revisemos.
            </p>
          </div>
        </div>

        {!open && !sent && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors shrink-0 shadow-sm"
          >
            <Flag className="w-3.5 h-3.5" />
            Reportar
          </button>
        )}

        {sent && (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            ¡Recibido!
          </div>
        )}
      </div>

      {/* Form panel */}
      {open && !sent && (
        <div className="border-t border-amber-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">Reportar un problema</p>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Describe el problema (opcional)"
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
