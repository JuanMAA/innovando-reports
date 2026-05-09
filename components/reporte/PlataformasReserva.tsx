import { ExternalLink } from 'lucide-react'

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
  const normalized = max === 10 ? rating / 2 : rating  // normalizar a /5
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

// ── Tarjeta de plataforma ─────────────────────────────────────
function PlatformCard({ plat, data }: { plat: typeof PLATAFORMAS[0]; data: PlatformData }) {
  const url      = data[plat.urlKey]
  const rating   = data[plat.ratingKey]   ? parseFloat(data[plat.ratingKey]!)   : null
  const reviews  = data[plat.reviewsKey]  ? parseInt(data[plat.reviewsKey]!)    : null
  const price    = plat.priceKey && data[plat.priceKey] ? parseFloat(data[plat.priceKey]!) : null
  const ranking  = (plat as any).rankingKey  && data[(plat as any).rankingKey]  ? data[(plat as any).rankingKey]  : null
  const superhost = (plat as any).superhostKey && data[(plat as any).superhostKey] === 'true'
  const excellence = (plat as any).excellenceKey && data[(plat as any).excellenceKey] === 'true'

  if (!url) return null

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
        Reservar en {plat.label}
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function PlataformasReserva({ platformData, description, businessName }: Props) {
  const plataformasActivas = PLATAFORMAS.filter(p => platformData[p.urlKey])

  if (plataformasActivas.length === 0) return null

  return (
    <div className="flex flex-col gap-5">

      {/* Descripción */}
      {description && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Descripción</p>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>
      )}

      {/* Plataformas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Disponible en {plataformasActivas.length} plataforma{plataformasActivas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATAFORMAS.map(plat => (
            <PlatformCard key={plat.id} plat={plat} data={platformData} />
          ))}
        </div>
      </div>
    </div>
  )
}
