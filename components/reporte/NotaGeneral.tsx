import { ClipboardList } from 'lucide-react'
import { Report } from '@/types'

interface Props {
  report: Report
  businessName: string
}

export default function NotaGeneral({ report, businessName }: Props) {
  if (!report.general_note) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header oscuro */}
      <div className="bg-gray-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 shrink-0">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Diagnóstico general
            </p>
            <p className="text-lg font-bold text-white leading-tight">{businessName}</p>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="px-6 py-5">
        <p className="text-gray-700 leading-relaxed text-base">{report.general_note}</p>
      </div>
    </div>
  )
}
