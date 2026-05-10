import { Lock, ChevronRight } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug:        string
  pricing?:    CountryPricing | null
  titulo:      string
  descripcion?: string
  incluye?:    string[]
}

function FakeContent() {
  return (
    <div className="px-5 py-5 flex flex-col gap-3 pointer-events-none select-none" aria-hidden>
      {/* Fila 1 — icono + nombre + score verde */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 w-36 rounded-full bg-gray-200" />
          <div className="h-2 w-20 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-10 rounded-full bg-green-200" />
      </div>
      {/* Barra larga verde */}
      <div className="h-2.5 w-full rounded-full bg-gray-100">
        <div className="h-2.5 w-[72%] rounded-full bg-green-300" />
      </div>

      {/* Fila 2 — icono + nombre + score amber */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-9 w-9 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 w-28 rounded-full bg-gray-200" />
          <div className="h-2 w-16 rounded-full bg-gray-100" />
        </div>
        <div className="h-6 w-10 rounded-full bg-amber-200" />
      </div>
      {/* Barra amber */}
      <div className="h-2.5 w-full rounded-full bg-gray-100">
        <div className="h-2.5 w-[43%] rounded-full bg-amber-300" />
      </div>

      {/* Fila 3 — chips */}
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-24 rounded-full bg-gray-200" />
        <div className="h-6 w-16 rounded-full bg-green-200" />
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}

export default function SeccionBloqueada({ slug, pricing, titulo, descripcion }: Props) {
  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden h-56">

      {/* Contenido falso borroso */}
      <div className="absolute inset-0 blur-sm">
        <FakeContent />
      </div>

      {/* Degradado: más opaco arriba y abajo, translúcido en el centro */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.75) 100%)'
        }}
      />

      {/* CTA centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{titulo}</p>
        </div>
        {descripcion && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">{descripcion}</p>
        )}
        <a
          href={`/pago/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-sm mt-0.5"
        >
          {pricing ? `Desbloquear — ${pricing.price_display}` : 'Comprar informe'}
          <ChevronRight className="w-4 h-4" />
        </a>
        <p className="text-xs text-gray-400 dark:text-gray-500">Sin suscripción · pago único · acceso inmediato</p>
      </div>
    </div>
  )
}
