import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { SentimientosData } from '@/types'
import AnalisisSentimientos from '@/components/reporte/AnalisisSentimientos'

export const metadata = {
  title:       'Análisis de Sentimientos — Demo · Innovando',
  description: 'Ejemplo del informe standalone de análisis de sentimientos de reseñas.',
}

// Mismos datos que /demo/presencia-digital — comparten el negocio ficticio.
const DEMO_BUSINESS = {
  id:     'demo-business-id',
  slug:   'demo',
  name:   'Hostal El Mirador',
  city:   'Santiago, Chile',
  domain: 'hostalmirador.cl',
}

const DEMO_SENTIMIENTOS: SentimientosData = {
  total_resenas:      187,
  resenas_analizadas: 150,
  sentiment_score:    78,
  positivas_pct:      72,
  neutras_pct:        18,
  negativas_pct:      10,
  resumen:            'Los huéspedes destacan la limpieza impecable, la atención cálida del anfitrión y la vista al mar. Las quejas más recurrentes son sobre el wifi lento y la falta de estacionamiento cubierto.',
  temas_positivos: [
    { tema: 'Limpieza',     menciones: 84 },
    { tema: 'Atención',     menciones: 71 },
    { tema: 'Vista al mar', menciones: 53 },
    { tema: 'Ubicación',    menciones: 41 },
    { tema: 'Desayuno',     menciones: 28 },
  ],
  temas_negativos: [
    { tema: 'WiFi lento',          menciones: 18 },
    { tema: 'Sin estacionamiento', menciones: 12 },
    { tema: 'Ruido nocturno',      menciones: 6  },
  ],
  resenas_destacadas: [
    { autor: 'María P.',  rating: 5, fecha: 'hace 2 meses',  plataforma: 'google',     sentimiento: 'positivo',
      texto: 'Lugar impecable, la anfitriona muy amable y la vista al amanecer es de otro mundo. Volveremos sin duda.' },
    { autor: 'Carlos R.', rating: 4, fecha: 'hace 1 mes',    plataforma: 'booking',     sentimiento: 'positivo',
      texto: 'Excelente ubicación y muy limpio. El wifi podría mejorar pero no fue un problema mayor.' },
    { autor: 'Anónimo',   rating: 3, fecha: 'hace 3 semanas',plataforma: 'tripadvisor', sentimiento: 'neutro',
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
}

export default function DemoSentimientosPage() {
  const iniciales = DEMO_BUSINESS.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">

      {/* Hero violeta */}
      <div className="print:hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-violet-500/10 dark:via-gray-900 dark:to-purple-500/10 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">

          <Link href="/demo/presencia-digital" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al reporte
          </Link>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <img src="/logo-innovando.png" alt="Innovando" className="h-10 w-10" />
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-violet-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Análisis de Sentimientos
              </p>
            </div>
            <span className="ml-auto inline-flex items-center rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              Demo · datos ficticios
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-gray-400 dark:text-gray-500 select-none">{iniciales}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                {DEMO_BUSINESS.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{DEMO_BUSINESS.city}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xl leading-relaxed">
                Análisis automático con IA de las reseñas públicas para detectar emociones, temas recurrentes y oportunidades de mejora.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <AnalisisSentimientos data={DEMO_SENTIMIENTOS} />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-8">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-500 dark:text-gray-400">Aviso:</span> Demo con datos ficticios. Los informes reales se generan a partir de reseñas públicas de Google Maps, Booking, Airbnb, TripAdvisor y más.
          </p>
          <a href="https://innovando.cl" className="text-xs text-gray-400 hover:text-gray-600">innovando.cl</a>
        </div>
      </footer>
    </div>
  )
}
