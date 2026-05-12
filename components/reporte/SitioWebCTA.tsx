import { Business, CountryPricing } from '@/types'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  business: Business
  pricingOptimizar?: CountryPricing | null
  pricingNuevo?: CountryPricing | null
}

function Check({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
      <span className="text-sm text-gray-700">{text}</span>
    </li>
  )
}

function Cross({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
      <span className="text-sm text-gray-700">{text}</span>
    </li>
  )
}

export default function SitioWebCTA({ business, pricingOptimizar, pricingNuevo }: Props) {
  const perf = business.lh_performance
  const action = business.lh_action

  // Case: No website
  if (!business.website) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
          Sin sitio web propio
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-4">
          No tienes presencia propia en internet
        </p>
        <ul className="flex flex-col gap-2 mb-5">
          <Cross text="No apareces en búsquedas de Google" />
          <Cross text="No apareces en ChatGPT" />
          <Cross text="Los viajeros no pueden encontrarte online" />
          <Cross text="Dependes 100% de las plataformas" />
        </ul>
        <a
          href={`https://innovando.cl/contacto`}
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors w-full"
        >
          {pricingNuevo
            ? `Crear mi sitio web — ${pricingNuevo.price_display}`
            : 'Crear mi sitio web'}
        </a>
      </div>
    )
  }

  // Case: reemplazar (performance < 30)
  if (action === 'reemplazar' || (perf !== null && perf !== undefined && perf < 30)) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
          Tu sitio tiene problemas críticos
        </p>
        {perf !== null && perf !== undefined && (
          <p className="text-sm text-red-600 font-medium mb-4">
            Performance: {perf}/100
          </p>
        )}
        <p className="text-sm text-gray-700 mb-3">Un sitio Innovando incluye:</p>
        <ul className="flex flex-col gap-2 mb-5">
          <Check text="Carga en menos de 2 segundos" />
          <Check text="Optimizado para Google y ChatGPT" />
          <Check text="Reseñas y fotos actualizadas cada semana" />
          <Check text="Formulario de reservas directas" />
        </ul>
        <div className="flex flex-col gap-2">
          <a
            href={`https://innovando.cl/contacto`}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors w-full"
          >
            {pricingNuevo
              ? `Reemplazar mi sitio — ${pricingNuevo.price_display}`
              : 'Reemplazar mi sitio'}
          </a>
          <a
            href={`https://innovando.cl/contacto`}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full"
          >
            {pricingOptimizar
              ? `Solo optimizar — ${pricingOptimizar.price_display}`
              : 'Solo optimizar'}
          </a>
        </div>
      </div>
    )
  }

  // Case: optimizar (performance 30-69)
  if (action === 'optimizar' || (perf !== null && perf !== undefined && perf < 70)) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
          ¿Quieres mejorar tu sitio?
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Tu sitio tiene problemas de velocidad y SEO
        </p>
        <p className="text-sm text-gray-700 mb-3">Con Innovando podemos:</p>
        <ul className="flex flex-col gap-2 mb-5">
          <Check text="Mejorar velocidad a menos de 3s" />
          <Check text="Optimizar SEO para aparecer en Google" />
          <Check text="Hacer el sitio 100% mobile-friendly" />
          <Check text="Activar HTTPS si no está activo" />
        </ul>
        <p className="text-xs text-gray-500 mb-4">
          No reemplazamos tu sitio — lo mejoramos.
        </p>
        <div className="flex flex-row sm:flex-col gap-2">
          <a
            href={`https://innovando.cl/contacto`}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors w-full"
          >
            {pricingOptimizar
              ? `Optimizar mi sitio — ${pricingOptimizar.price_display}`
              : 'Optimizar mi sitio'}
          </a>
          <a
            href={`https://innovando.cl/contacto`}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full"
          >
            {pricingNuevo
              ? `Crear sitio nuevo — ${pricingNuevo.price_display}`
              : 'Crear sitio nuevo'}
          </a>
        </div>
      </div>
    )
  }

  // Case: OK (>= 70 or no lh data)
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-green-500 mb-1">
        Tu sitio web está bien
      </p>
      {perf !== null && perf !== undefined && (
        <p className="text-sm text-green-600 font-medium mb-2">
          Performance: {perf}/100
        </p>
      )}
      <p className="text-sm text-gray-700">
        El diagnóstico completo muestra cómo mejorar otras áreas de tu presencia digital.
      </p>
    </div>
  )
}
