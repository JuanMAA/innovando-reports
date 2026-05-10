import { Report } from '@/types'
import ScoreGauge from './ScoreGauge'

interface Props {
  report: Report
}

export default function NotaGeneral({ report }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Gauge de valoración */}
      <div className="flex justify-center px-6 py-6 border-b border-gray-100">
        <ScoreGauge score={report.score_total} />
      </div>

      {/* Nota */}
      {report.general_note && (
        <div className="px-6 py-5">
          <p className="text-gray-700 leading-relaxed text-base">{report.general_note}</p>
        </div>
      )}
    </div>
  )
}
