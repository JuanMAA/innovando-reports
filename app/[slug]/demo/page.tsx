import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business } from '@/types'
import { ChevronRight } from 'lucide-react'
import BrowserMockup from '@/components/reporte/BrowserMockup'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug')
    .eq('slug', slug)
    .maybeSingle<Business>()

  if (!business) notFound()

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3002'
  const iframeSrc = `${webUrl}/?id=${business.id}`
  const displayUrl = `${business.slug.replace(/-/g, '')}.innovando.cl`

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Innovando banner */}
      <div className="bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
              Vista previa
            </span>
            <p className="text-sm text-gray-300 hidden sm:block">
              Así se vería el sitio web de{' '}
              <span className="font-semibold text-white">{business.name}</span> con Innovando
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`/${slug}`}
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              ← Volver al reporte
            </a>
            <a
              href="https://innovando.cl/contacto"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Quiero este sitio
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Browser mockup with toggle */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col items-center">
        <BrowserMockup
          src={iframeSrc}
          title={`Vista previa — ${business.name}`}
          displayUrl={displayUrl}
        />
      </div>
    </div>
  )
}
