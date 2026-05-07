import { Report } from '@/types'

interface Props {
  report: Report
  businessName: string
}

export default function NotaGeneral({ report, businessName }: Props) {
  if (!report.general_note) return null

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
        Diagnóstico
      </p>
      <p className="text-gray-700 leading-relaxed text-base">{report.general_note}</p>
    </div>
  )
}
