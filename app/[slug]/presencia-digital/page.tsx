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
import SeccionDesbloqueada from '@/components/reporte/SeccionDesbloqueada'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ paid?: string }>
}

export default async function ReportePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams
  const paidParam = sp?.paid
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

  // Fetch foto principal desde business_data
  const { data: fotoData } = await supabase
    .from('business_data')
    .select('value')
    .eq('business_id', business.id)
    .eq('module', 'maps')
    .eq('key', 'photo_1')
    .maybeSingle()

  const fotoRef = fotoData?.value ?? null
  const foto = fotoRef ? `/api/photo?ref=${fotoRef}` : null

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
        foto={foto}
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

        {/* ── Banner de estado de pago ──────────────────── */}
        {paidParam === '1' && !report.is_unlocked && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-5 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-lg">⏳</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Pago en confirmación</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Estamos esperando la confirmación de la pasarela. El informe se desbloqueará en cuanto se apruebe el pago — refrescá esta página en unos segundos.</p>
            </div>
          </div>
        )}
        {paidParam === 'failed' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-700 px-5 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-lg">✕</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-rose-900 dark:text-rose-100">No se pudo procesar el pago</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">La pasarela rechazó el cobro o lo cancelaste. Podés intentar de nuevo desde el botón de desbloqueo.</p>
            </div>
          </div>
        )}
        {report.is_unlocked && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700 px-5 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-lg">✓</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Informe completo desbloqueado</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">Tenés acceso a todas las secciones. Si necesitás el PDF o un acompañamiento, escribinos por WhatsApp.</p>
            </div>
          </div>
        )}

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

          {/* Acceso al informe de sentimientos — sólo si está disponible */}
          {report.modulo_sentimientos && (
            <a
              href={`/${slug}/sentimientos`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-50 via-white to-blue-50 dark:from-pink-500/10 dark:via-gray-900 dark:to-blue-500/10 p-5 hover:shadow-md transition-shadow"
            >
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="text-lg">💗</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Informe de análisis de sentimientos
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Score {report.modulo_sentimientos.sentiment_score}/100 · {report.modulo_sentimientos.resenas_analizadas} reseñas analizadas con IA
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:translate-x-0.5 transition-transform">
                Ver informe
                <span aria-hidden>→</span>
              </span>
            </a>
          )}
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
          {report.is_unlocked ? (
            <SeccionDesbloqueada
              titulo="Plataformas de reserva"
              descripcion="Booking.com, Airbnb, Expedia, Despegar y TripAdvisor — calificaciones y links directos para gestionar tu presencia."
            />
          ) : (
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
          )}
        </section>

        {/* ── Competencia ─────────────────────────────── */}
        <section id="sec-benchmark" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Benchmark vs competencia</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {report.is_unlocked ? (
            <SeccionDesbloqueada
              titulo="Benchmark vs competencia"
              descripcion="Comparativa con negocios similares de tu ciudad — score, calificación y rendimiento web."
            />
          ) : (
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
          )}
        </section>

        {/* ── Recomendaciones ─────────────────────────── */}
        <section id="sec-detalle" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Análisis y recomendaciones</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {report.is_unlocked ? (
            <SeccionDesbloqueada
              titulo="Análisis detallado y recomendaciones"
              descripcion="Plan de acción paso a paso por módulo, priorizado por impacto. Te lo enviamos en PDF — coordinamos por WhatsApp."
            />
          ) : (
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
          )}
        </section>

        {/* Report a problem */}
        <div data-print="hidden">
          <ReportarProblema businessId={business.id} />
        </div>

      </main>

      {!report.is_unlocked && (
        <div data-print="hidden">
          <StickyTeaser slug={slug} pricing={pricing} />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8 mb-20">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3">
          <p className="text-sm text-gray-400 leading-relaxed">
            <span className="font-medium text-gray-500">Aviso:</span> Este reporte fue generado de forma automática a partir de información pública disponible en internet — Google Maps, sitios web, redes sociales y plataformas de viaje. Los datos reflejan el estado al momento del análisis y pueden no estar actualizados. Si encuentras algún error, puedes reportarlo arriba.
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
