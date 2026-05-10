import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Business, Report, CountryPricing } from '@/types'
import HeroHeader from '@/components/reporte/HeroHeader'
import NotaGeneral from '@/components/reporte/NotaGeneral'
import ModulosBars from '@/components/reporte/ModulosBars'
import AuditoriaWebCard from '@/components/reporte/AuditoriaWebCard'
import ModuloSitioWeb from '@/components/reporte/ModuloSitioWeb'
import ReportarProblema from '@/components/reporte/ReportarProblema'
import StickyTeaser from '@/components/reporte/StickyTeaser'
import SeccionBloqueada from '@/components/reporte/SeccionBloqueada'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      <HeroHeader
        nombre={business.name}
        ciudad={city}
        scoreTotal={business.score_total}
        modulos={[
          { code: 'Maps',  score: business.score_p2a, max: 20 },
          { code: 'Web',   score: business.score_p2b, max: 20 },
          { code: 'Rep.',  score: business.score_p2c, max: 20 },
          { code: 'Redes', score: business.score_p2d, max: 15 },
          { code: 'IA',    score: business.score_p2e, max: 5  },
          { code: 'Plat.', score: business.score_p2f, max: 20 },
        ]}
        secciones={[
          { id: 'sec-diagnostico', label: 'Diagnóstico'                                    },
          { id: 'sec-web',         label: 'Sitio web',   score: business.score_p2b, max: 20 },
          { id: 'sec-plataformas', label: 'Plataformas', score: business.score_p2f, max: 20 },
          { id: 'sec-benchmark',   label: 'Competencia'                                    },
          { id: 'sec-detalle',     label: 'Recomendaciones'                                },
        ]}
      />

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8 flex flex-col gap-8">

        {/* ── Diagnóstico ─────────────────────────────── */}
        <section id="sec-diagnostico" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Diagnóstico general</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NotaGeneral report={report} />
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ModulosBars report={report} teaser />
            </div>
          </div>
        </section>

        {/* ── Sitio web ───────────────────────────────── */}
        <section id="sec-web" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Sitio web</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <AuditoriaWebCard business={business} />
          <ModuloSitioWeb
            business={business}
            pricingNuevo={pricingNuevo}
            pricingOptimizar={pricingOptimizar}
            tieneWebPropia={!!business.website}
            slug={slug}
          />
        </section>

        {/* ── Plataformas ─────────────────────────────── */}
        <section id="sec-plataformas" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Plataformas de reserva</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <SeccionBloqueada
            slug={slug}
            pricing={pricing}
            titulo="Plataformas de reserva"
            descripcion="Tu estado en las principales plataformas de reserva online con links directos para gestionar tu presencia."
            incluye={[
              'Estado en Booking.com, Airbnb, Expedia, Despegar y TripAdvisor',
              'Calificación y número de reseñas en cada plataforma',
              'Links directos a tu perfil en cada plataforma',
              'Recomendaciones para plataformas donde no estás presente',
            ]}
          />
        </section>

        {/* ── Competencia ─────────────────────────────── */}
        <section id="sec-benchmark" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Benchmark vs competencia</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <SeccionBloqueada
            slug={slug}
            pricing={pricing}
            titulo="Benchmark vs competencia"
            descripcion="Compara tu negocio contra negocios similares de tu ciudad y descubre exactamente dónde estás parado."
            incluye={[
              'Score total vs el promedio de tu categoría y ciudad',
              'Posición en calificación Google, reputación y rendimiento web',
              'Gráficos comparativos de cada módulo vs la competencia',
              'Cuántos negocios similares te superan y en qué áreas',
            ]}
          />
        </section>

        {/* ── Recomendaciones ─────────────────────────── */}
        <section id="sec-detalle" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Análisis y recomendaciones</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <SeccionBloqueada
            slug={slug}
            pricing={pricing}
            titulo="Análisis detallado y recomendaciones"
            descripcion="Plan de acción paso a paso para cada uno de los 6 módulos, priorizado por impacto en visibilidad y reservas."
            incluye={[
              'Recomendaciones específicas para Google Maps, sitio web y reputación',
              'Guía por red social: Instagram, Facebook, TikTok, YouTube y TripAdvisor',
              'Diagnóstico de plataformas: Booking, Airbnb, Expedia y más',
              'Priorización por impacto: qué cambiar primero para ver resultados antes',
              'Nota de análisis generada para tu negocio en particular',
            ]}
          />
        </section>

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
