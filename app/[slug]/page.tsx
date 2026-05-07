import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business, Report, CountryPricing } from '@/types'
import NotaGeneral from '@/components/reporte/NotaGeneral'
import ScoreGauge from '@/components/reporte/ScoreGauge'
import ModulosBars from '@/components/reporte/ModulosBars'
import AuditoriaWebCard from '@/components/reporte/AuditoriaWebCard'
import ModuloSitioWeb from '@/components/reporte/ModuloSitioWeb'
import ReportarProblema from '@/components/reporte/ReportarProblema'
import StickyTeaser from '@/components/reporte/StickyTeaser'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ReportePage({ params }: PageProps) {
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

  const { data: pricingRows } = await supabase
    .from('country_pricing')
    .select('*')
    .eq('country', business.country)
    .in('service', ['reporte_completo', 'optimizacion_web', 'sitio_nuevo'])
    .eq('active', true)

  const rows = (pricingRows as CountryPricing[] | null) ?? []
  const pricing = rows.find((r) => r.service === 'reporte_completo') ?? null
  const pricingOptimizar = rows.find((r) => r.service === 'optimizacion_web') ?? null
  const pricingNuevo = rows.find((r) => r.service === 'sitio_nuevo') ?? null

  const city = [business.city, business.country === 'cl' ? 'Chile' : business.country]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight text-gray-900">Innovando</span>
          <span className="text-sm text-gray-500 truncate max-w-[220px] hidden sm:block">
            {business.name}
          </span>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
            Reporte de presencia digital
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {business.name}
          </h1>
          {city && <p className="text-base text-gray-500 mt-2">{city}</p>}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Top grid: gauge + nota | modulos */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mb-6">
          {/* Left: score + nota */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
              <ScoreGauge score={report.score_total} />
            </div>
            <NotaGeneral report={report} businessName={business.name} />
          </div>

          {/* Right: módulos */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Detalle por área
            </p>
            <ModulosBars report={report} teaser />
          </div>
        </div>

        {/* Auditoría + Módulo sitio web */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
          <AuditoriaWebCard
            business={business}
            pricingOptimizar={pricingOptimizar}
            pricingNuevo={pricingNuevo}
          />
          <ModuloSitioWeb
            business={business}
            pricingNuevo={pricingNuevo}
            tieneWebPropia={!!business.website}
            slug={slug}
          />
        </div>

        {/* Report a problem */}
        <ReportarProblema businessId={business.id} />
      </main>

      <StickyTeaser slug={slug} pricing={pricing} />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-500">Aviso:</span> Este reporte fue generado de forma automática a partir de información pública disponible en internet — Google Maps, sitios web, redes sociales y plataformas de viaje. Los datos reflejan el estado al momento del análisis y pueden no estar actualizados. Si encuentras algún error, puedes reportarlo arriba.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Innovando</span>
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
