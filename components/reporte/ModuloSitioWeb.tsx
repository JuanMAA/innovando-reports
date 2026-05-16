import { Globe, Languages, Accessibility, RefreshCw, ChevronRight, ExternalLink, AlertTriangle, XCircle, Zap } from 'lucide-react'
import { Business, CountryPricing } from '@/types'

interface Props {
  business: Business
  pricingNuevo?: CountryPricing | null
  pricingOptimizar?: CountryPricing | null
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

function ScorePill({ label, score }: { label: string; score: number }) {
  const color =
    score >= 70 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:border-green-400/30 dark:text-green-300' :
    score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:border-amber-400/30 dark:text-amber-300' :
                  'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:border-red-400/30 dark:text-red-300'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {label} <span className="font-black">{score}/100</span>
    </span>
  )
}

function DiagnosticoSection({ business, tieneWebPropia }: { business: Business; tieneWebPropia: boolean }) {
  const perf   = business.lh_performance
  const seo    = business.lh_seo
  const action = business.lh_action

  if (!tieneWebPropia) {
    return (
      <div className="mx-6 my-4 rounded-xl bg-red-50 border border-red-100 p-4">
        <div className="flex items-start gap-2.5">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800 mb-1">Te lo ofrecemos porque no tienes presencia propia</p>
            <ul className="space-y-1">
              {['No apareces en búsquedas de Google', 'Los clientes no pueden encontrarte sin plataformas', 'Pagas comisiones en cada reserva'].map(t => (
                <li key={t} className="text-xs text-red-700 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (action === 'reemplazar' || (perf !== null && perf !== undefined && perf < 30)) {
    return (
      <div className="mx-6 my-4 rounded-xl bg-red-50 border border-red-100 p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-sm font-bold text-red-800 mb-2">Te lo ofrecemos porque tu sitio tiene problemas críticos</p>
            <div className="flex flex-wrap gap-2">
              {perf != null && <ScorePill label="Velocidad" score={perf} />}
              {seo  != null && <ScorePill label="SEO"       score={seo}  />}
            </div>
            {perf != null && perf < 30 && (
              <p className="text-xs text-red-600 mt-2 leading-relaxed">
                Con velocidad {perf}/100 se pierde hasta el 70% de visitantes antes de que cargue.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (action === 'optimizar' || (perf !== null && perf !== undefined && perf < 70)) {
    return (
      <div className="mx-6 my-4 rounded-xl bg-amber-50 border border-amber-100 p-4 dark:bg-amber-950/40 dark:border-amber-900">
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">Te lo ofrecemos porque tu sitio tiene problemas de velocidad y SEO</p>
            <div className="flex flex-wrap gap-2">
              {perf != null && <ScorePill label="Velocidad" score={perf} />}
              {seo != null && <ScorePill label="SEO" score={seo} />}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 leading-relaxed">
              Google penaliza sitios lentos: apareces más abajo en búsquedas y pierdes clientes frente a competidores.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function ModuloSitioWeb({ business, pricingNuevo, pricingOptimizar, tieneWebPropia, slug }: Props) {
  const action = business.lh_action

  // Decide CTAs según situación
  const ctaPrimary = !tieneWebPropia || action === 'reemplazar'
    ? { label: pricingNuevo ? `${!tieneWebPropia ? 'Crear' : 'Reemplazar'} mi sitio — ${pricingNuevo.price_display}` : (!tieneWebPropia ? 'Crear mi sitio web' : 'Reemplazar mi sitio') }
    : action === 'optimizar'
    ? { label: pricingOptimizar ? `Optimizar mi sitio — ${pricingOptimizar.price_display}` : 'Optimizar mi sitio' }
    : { label: pricingNuevo ? `Crear sitio web — ${pricingNuevo.price_display}` : 'Crear sitio web Innovando' }

  const ctaSecondary =
    action === 'reemplazar' && pricingOptimizar
      ? { label: `Solo optimizar — ${pricingOptimizar.price_display}` }
      : action === 'optimizar' && pricingNuevo
      ? { label: `Crear sitio nuevo — ${pricingNuevo.price_display}` }
      : null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-base font-bold text-gray-900">
          {tieneWebPropia ? 'Un sitio que trabaja para ti' : 'Tu negocio merece presencia propia'}
        </p>
      </div>

      {/* Diagnóstico contextual */}
      <DiagnosticoSection business={business} tieneWebPropia={tieneWebPropia} />

      {/* Features */}
      <div className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
        {FEATURES.map(({ icon: Icon, titulo, detalle }) => (
          <div key={titulo} className="flex items-start gap-4 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0 mt-0.5 dark:bg-gray-800">
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{titulo}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed dark:text-gray-400">{detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-row sm:flex-col gap-2">
          <a
            href="https://innovando.cl/contacto"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            {ctaPrimary.label}
            <ChevronRight className="w-4 h-4" />
          </a>

          {ctaSecondary && (
            <a
              href="https://innovando.cl/contacto"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {ctaSecondary.label}
            </a>
          )}
        </div>

        <a
          href={`/${slug}/presencia-digital/web`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          Obtén tu sitio AHORA
        </a>
        <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-medium mt-2">
          ⏳ La vista previa estará disponible en las próximas horas
        </p>
        <p className="text-xs text-center text-gray-400 mt-1">
          Sin suscripción · pago único · entrega en horas
        </p>
      </div>
    </div>
  )
}
