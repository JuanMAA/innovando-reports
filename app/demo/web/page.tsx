import { ChevronRight } from 'lucide-react'
import BrowserMockup from '@/components/reporte/BrowserMockup'

export const metadata = {
  title:       'Simulación de Sitio Web — Demo · Innovando',
  description: 'Ejemplo de cómo se vería un sitio web generado con Innovando.',
}

// Mismos datos que /demo/presencia-digital — comparten el negocio ficticio.
const DEMO_BUSINESS = {
  id:   'demo-business-id',
  slug: 'demo',
  name: 'Hostal El Mirador',
  city: 'Santiago, Chile',
}

export default function DemoWebPage() {
  const webUrl    = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3002'
  const bypass    = process.env.WEB_BYPASS_SECRET
  // Para demo: usamos un id estable. En prod conviene tener un business "demo" en innovando-web.
  const iframeSrc = `${webUrl}/?id=${DEMO_BUSINESS.id}${bypass ? `&x-vercel-protection-bypass=${bypass}` : ''}`

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Banner */}
      <div className="bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
              Demo · datos ficticios
            </span>
            <p className="text-sm text-gray-300 hidden sm:block">
              Así se vería el sitio web de{' '}
              <span className="font-semibold text-white">{DEMO_BUSINESS.name}</span> con Innovando
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/demo/presencia-digital"
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              ← Volver al reporte
            </a>
            <a
              href="https://innovando.cl/es/turismo/desarrollo-web"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-gray-800 px-4 py-2 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Quiero este sitio
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Mockup */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col items-center w-full">
        <BrowserMockup
          src={iframeSrc}
          title={`Vista previa — ${DEMO_BUSINESS.name}`}
          businessSlug={DEMO_BUSINESS.slug}
        />
      </div>
    </div>
  )
}
