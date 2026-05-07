import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business } from '@/types'
import { ChevronRight, RefreshCw, Lock } from 'lucide-react'

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

  // Fake display URL
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

      {/* Browser mockup */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col">
        <div className="flex-1 rounded-2xl shadow-2xl overflow-hidden border border-gray-300 flex flex-col bg-white">

          {/* Browser chrome */}
          <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 shrink-0">
            {/* Traffic lights + nav */}
            <div className="flex items-center gap-3">
              {/* Dots */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Address bar */}
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300 shadow-sm">
                <Lock className="w-3 h-3 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{displayUrl}</span>
              </div>
            </div>
          </div>

          {/* iframe */}
          <iframe
            src={iframeSrc}
            className="flex-1 w-full border-0"
            title={`Vista previa — ${business.name}`}
          />
        </div>
      </div>
    </div>
  )
}
