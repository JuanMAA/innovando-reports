import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const INCLUIDO = [
  'Análisis de los 6 módulos',
  'Recomendaciones accionables',
  'Diagnóstico de redes y plataformas',
  'Entrega en horas',
]

export default function StickyTeaser({ slug, pricing }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">

      {/* Items row — solo sm+ */}
      <div className="hidden sm:block border-b border-gray-100 px-6 py-2">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-x-6 gap-y-1 justify-center">
          {INCLUIDO.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="text-xs text-gray-500">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">

          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              Descubre qué te está costando clientes
            </p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              Sin suscripción · acceso único · entrega en horas
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pricing && (
              <span className="hidden md:inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900">
                {pricing.price_display}
              </span>
            )}
            <a
              href={`/pago/${slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
            >
              <span className="hidden sm:inline">Ver reporte —</span>
              <span>{pricing ? pricing.price_display : 'Ver precio'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
