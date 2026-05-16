import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, Lock, ChevronRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business, Report, CountryPricing } from '@/types'
import AnalisisSentimientos from '@/components/reporte/AnalisisSentimientos'
import ReportarProblema from '@/components/reporte/ReportarProblema'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SentimientosPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Business>()

  if (!business) notFound()

  let report: Report | null = null
  if (business.latest_report_id) {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('id', business.latest_report_id)
      .maybeSingle<Report>()
    report = data
  }

  if (!report) notFound()

  // Foto principal
  const { data: fotoData } = await supabase
    .from('business_data')
    .select('value')
    .eq('business_id', business.id)
    .eq('module', 'maps')
    .eq('key', 'photo_1')
    .maybeSingle()

  const fotoRef = fotoData?.value ?? null
  const foto = fotoRef ? `/api/photo?ref=${fotoRef}` : null

  // Pricing (para el caso bloqueado)
  const { data: pricingRows } = await supabase
    .from('country_pricing')
    .select('*')
    .eq('country', business.country)
    .eq('service', 'reporte_completo')
    .eq('active', true)
  const pricing = (pricingRows as CountryPricing[] | null)?.[0] ?? null

  const sentimientos = report.modulo_sentimientos
  const iniciales = business.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const city = [business.city, business.country === 'cl' ? 'Chile' : business.country]
    .filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">

      {/* ── Hero propio ─────────────────────────────────────── */}
      <div className="print:hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-blue-500/10 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">

          {/* Volver al reporte */}
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al reporte
          </Link>

          {/* Brand + título */}
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo-innovando.png" alt="Innovando" className="h-10 w-10 shrink-0" />
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 shrink-0" />
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                Informe de sentimientos
              </p>
            </div>
          </div>

          {/* Negocio */}
          <div className="flex items-center gap-5">
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {foto
                ? <img src={foto} alt={business.name} className="w-full h-full object-cover" />
                : <span className="text-xl sm:text-2xl font-black text-gray-400 dark:text-gray-500 select-none">{iniciales}</span>
              }
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                {business.name}
              </h1>
              {city && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{city}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xl leading-relaxed">
                Análisis automático con IA de las reseñas públicas para detectar emociones, temas recurrentes y oportunidades de mejora.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido ────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-8">
        {sentimientos ? (
          <>
            <AnalisisSentimientos data={sentimientos} />

            <div data-print="hidden">
              <ReportarProblema businessId={business.id} />
            </div>
          </>
        ) : (
          <BloqueadoCTA slug={slug} pricing={pricing} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-8">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-500 dark:text-gray-400">Aviso:</span> Este informe fue generado mediante procesamiento automático con IA sobre reseñas públicas disponibles en Google Maps, Booking, Airbnb, TripAdvisor y otras plataformas. Los datos reflejan el estado al momento del análisis.
          </p>
          <div className="flex items-center justify-between">
            <img src="/logo-innovando.png" alt="Innovando" className="h-8 w-8" />
            <a
              href="https://innovando.cl"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              innovando.cl
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Sin data: CTA de compra ───────────────────────────────── */
function BloqueadoCTA({ slug, pricing }: { slug: string; pricing: CountryPricing | null }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Lock className="w-6 h-6 text-gray-400" />
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Informe de sentimientos no disponible
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Este informe se genera al adquirir el reporte completo. Incluye: análisis emocional de reseñas, temas más mencionados, palabras clave, evolución temporal y reseñas destacadas.
        </p>
      </div>
      <a
        href={`/pago/${slug}`}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 active:scale-95 transition-all shadow-sm mt-2"
      >
        {pricing ? `Desbloquear — ${pricing.price_display}` : 'Comprar reporte completo'}
        <ChevronRight className="w-4 h-4" />
      </a>
      <p className="text-xs text-gray-400 dark:text-gray-500">Sin suscripción · pago único · acceso inmediato</p>
    </div>
  )
}
