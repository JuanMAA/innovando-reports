import { Business, Report, CountryPricing } from '@/types'
import NotaGeneral from '@/components/reporte/NotaGeneral'
import ModulosBars from '@/components/reporte/ModulosBars'
import ModulosDetalle from '@/components/reporte/ModulosDetalle'
import AuditoriaWebCard from '@/components/reporte/AuditoriaWebCard'
import ModuloSitioWeb from '@/components/reporte/ModuloSitioWeb'
import PlataformasReserva from '@/components/reporte/PlataformasReserva'
import ComparacionBenchmark from '@/components/reporte/ComparacionBenchmark'
import HeroHeader from '@/components/reporte/HeroHeader'
import ReportarProblema from '@/components/reporte/ReportarProblema'
import StickyTeaser from '@/components/reporte/StickyTeaser'
import { buildGroup, type BizRow, type BenchmarkData } from '@/lib/benchmark'

// ─────────────────────────────────────────────────────────────
// DATOS FICTICIOS — Hostal El Mirador, Santiago, Chile
// ─────────────────────────────────────────────────────────────

const DEMO_BUSINESS: Business = {
  id:                  'demo-business-id',
  place_id:            'ChIJdemo1234567890',
  slug:                'demo',
  name:                'Hostal El Mirador',
  category:            'Hostal',
  city:                'Santiago',
  country:             'cl',
  address:             'Av. Providencia 1234, Providencia, Santiago',
  phone:               '+56 9 8765 4321',
  email:               'contacto@hostalmirador.cl',
  email_source:        'web',
  whatsapp:            '+56987654321',
  whatsapp_source:     'web',
  website:             'https://hostalmirador.cl',
  needs_review:        false,
  missing_fields:      [],
  score_p2a:           14,
  score_p2b:           11,
  score_p2c:           16,
  score_p2d:           9,
  score_p2e:           2,
  score_p2f:           12,
  score_total:         64,
  rating:              4.3,
  num_reviews:         87,
  status:              'analyzed',
  plan:                null,
  has_reported_issue:  false,
  latitude:            -33.4372,
  longitude:           -70.6506,
  google_maps_url:     'https://maps.google.com/?cid=demo',
  latest_report_id:    'demo-report-id',
  lh_performance:      48,
  lh_seo:              72,
  lh_accessibility:    61,
  lh_best_practices:   83,
  lh_lcp_ms:           3800,
  lh_action:           'optimizar',
  scraped_at:          '2025-05-01T10:00:00Z',
  created_at:          '2025-01-15T08:00:00Z',
  updated_at:          '2025-05-01T10:00:00Z',
}

const DEMO_REPORT: Report = {
  id:                   'demo-report-id',
  business_id:          'demo-business-id',
  type:                 'completo',
  generated_at:         '2025-05-01T10:00:00Z',
  score_total:          64,
  score_p2a:            14,
  score_p2b:            11,
  score_p2c:            16,
  score_p2d:            9,
  score_p2e:            2,
  score_p2f:            12,
  general_note:         'Hostal El Mirador tiene una base sólida en reputación online con buena calificación en Google, pero pierde puntos importantes por la lentitud de su sitio web y la ausencia en plataformas clave como Airbnb y Expedia. Con ajustes técnicos básicos y registrarse en 2 plataformas más, podría superar los 80 puntos.',
  general_note_edited:  false,
  modulo_p2a: {
    score:        14,
    nota:         'La ficha de Google Maps está activa y bien mantenida, con fotos y horarios completos. El volumen de reseñas es bueno pero la calificación de 4.3 deja margen para crecer.',
    nota_editada: false,
    datos:        { rating: 4.3, num_reviews: 87, has_hours: true, num_photos: 23, has_description: true },
  },
  modulo_p2b: {
    score:        11,
    nota:         'El sitio web existe y tiene HTTPS activo, pero la velocidad de carga es lenta (48/100) lo que penaliza tanto el SEO como la experiencia del usuario. Es la mejora con mayor impacto inmediato.',
    nota_editada: false,
    datos:        { lh_performance: 48, lh_seo: 72, lh_accessibility: 61, ssl: true, mobile_friendly: true },
  },
  modulo_p2c: {
    score:        16,
    nota:         '87 reseñas con un promedio de 4.3 estrellas es un resultado muy positivo para la categoría. El hostal responde activamente a las opiniones, lo que fortalece la imagen pública.',
    nota_editada: false,
    datos:        { rating: 4.3, num_reviews: 87 },
  },
  modulo_p2d: {
    score:        9,
    nota:         'Presencia en Instagram y Facebook, pero sin TikTok ni YouTube. El Instagram tiene actividad irregular — hay meses sin publicaciones, lo que afecta el alcance orgánico.',
    nota_editada: false,
    datos:        { instagram_url: 'https://instagram.com/hostalmirador', facebook_url: 'https://facebook.com/hostalmirador' },
  },
  modulo_p2e: {
    score:        2,
    nota:         'El negocio no aparece en el AI Overview de Google ni en Perplexity. El sitio web carece de datos estructurados JSON-LD, lo que dificulta que los motores de IA lo citen como referencia.',
    nota_editada: false,
    datos:        { google_ai_overview: false, perplexity_mentioned: false, has_structured_data: false, travel_guides_count: 1 },
  },
  modulo_p2f: {
    score:        12,
    nota:         'Presente en Booking.com y TripAdvisor con buenas calificaciones, pero ausente en Airbnb, Expedia y Despegar. Ampliar presencia en estas plataformas podría aumentar la ocupación un 20–35%.',
    nota_editada: false,
    datos:        { booking_url: true, tripadvisor_url: true, airbnb_url: false, expedia_url: false },
  },
  modulo_sentimientos: {
    total_resenas:      187,
    resenas_analizadas: 150,
    sentiment_score:    78,
    positivas_pct:      72,
    neutras_pct:        18,
    negativas_pct:      10,
    resumen:            'Los huéspedes destacan la limpieza impecable, la atención cálida del anfitrión y la vista al mar. Las quejas más recurrentes son sobre el wifi lento y la falta de estacionamiento cubierto.',
    temas_positivos: [
      { tema: 'Limpieza',    menciones: 84 },
      { tema: 'Atención',    menciones: 71 },
      { tema: 'Vista al mar',menciones: 53 },
      { tema: 'Ubicación',   menciones: 41 },
      { tema: 'Desayuno',    menciones: 28 },
    ],
    temas_negativos: [
      { tema: 'WiFi lento',          menciones: 18 },
      { tema: 'Sin estacionamiento', menciones: 12 },
      { tema: 'Ruido nocturno',      menciones: 6  },
    ],
    resenas_destacadas: [
      { autor: 'María P.',   rating: 5, fecha: 'hace 2 meses', plataforma: 'google',      sentimiento: 'positivo',
        texto: 'Lugar impecable, la anfitriona muy amable y la vista al amanecer es de otro mundo. Volveremos sin duda.' },
      { autor: 'Carlos R.',  rating: 4, fecha: 'hace 1 mes',   plataforma: 'booking',     sentimiento: 'positivo',
        texto: 'Excelente ubicación y muy limpio. El wifi podría mejorar pero no fue un problema mayor.' },
      { autor: 'Anónimo',    rating: 3, fecha: 'hace 3 semanas', plataforma: 'tripadvisor', sentimiento: 'neutro',
        texto: 'Buen lugar para descansar, aunque por la noche se escucha ruido de la calle. La cama es muy cómoda.' },
    ],
    palabras_clave: [
      { palabra: 'limpio',     peso: 95, sentimiento: 'pos' },
      { palabra: 'amable',     peso: 88, sentimiento: 'pos' },
      { palabra: 'tranquilo',  peso: 60, sentimiento: 'pos' },
      { palabra: 'wifi',       peso: 45, sentimiento: 'neg' },
      { palabra: 'cómodo',     peso: 70, sentimiento: 'pos' },
      { palabra: 'vista',      peso: 80, sentimiento: 'pos' },
      { palabra: 'desayuno',   peso: 40, sentimiento: 'pos' },
      { palabra: 'ruido',      peso: 32, sentimiento: 'neg' },
      { palabra: 'recomendado',peso: 55, sentimiento: 'pos' },
      { palabra: 'ubicación',  peso: 65, sentimiento: 'pos' },
    ],
    evolucion: [
      { mes: 'dic', score: 71 },
      { mes: 'ene', score: 74 },
      { mes: 'feb', score: 76 },
      { mes: 'mar', score: 79 },
      { mes: 'abr', score: 78 },
      { mes: 'may', score: 78 },
    ],
  },
  is_public:   true,
  is_unlocked: true,         // demo: mostrar como si estuviera desbloqueado
  unlocked_at: null,
  unlock_order_id: null,
  version:     1,
}

const DEMO_PLATFORM_DATA: Record<string, string | null> = {
  booking_url:          'https://www.booking.com/hotel/cl/hostal-el-mirador.html',
  booking_rating:       '8.4',
  booking_reviews:      '312',
  booking_photos:       '48',
  booking_price_avg:    '42000',
  booking_superhost:    null,
  tripadvisor_url:      'https://www.tripadvisor.cl/Hotel_Review-hostal-el-mirador',
  tripadvisor_rating:   '4.5',
  tripadvisor_reviews:  '94',
  tripadvisor_ranking:  '18',
  tripadvisor_excellence: 'true',
  airbnb_url:           null,
  expedia_url:          null,
  despegar_url:         null,
}

const DEMO_SOCIAL_DATA: Record<string, string | null> = {
  instagram_url:            'https://instagram.com/hostalmirador',
  instagram_username:       'hostalmirador',
  instagram_followers:      '1240',
  instagram_last_post_days: '12',
  instagram_engagement:     '3.2',
  facebook_url:             'https://facebook.com/hostalmirador',
  facebook_username:        'hostalmirador',
  facebook_followers:       '890',
  facebook_last_post_days:  '5',
  tiktok_url:               null,
  youtube_url:              null,
  tripadvisor_url:          'https://www.tripadvisor.cl/Hotel_Review-hostal-el-mirador',
}

const DEMO_DESCRIPTION =
  'Hostal boutique en pleno corazón de Providencia, a pasos del metro y con acceso directo a los mejores restaurantes y tiendas de Santiago. Habitaciones confortables con desayuno incluido, WiFi de alta velocidad y atención personalizada las 24 horas.'

const DEMO_PRICING: CountryPricing = {
  id:            'demo-pricing-id',
  country:       'cl',
  category:      'hospedaje',
  service:       'reporte_completo',
  price:         29900,
  currency:      'CLP',
  price_display: '$29.900 CLP',
  active:        true,
}

const DEMO_PRICING_OPTIMIZAR: CountryPricing = {
  id:            'demo-pricing-opt-id',
  country:       'cl',
  category:      'hospedaje',
  service:       'optimizacion_web',
  price:         149000,
  currency:      'CLP',
  price_display: '$149.000 CLP',
  active:        true,
}

const DEMO_PRICING_NUEVO: CountryPricing = {
  id:            'demo-pricing-new-id',
  country:       'cl',
  category:      'hospedaje',
  service:       'sitio_nuevo',
  price:         290000,
  currency:      'CLP',
  price_display: '$290.000 CLP',
  active:        true,
}

// ─────────────────────────────────────────────────────────────
// Benchmark data — comparación simulada
// ─────────────────────────────────────────────────────────────

const CITY_ROWS: BizRow[] = [
  { score_total: 78, score_p2a: 17, score_p2c: 18, score_p2f: 16, rating: 4.6, num_reviews: 210, lh_performance: 71, category: 'Hostal' },
  { score_total: 55, score_p2a: 12, score_p2c: 13, score_p2f: 10, rating: 4.0, num_reviews: 45,  lh_performance: 38, category: 'Hostal' },
  { score_total: 69, score_p2a: 15, score_p2c: 16, score_p2f: 14, rating: 4.4, num_reviews: 130, lh_performance: 55, category: 'Hostal' },
  { score_total: 82, score_p2a: 18, score_p2c: 19, score_p2f: 17, rating: 4.7, num_reviews: 380, lh_performance: 82, category: 'Hostal' },
  { score_total: 47, score_p2a: 10, score_p2c: 11, score_p2f:  8, rating: 3.9, num_reviews: 28,  lh_performance: 31, category: 'Hostal' },
  { score_total: 73, score_p2a: 16, score_p2c: 17, score_p2f: 15, rating: 4.5, num_reviews: 165, lh_performance: 63, category: 'Hostal' },
  { score_total: 61, score_p2a: 13, score_p2c: 14, score_p2f: 11, rating: 4.2, num_reviews: 72,  lh_performance: 44, category: 'Hostal' },
]

const BIZ_METRICS: BizRow = {
  score_total:    64,
  score_p2a:      14,
  score_p2c:      16,
  score_p2f:      12,
  rating:         4.3,
  num_reviews:    87,
  lh_performance: 48,
  category:       'Hostal',
}

const BENCHMARK_DATA: BenchmarkData = {
  catKeyword: 'hostal',
  catLabel:   'Hostales',
  groups: [
    {
      ...buildGroup('Hostales en Santiago', '', CITY_ROWS, BIZ_METRICS),
      sublabel: `${CITY_ROWS.length} negocios comparados`,
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function DemoPage() {
  const city = 'Santiago, Chile'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      {/* Banner demo */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium tracking-wide sticky top-0 z-10">
        ✦ Este es un reporte de ejemplo con datos ficticios — así se ve tu reporte completo ✦
      </div>

      <HeroHeader
        nombre={DEMO_BUSINESS.name}
        ciudad={city}
        scoreTotal={DEMO_BUSINESS.score_total}
        subtitulo="Reporte de presencia digital — Ejemplo"
        foto={null}
        modulos={[
          { code: 'Maps',  score: DEMO_BUSINESS.score_p2a, max: 20 },
          { code: 'Web',   score: DEMO_BUSINESS.score_p2b, max: 20 },
          { code: 'Rep.',  score: DEMO_BUSINESS.score_p2c, max: 20 },
          { code: 'Redes', score: DEMO_BUSINESS.score_p2d, max: 15 },
          { code: 'IA',    score: DEMO_BUSINESS.score_p2e, max: 5  },
          { code: 'Plat.', score: DEMO_BUSINESS.score_p2f, max: 20 },
        ]}
        secciones={[
          { id: 'sec-diagnostico', label: 'Diagnóstico'                                         },
          { id: 'sec-web',         label: 'Sitio web',   score: DEMO_BUSINESS.score_p2b, max: 20 },
          { id: 'sec-plataformas', label: 'Plataformas', score: DEMO_BUSINESS.score_p2f, max: 20 },
          { id: 'sec-benchmark',   label: 'Competencia'                                         },
          { id: 'sec-detalle',     label: 'Recomendaciones'                                     },
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
            <NotaGeneral report={DEMO_REPORT} />
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ModulosBars report={DEMO_REPORT} />
            </div>
          </div>
        </section>

        {/* ── Sitio web ───────────────────────────────── */}
        <section id="sec-web" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Sitio web</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <AuditoriaWebCard business={DEMO_BUSINESS} />
          <ModuloSitioWeb
            business={DEMO_BUSINESS}
            pricingNuevo={DEMO_PRICING_NUEVO}
            pricingOptimizar={DEMO_PRICING_OPTIMIZAR}
            tieneWebPropia={!!DEMO_BUSINESS.website}
            slug="demo"
          />
        </section>

        {/* ── Plataformas ─────────────────────────────── */}
        <section id="sec-plataformas" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Plataformas de reserva</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <PlataformasReserva
            platformData={DEMO_PLATFORM_DATA}
            description={DEMO_DESCRIPTION}
            businessName={DEMO_BUSINESS.name}
          />
        </section>

        {/* ── Competencia ─────────────────────────────── */}
        <section id="sec-benchmark" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Benchmark vs competencia</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <ComparacionBenchmark
              business={BIZ_METRICS}
              benchmark={BENCHMARK_DATA}
              businessName={DEMO_BUSINESS.name}
            />
          </div>
        </section>

        {/* ── Recomendaciones ─────────────────────────── */}
        <section id="sec-detalle" className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Análisis y recomendaciones</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <ModulosDetalle
            report={DEMO_REPORT}
            business={DEMO_BUSINESS}
            socialData={DEMO_SOCIAL_DATA}
            platformData={DEMO_PLATFORM_DATA}
            slug="demo"
            pricingNuevo={DEMO_PRICING_NUEVO}
            pricingOptimizar={DEMO_PRICING_OPTIMIZAR}
          />
        </section>

        {/* Reportar problema (demo — no funcional) */}
        <div data-print="hidden">
          <ReportarProblema businessId="demo-business-id" />
        </div>

      </main>

      {/* Sticky teaser */}
      <div data-print="hidden">
        <StickyTeaser slug="demo" pricing={DEMO_PRICING} />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8 mb-20">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-500">Aviso:</span> Este es un reporte de demostración con datos ficticios. Los reportes reales son generados automáticamente a partir de información pública — Google Maps, sitios web, redes sociales y plataformas de viaje.
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
