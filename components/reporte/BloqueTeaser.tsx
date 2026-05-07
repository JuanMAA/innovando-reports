import { CountryPricing } from '@/types'
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react'

interface Props {
  slug: string
  pricing?: CountryPricing | null
}

const INCLUIDO = [
  {
    titulo: 'Análisis completo de los 6 módulos',
    detalle: 'Google Maps, sitio web, reputación, redes, SEO y plataformas con nota y diagnóstico en cada área.',
  },
  {
    titulo: 'Recomendaciones que puedes aplicar tú mismo',
    detalle: 'Cada módulo incluye acciones concretas, paso a paso, sin necesidad de contratar a nadie.',
  },
  {
    titulo: 'Priorización por impacto',
    detalle: 'Ordenadas de mayor a menor impacto para que sepas por dónde empezar.',
  },
  {
    titulo: 'Diagnóstico de redes y plataformas',
    detalle: 'Qué plataformas te faltan y cómo mejorar las que ya tienes.',
  },
]

export default function BloqueTeaser({ slug, pricing }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 shrink-0">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">Reporte completo</p>
          <p className="text-base text-gray-500 mt-0.5">
            Todo lo que necesitas para mejorar tu presencia digital sin depender de nadie.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-4 mb-6">
        {INCLUIDO.map(({ titulo, detalle }) => (
          <li key={titulo} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-semibold text-gray-800">{titulo}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{detalle}</p>
            </div>
          </li>
        ))}
      </ul>

      {pricing && (
        <p className="text-sm text-gray-500 mb-4">
          Acceso único por{' '}
          <span className="font-bold text-gray-900 text-lg">{pricing.price_display}</span>
        </p>
      )}

      <a
        href={`/pago/${slug}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
      >
        Ver reporte completo
        <ChevronRight className="w-5 h-5" />
      </a>
    </div>
  )
}
