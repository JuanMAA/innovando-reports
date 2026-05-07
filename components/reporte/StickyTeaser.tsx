import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const INCLUIDO = [
  'Análisis completo de los 6 módulos',
  'Recomendaciones que puedes aplicar tú mismo',
  'Priorización por impacto',
  'Diagnóstico de redes y plataformas',
]

export default function StickyTeaser({ slug, pricing }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] bg-white border-t border-gray-100">
      {/* Items row */}
      <div className="border-b border-gray-100 px-6 py-2">
        <div className="mx-auto max-w-6xl flex flex-wrap gap-x-6 gap-y-1">
          {INCLUIDO.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Descubre qué te está costando clientes — y cómo solucionarlo</p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Acceso único · sin suscripción · aplícalo tú mismo</p>
          </div>
          <a
            href={`/pago/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-base font-bold text-white hover:bg-gray-800 active:scale-95 transition-all shrink-0 shadow-md"
          >
            <span className="hidden sm:inline">Ver reporte —</span>
            <span>{pricing ? pricing.price_display : 'Ver precio'}</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
