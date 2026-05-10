import { Lock, ChevronRight } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug:        string
  pricing?:    CountryPricing | null
  titulo:      string
  descripcion?: string
  incluye?:    string[]
}

// Filas de skeleton que simulan contenido real (sin datos reales)
function FakeContent() {
  return (
    <div className="px-5 py-4 flex flex-col gap-2.5 pointer-events-none select-none" aria-hidden>
      {/* Fila 1 */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="h-2.5 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="ml-auto h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
      </div>
      {/* Barra de progreso */}
      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-2.5 w-3/5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      {/* Fila 2 */}
      <div className="flex items-center gap-3 mt-0.5">
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="ml-auto h-5 w-10 rounded-full bg-gray-100 dark:bg-gray-800" />
      </div>
      {/* Barra de progreso */}
      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-2.5 w-2/5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default function SeccionBloqueada({ slug, pricing, titulo }: Props) {
  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden h-36">

      {/* Contenido falso borroso */}
      <div className="absolute inset-0 blur-sm">
        <FakeContent />
      </div>

      {/* Velo semitransparente */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70" />

      {/* CTA centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{titulo}</p>
        </div>
        <a
          href={`/pago/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
        >
          {pricing ? `Desbloquear — ${pricing.price_display}` : 'Comprar informe'}
          <ChevronRight className="w-4 h-4" />
        </a>
        <p className="text-xs text-gray-400">Sin suscripción · pago único · acceso inmediato</p>
      </div>
    </div>
  )
}
