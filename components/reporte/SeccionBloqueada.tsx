import { Lock, ChevronRight } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  children:    React.ReactNode
  slug:        string
  pricing?:    CountryPricing | null
  titulo?:     string
  descripcion?: string
}

export default function SeccionBloqueada({
  children,
  slug,
  pricing,
  titulo      = 'Sección del informe completo',
  descripcion = 'Disponible al adquirir el informe completo.',
}: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden">

      {/* Contenido bloqueado con blur */}
      <div
        className="blur-md pointer-events-none select-none"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-[2px]">
        <div className="flex flex-col items-center text-center px-6 py-8 max-w-xs">

          {/* Icono */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
            <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Texto */}
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{titulo}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{descripcion}</p>

          {/* CTA */}
          <a
            href={`/pago/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
          >
            {pricing
              ? `Desbloquear — ${pricing.price_display}`
              : 'Comprar informe completo'}
            <ChevronRight className="w-4 h-4" />
          </a>

          {/* Sub-texto */}
          <p className="text-[11px] text-gray-400 mt-3">Sin suscripción · pago único</p>
        </div>
      </div>

    </div>
  )
}
