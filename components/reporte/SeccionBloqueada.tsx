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
  { score: 'bg-green-200',  bar: 'bg-green-300'  },
  { score: 'bg-amber-200',  bar: 'bg-amber-300'  },
  { score: 'bg-red-200',    bar: 'bg-red-300'    },
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
            <div className="h-9 w-9 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-2.5 rounded-full bg-gray-200" style={{ width: row.labelW }} />
              <div className="h-2 rounded-full bg-gray-100"   style={{ width: row.subW   }} />
            </div>
            <div className={`h-6 w-10 rounded-full ${row.score}`} />
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 mt-3">
            <div className={`h-2.5 rounded-full ${row.bar}`} style={{ width: `${row.barW}%` }} />
          </div>
        </div>
      ))}

      {/* Chips */}
      <div className="flex gap-2 pt-1 flex-wrap">
        {chipWidths.map((w, i) => (
          <div key={i} className={`h-6 rounded-full ${i % 2 === 0 ? 'bg-gray-200' : i === 1 ? 'bg-green-200' : 'bg-amber-200'}`} style={{ width: w }} />
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
