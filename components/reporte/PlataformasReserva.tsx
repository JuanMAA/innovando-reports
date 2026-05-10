import { ExternalLink, PlusCircle, Lock } from 'lucide-react'

// ── Config de plataformas ────────────────────────────────────
const PLATAFORMAS = [
  {
    id:    'booking',
    label: 'Booking.com',
    color: 'bg-[#003580]',
    textColor: 'text-white',
    borderColor: 'border-[#003580]',
    accentColor: 'text-[#003580]',
    urlKey:     'booking_url',
    ratingKey:  'booking_rating',
    reviewsKey: 'booking_reviews',
    priceKey:   'booking_price_avg',
    priceLabel: 'precio promedio',
    ratingMax:  10,
    registerUrl: 'https://partner.booking.com',
    icon: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
        <rect width="40" height="40" rx="6" fill="#003580"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">B.</text>
      </svg>
    ),
  },
  {
    id:    'airbnb',
    label: 'Airbnb',
    color: 'bg-[#FF5A5F]',
    textColor: 'text-white',
    borderColor: 'border-[#FF5A5F]',
    accentColor: 'text-[#FF5A5F]',
    urlKey:     'airbnb_url',
    ratingKey:  'airbnb_rating',
    reviewsKey: 'airbnb_reviews',
    priceKey:   'airbnb_price_night',
    priceLabel: 'noche',
    superhostKey: 'airbnb_superhost',
    ratingMax:  5,
    registerUrl: 'https://www.airbnb.com/host/homes',
    icon: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
        <rect width="40" height="40" rx="6" fill="#FF5A5F"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">A</text>
      </svg>
    ),
  },
  {
    id:    'tripadvisor',
    label: 'TripAdvisor',
    color: 'bg-[#34E0A1]',
    textColor: 'text-gray-900',
    borderColor: 'border-[#34E0A1]',
    accentColor: 'text-emerald-600',
    urlKey:     'tripadvisor_url',
    ratingKey:  'tripadvisor_rating',
    reviewsKey: 'tripadvisor_reviews',
    priceKey:   null,
    rankingKey: 'tripadvisor_ranking',
    excellenceKey: 'tripadvisor_excellence',
    ratingMax:  5,
    registerUrl: 'https://www.tripadvisor.com/Owners',
    icon: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
        <rect width="40" height="40" rx="6" fill="#34E0A1"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#1a1a1a" fontSize="18" fontWeight="bold" fontFamily="sans-serif">T</text>
      </svg>
    ),
  },
  {
    id:    'expedia',
    label: 'Expedia',
    color: 'bg-[#1E3660]',
    textColor: 'text-white',
    borderColor: 'border-[#1E3660]',
    accentColor: 'text-[#1E3660]',
    urlKey:     'expedia_url',
    ratingKey:  'expedia_rating',
    reviewsKey: 'expedia_reviews',
    priceKey:   null,
    ratingMax:  10,
    registerUrl: 'https://www.expediagroup.com/partners',
    icon: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
        <rect width="40" height="40" rx="6" fill="#1E3660"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">E</text>
      </svg>
    ),
  },
  {
    id:    'despegar',
    label: 'Despegar',
    color: 'bg-[#F47920]',
    textColor: 'text-white',
    borderColor: 'border-[#F47920]',
    accentColor: 'text-orange-600',
    urlKey:     'despegar_url',
    ratingKey:  'despegar_rating',
    reviewsKey: 'despegar_reviews',
    priceKey:   null,
    ratingMax:  10,
    registerUrl: 'https://partners.despegar.com',
    icon: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
        <rect width="40" height="40" rx="6" fill="#F47920"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">D</text>
      </svg>
    ),
  },
]

// ── Tipos ─────────────────────────────────────────────────────
type PlatformData = Record<string, string | null>

interface Props {
  platformData: PlatformData
  description: string | null
  businessName: string
}

// ── Stars helper ──────────────────────────────────────────────
function Stars({ rating, max }: { rating: number; max: number }) {
  const normalized = max === 10 ? rating / 2 : rating
  const full  = Math.floor(normalized)
  const half  = normalized - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-xs leading-none">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      <span className="text-gray-300">{'★'.repeat(empty)}</span>
    </span>
  )
}

// ── Tarjeta de plataforma — presente ─────────────────────────
function PlatformCardActive({ plat, data }: { plat: typeof PLATAFORMAS[0]; data: PlatformData }) {
  const url      = data[plat.urlKey]!
  const rating   = data[plat.ratingKey]   ? parseFloat(data[plat.ratingKey]!)   : null
  const reviews  = data[plat.reviewsKey]  ? parseInt(data[plat.reviewsKey]!)    : null
  const price    = plat.priceKey && data[plat.priceKey] ? parseFloat(data[plat.priceKey]!) : null
  const ranking  = (plat as any).rankingKey  && data[(plat as any).rankingKey]  ? data[(plat as any).rankingKey]  : null
  const superhost  = (plat as any).superhostKey  && data[(plat as any).superhostKey]  === 'true'
  const excellence = (plat as any).excellenceKey && data[(plat as any).excellenceKey] === 'true'

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        {plat.icon}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{plat.label}</p>
          {superhost && (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">⭐ Superhost</span>
          )}
          {excellence && (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">🏆 Certificate of Excellence</span>
          )}
        </div>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0">✓ Presente</span>
      </div>

      {/* Rating + reviews */}
      {rating !== null && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-lg font-bold ${plat.accentColor}`}>
            {rating.toFixed(1)}<span className="text-xs text-gray-400 font-normal">/{plat.ratingMax}</span>
          </span>
          <Stars rating={rating} max={plat.ratingMax} />
          {reviews !== null && (
            <span className="text-xs text-gray-500">{reviews.toLocaleString('es-CL')} reseñas</span>
          )}
        </div>
      )}

      {/* Price */}
      {price !== null && (
        <div className="text-sm text-gray-700">
          Desde <span className="font-semibold text-gray-900">${price.toLocaleString('es-CL')}</span>
          <span className="text-gray-500 text-xs"> /{plat.priceLabel}</span>
        </div>
      )}

      {/* Ranking TripAdvisor */}
      {ranking && (
        <p className="text-xs text-gray-500">📍 {ranking}</p>
      )}

      {/* Botón */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ${plat.color} ${plat.textColor}`}
      >
        Ver en {plat.label}
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </div>
  )
}

// ── Tarjeta de plataforma — ausente ──────────────────────────
function PlatformCardMissing({ plat }: { plat: typeof PLATAFORMAS[0] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="opacity-40">{plat.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-400 text-sm leading-tight">{plat.label}</p>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 shrink-0">No encontrado</span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        No se encontró presencia en esta plataforma. Registrarte puede aumentar tu visibilidad y reservas directas.
      </p>

      {/* Botón registrarse */}
      <a
        href={plat.registerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <PlusCircle className="w-3.5 h-3.5 text-gray-400" />
        Registrarme en {plat.label}
      </a>
    </div>
  )
}

// ── Teaser cuando no hay ningún dato ─────────────────────────
function SinDatosTeaser() {
  const logos = PLATAFORMAS.slice(0, 5)
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Fila de logos con blur */}
      <div className="relative px-6 pt-6 pb-4 overflow-hidden">
        <div className="blur-sm pointer-events-none select-none flex gap-2.5">
          {logos.map(p => (
            <div key={p.id} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              {p.icon}
              <span className="text-xs font-semibold text-gray-500">{p.label}</span>
            </div>
          ))}
        </div>
        {/* Fade derecha */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white" />
      </div>

      {/* Mensaje */}
      <div className="px-6 pb-5 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Sin datos de plataformas</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            No se encontraron datos de plataformas para este negocio en el momento del análisis.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function PlataformasReserva({ platformData, description, businessName }: Props) {
  const plataformasActivas = PLATAFORMAS.filter(p => platformData[p.urlKey])
  const sinDatos = plataformasActivas.length === 0

  if (sinDatos) return <SinDatosTeaser />

  return (
    <div className="flex flex-col gap-5">

      {/* Descripción */}
      {description && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Descripción</p>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>
      )}

      {/* Grid de plataformas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Disponible en {plataformasActivas.length} plataforma{plataformasActivas.length !== 1 ? 's' : ''}
            {plataformasActivas.length < PLATAFORMAS.length && (
              <span className="ml-2 text-gray-300">
                · {PLATAFORMAS.length - plataformasActivas.length} sin presencia
              </span>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATAFORMAS.map(plat =>
            platformData[plat.urlKey]
              ? <PlatformCardActive key={plat.id} plat={plat} data={platformData} />
              : <PlatformCardMissing key={plat.id} plat={plat} />
          )}
        </div>
      </div>
    </div>
  )
}
