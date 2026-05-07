import { Globe, Languages, Accessibility, RefreshCw, ChevronRight, ExternalLink } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  pricingNuevo?: CountryPricing | null
  tieneWebPropia: boolean
  slug: string
}

const FEATURES = [
  {
    icon: Languages,
    titulo: 'Multiidioma',
    detalle: 'Tu sitio en español e inglés desde el primer día, para recibir turistas extranjeros sin barreras.',
  },
  {
    icon: Accessibility,
    titulo: 'Accesible (WCAG)',
    detalle: 'Cumple estándares internacionales de accesibilidad: navegable para todos los usuarios, incluyendo personas con discapacidad visual o motriz.',
  },
  {
    icon: RefreshCw,
    titulo: 'Contenido siempre actualizado',
    detalle: 'Recopilamos reseñas, fotos y datos de Google Maps, redes sociales y plataformas para que el sitio se mantenga vivo automáticamente.',
  },
]

export default function ModuloSitioWeb({ pricingNuevo, tieneWebPropia, slug }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Sitio web Innovando
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              {tieneWebPropia
                ? 'Un sitio que trabaja para ti'
                : 'Tu negocio merece presencia propia'}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="divide-y divide-gray-100">
        {FEATURES.map(({ icon: Icon, titulo, detalle }) => (
          <div key={titulo} className="flex items-start gap-4 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0 mt-0.5">
              <Icon className="w-4.5 h-4.5 text-gray-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{titulo}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
        <a
          href="https://innovando.cl/contacto"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          {tieneWebPropia
            ? pricingNuevo ? `Reemplazar mi sitio — ${pricingNuevo.price_display}` : 'Reemplazar mi sitio'
            : pricingNuevo ? `Crear mi sitio web — ${pricingNuevo.price_display}` : 'Crear mi sitio web'}
          <ChevronRight className="w-4 h-4" />
        </a>
        <a
          href={`/${slug}/demo`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-2"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
          Ver cómo quedaría mi sitio web
        </a>
        <p className="text-xs text-center text-gray-400 mt-2">
          Sin suscripción · pago único · entrega en 7 días
        </p>
      </div>
    </div>
  )
}
