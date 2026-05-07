import { ChevronRight, CheckCircle2, Zap } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const INCLUIDO = [
  'Análisis completo de los 6 módulos',
  'Recomendaciones accionables',
  'Diagnóstico de redes y plataformas',
  'Entrega en horas',
]

export default function StickyTeaser({ slug, pricing }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900 shadow-[0_-8px_32px_rgba(0,0,0,0.25)]">

      {/* Items row — visible solo en sm+ */}
      <div className="hidden sm:block border-b border-white/10 px-6 py-2">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-x-6 gap-y-1 justify-center">
          {INCLUIDO.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-xs text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">

          {/* Left: copy */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-sm sm:text-base font-bold text-white leading-tight">
                Descubre qué te está costando clientes
              </p>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Reporte completo · sin suscripción · entrega en horas
            </p>
          </div>

          {/* Right: price + CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {pricing && (
              <span className="hidden md:inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-bold text-white">
                {pricing.price_display}
              </span>
            )}
            <a
              href={`/pago/${slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-gray-900 hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
            >
              Ver reporte completo
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
