import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business, Report, CountryPricing } from '@/types'
import NotaGeneral from '@/components/reporte/NotaGeneral'
import ModulosBars from '@/components/reporte/ModulosBars'
import ModulosDetalle from '@/components/reporte/ModulosDetalle'
import AuditoriaWebCard from '@/components/reporte/AuditoriaWebCard'
import ModuloSitioWeb from '@/components/reporte/ModuloSitioWeb'
import PlataformasReserva from '@/components/reporte/PlataformasReserva'
import ComparacionBenchmark from '@/components/reporte/ComparacionBenchmark'
import ReportarProblema from '@/components/reporte/ReportarProblema'
import StickyTeaser from '@/components/reporte/StickyTeaser'
import BotonDescargarPDF from '@/components/reporte/BotonDescargarPDF'
import { parseCatKeyword, buildGroup, type BizRow, type BenchmarkData } from '@/lib/benchmark'

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

  // Fetch platform data, social data, and description in parallel
  const [platformRes, socialRes, descRes] = await Promise.all([
    supabase
      .from('business_data')
      .select('key, value')
      .eq('business_id', business.id)
      .eq('module', 'platform'),
    supabase
      .from('business_data')
      .select('key, value')
      .eq('business_id', business.id)
      .eq('module', 'social'),
    supabase
      .from('business_data')
      .select('value')
      .eq('business_id', business.id)
      .eq('module', 'maps')
      .eq('key', 'description')
      .maybeSingle(),
  ])

  const platformData: Record<string, string | null> = Object.fromEntries(
    (platformRes.data ?? []).map(r => [r.key, r.value])
  )

  const socialData: Record<string, string | null> = Object.fromEntries(
    (socialRes.data ?? []).map(r => [r.key, r.value])
  )

  const description = descRes.data?.value ?? null

  // ── Benchmark data ────────────────────────────────────────
  const BENCH_SELECT = 'score_total,score_p2a,score_p2c,score_p2f,rating,num_reviews,lh_performance,category'

  const catParsed  = parseCatKeyword(business.category)
  const catKeyword = catParsed?.keyword ?? null
  const catLabel   = catParsed?.label   ?? (business.category ?? 'Negocios similares')

  // Fetch en paralelo: ciudad + categoría (sin este negocio)
  const [cityRes, catRes] = await Promise.all([
    business.city
      ? supabase.from('businesses').select(BENCH_SELECT).eq('city', business.city).neq('id', business.id)
      : Promise.resolve({ data: [] }),
    catKeyword
      ? supabase.from('businesses').select(BENCH_SELECT).ilike('category', `%${catKeyword}%`).neq('id', business.id)
      : Promise.resolve({ data: [] }),
  ])

  const cityRows = (cityRes.data ?? []) as BizRow[]
  const catRows  = (catRes.data  ?? []) as BizRow[]

  // Ciudad + Categoría (intersección)
  const cityCatRows = catRows.filter(
    r => r.category && cityRows.some(
      c => c.score_total === r.score_total // proxy join (mismo score+cat en ciudad)
    )
  )
  // Más preciso: re-fetch con ambos filtros si hay ciudad y keyword
  let cityCatRowsFinal = cityCatRows
  if (business.city && catKeyword) {
    const { data } = await supabase
      .from('businesses')
      .select(BENCH_SELECT)
      .eq('city', business.city)
      .ilike('category', `%${catKeyword}%`)
      .neq('id', business.id)
    cityCatRowsFinal = (data ?? []) as BizRow[]
  }

  const bizMetrics: BizRow = {
    score_total:    business.score_total,
    score_p2a:      business.score_p2a,
    score_p2c:      business.score_p2c,
    score_p2f:      business.score_p2f,
    rating:         business.rating,
    num_reviews:    business.num_reviews,
    lh_performance: business.lh_performance,
    category:       business.category,
  }

  const benchmarkGroups = [
    cityRows.length >= 3
      ? buildGroup(`${catLabel} en ${business.city}`, '', cityRows, bizMetrics)
      : null,
    cityCatRowsFinal.length >= 3
      ? buildGroup(`${catLabel} similares en ${business.city}`, '', cityCatRowsFinal, bizMetrics)
      : null,
    catRows.length >= 3
      ? buildGroup(`${catLabel} en toda la base`, '', catRows, bizMetrics)
      : null,
  ].filter(Boolean) as import('@/lib/benchmark').BenchmarkGroup[]

  // Añadir sublabels con conteo
  benchmarkGroups.forEach(g => {
    g.sublabel = `${g.n} negocio${g.n !== 1 ? 's' : ''} comparado${g.n !== 1 ? 's' : ''}`
  })

  const benchmarkData: BenchmarkData = {
    catKeyword,
    catLabel,
    groups: benchmarkGroups,
  }

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
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight text-white">Innovando</span>
          <span className="text-sm text-gray-400 truncate max-w-[220px] hidden sm:block">
            {business.name}
          </span>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
              Reporte de presencia digital
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {business.name}
            </h1>
            {city && <p className="text-base text-gray-500 mt-2">{city}</p>}
          </div>
          <BotonDescargarPDF nombre={business.name} />
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Top grid: gauge + nota | modulos */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mb-6">
          {/* Left: diagnóstico + valoración fusionados */}
          <NotaGeneral report={report} businessName={business.name} />

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
          <AuditoriaWebCard business={business} />
          <ModuloSitioWeb
            business={business}
            pricingNuevo={pricingNuevo}
            pricingOptimizar={pricingOptimizar}
            tieneWebPropia={!!business.website}
            slug={slug}
          />
        </div>

        {/* Plataformas de reserva */}
        <div className="mb-6">
          <PlataformasReserva
            platformData={platformData}
            description={description}
            businessName={business.name}
          />
        </div>

        {/* Comparación competitiva */}
        {benchmarkData.groups.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-6">
            <ComparacionBenchmark
              business={bizMetrics}
              benchmark={benchmarkData}
              businessName={business.name}
            />
          </div>
        )}

        {/* Detalle por módulo con recomendaciones */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Análisis detallado y recomendaciones
          </p>
          <ModulosDetalle
            report={report}
            business={business}
            socialData={socialData}
            platformData={platformData}
            slug={slug}
            pricingNuevo={pricingNuevo}
            pricingOptimizar={pricingOptimizar}
          />
        </div>

        {/* Report a problem */}
        <div data-print="hidden">
          <ReportarProblema businessId={business.id} />
        </div>
      </main>

      <div data-print="hidden">
        <StickyTeaser slug={slug} pricing={pricing} />
      </div>

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
