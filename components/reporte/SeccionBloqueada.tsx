import { Lock, ChevronRight } from 'lucide-react'
import { CountryPricing } from '@/types'

interface Props {
  slug:        string
  pricing?:    CountryPricing | null
  titulo:      string
  descripcion?: string
  incluye?:    string[]
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const ROW_COLORS = [
  { score: 'bg-green-200 dark:bg-green-900/50',  bar: 'bg-green-300 dark:bg-green-800/50'  },
  { score: 'bg-amber-200 dark:bg-amber-900/50',  bar: 'bg-amber-300 dark:bg-amber-800/50'  },
  { score: 'bg-red-200 dark:bg-red-900/50',    bar: 'bg-red-300 dark:bg-red-800/50'    },
]

function FakeContent() {
  const rows = ROW_COLORS.map((c, i) => ({
    ...c,
    barW:    rand(i === 0 ? 55 : i === 1 ? 30 : 15, i === 0 ? 90 : i === 1 ? 65 : 45),
    labelW:  rand(20, 36) * 4, // multiples of 4 → Tailwind-like widths in px
    subW:    rand(14, 24) * 4,
  }))

  const chipWidths = [rand(18, 28), rand(12, 18), rand(16, 24), rand(10, 16)].map(w => w * 4)

  return (
    <div className="px-5 py-5 flex flex-col gap-3 pointer-events-none select-none" aria-hidden>
      {rows.map((row, i) => (
        <div key={i}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" style={{ width: row.labelW }} />
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800"   style={{ width: row.subW   }} />
            </div>
            <div className={`h-6 w-10 rounded-full ${row.score}`} />
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-3">
            <div className={`h-2.5 rounded-full ${row.bar}`} style={{ width: `${row.barW}%` }} />
          </div>
        </div>
      ))}

      {/* Chips */}
      <div className="flex gap-2 pt-1 flex-wrap">
        {chipWidths.map((w, i) => (
          <div key={i} className={`h-6 rounded-full ${i % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : i === 1 ? 'bg-green-200 dark:bg-green-900/50' : 'bg-amber-200 dark:bg-amber-900/50'}`} style={{ width: w }} />
        ))}
      </div>
    </div>
  )
}

export default function SeccionBloqueada({ slug, pricing, titulo, descripcion }: Props) {
  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden h-72">

      {/* Contenido falso borroso */}
      <div className="absolute inset-0 blur-sm">
        <FakeContent />
      </div>

      {/* Degradado: más opaco arriba y abajo, translúcido en el centro */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/45 to-white/75 dark:from-gray-900/55 dark:via-gray-900/45 dark:to-gray-900/75" />

      {/* CTA centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">{titulo}</p>
        </div>
        {descripcion && (
          <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed max-w-sm">{descripcion}</p>
        )}
        <a
          href={`/pago/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-white dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 active:scale-95 transition-all shadow-sm mt-0.5 dark:border dark:border-gray-700"
        >
          {pricing ? `Desbloquear — ${pricing.price_display}` : 'Comprar informe'}
          <ChevronRight className="w-4 h-4" />
        </a>
        <p className="text-sm text-gray-400 dark:text-gray-400">Sin suscripción · pago único · acceso inmediato</p>
      </div>
    </div>
  )
}
