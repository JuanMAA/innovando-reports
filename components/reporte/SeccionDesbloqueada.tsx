import { CheckCircle2, MessageCircle } from 'lucide-react'

interface Props {
  titulo:      string
  descripcion: string
}

/**
 * Placeholder mostrado en lugar de SeccionBloqueada cuando el reporte
 * está desbloqueado (is_unlocked = true) y todavía no construimos los
 * componentes "unlocked" para esa sección.
 *
 * Reemplazar esto cuando exista el componente real de cada sección.
 */
export default function SeccionDesbloqueada({ titulo, descripcion }: Props) {
  return (
    <div className="relative rounded-2xl border border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 dark:from-emerald-900/20 dark:via-gray-900 dark:to-emerald-900/10 overflow-hidden p-6 flex flex-col items-start gap-4">

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-base font-bold text-gray-900 dark:text-white">{titulo}</p>
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
          Desbloqueado
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">{descripcion}</p>

      <a
        href="https://wa.me/56987654321"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Recibir esta sección por WhatsApp
      </a>
    </div>
  )
}
