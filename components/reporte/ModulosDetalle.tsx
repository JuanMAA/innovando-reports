'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, ChevronRight, ChevronsDownUp, ChevronsUpDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Report, Business, CountryPricing } from '@/types'

interface Props {
  report:            Report
  business:          Business
  socialData:        Record<string, string | null>
  platformData:      Record<string, string | null>
  slug:              string
  pricingNuevo?:     CountryPricing | null
  pricingOptimizar?: CountryPricing | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function barColor(pct: number) {
  if (pct >= 0.7) return 'bg-green-500'
  if (pct >= 0.4) return 'bg-amber-400'
  return 'bg-red-400'
}

function scoreColor(pct: number) {
  if (pct >= 0.7) return 'text-green-600'
  if (pct >= 0.4) return 'text-amber-600'
  return 'text-red-500'
}

function badgeBg(pct: number) {
  if (pct >= 0.7) return 'bg-green-50 border-green-200'
  if (pct >= 0.4) return 'bg-amber-50 border-amber-200'
  return 'bg-red-50 border-red-200'
}

type Rec = { type: 'ok' | 'warn' | 'error'; text: string }

function RecItem({ rec }: { rec: Rec }) {
  const icons = {
    ok:    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,
    warn:  <AlertCircle  className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
    error: <XCircle      className="w-4 h-4 text-red-400   shrink-0 mt-0.5" />,
  }
  return (
    <li className="flex items-start gap-2">
      {icons[rec.type]}
      <span className="text-sm leading-snug text-gray-700">{rec.text}</span>
    </li>
  )
}

// ── Recommendation builders ───────────────────────────────────────────────────

function recsP2a(business: Business): Rec[] {
  const recs: Rec[] = []
  const rating  = business.rating ?? 0
  const reviews = business.num_reviews ?? 0

  if (!business.google_maps_url) {
    recs.push({ type: 'error', text: 'No se encontró ficha de Google Maps. Crea o reclama tu perfil en Google Business Profile.' })
    return recs
  }
  recs.push({ type: 'ok', text: 'Tu ficha de Google Maps está activa.' })

  if (rating >= 4.5)       recs.push({ type: 'ok',   text: `Excelente calificación de ${rating} ⭐. Mantén la consistencia respondiendo cada reseña.` })
  else if (rating >= 4.0)  recs.push({ type: 'warn',  text: `Calificación de ${rating} ⭐. Responde activamente y pide a clientes satisfechos que suban la nota.` })
  else if (rating > 0)     recs.push({ type: 'error', text: `Calificación baja (${rating} ⭐). Responde reseñas negativas con empatía y toma acciones correctivas visibles.` })

  if (reviews >= 100)      recs.push({ type: 'ok',   text: `${reviews} reseñas — volumen sólido. Sigue incentivando nuevas opiniones.` })
  else if (reviews >= 50)  recs.push({ type: 'warn',  text: `${reviews} reseñas. Genera un QR en recepción o tarjeta de agradecimiento con el link para reseñar.` })
  else if (reviews >= 10)  recs.push({ type: 'error', text: `Solo ${reviews} reseñas. Envía seguimiento por WhatsApp/email pidiendo una reseña tras la estadía.` })
  else                     recs.push({ type: 'error', text: 'Muy pocas reseñas. Comparte el link de Google Maps con cada cliente antes del check-out.' })

  recs.push({ type: 'warn', text: 'Asegúrate de tener fotos profesionales actualizadas (habitaciones, fachada, desayuno, áreas comunes) — mínimo 10 fotos.' })
  recs.push({ type: 'warn', text: 'Completa el horario de atención, servicios ofrecidos y descripción editorial en tu ficha de Google.' })
  return recs
}

function recsP2b(business: Business): Rec[] {
  const recs: Rec[] = []
  if (!business.website) {
    recs.push({ type: 'error', text: 'No tienes sitio web propio. Un sitio con reservas directas elimina la comisión de las OTAs (15–25%).' })
    recs.push({ type: 'warn',  text: 'Sin sitio web, Google no puede posicionarte en búsquedas directas de tu marca.' })
    return recs
  }
  recs.push({ type: 'ok', text: `Tienes sitio web: ${business.website}` })
  const perf = business.lh_performance ?? 0
  const seo  = business.lh_seo         ?? 0
  const acc  = business.lh_accessibility ?? 0
  if (perf >= 80)      recs.push({ type: 'ok',   text: `Velocidad excelente (${perf}/100).` })
  else if (perf >= 50) recs.push({ type: 'warn',  text: `Velocidad media (${perf}/100). Optimiza imágenes con WebP y activa caché del servidor.` })
  else if (perf > 0)   recs.push({ type: 'error', text: `Velocidad lenta (${perf}/100). Los usuarios abandonan sitios lentos — prioriza optimización de imágenes y hosting.` })
  if (seo >= 80)       recs.push({ type: 'ok',   text: `SEO técnico bueno (${seo}/100).` })
  else if (seo >= 50)  recs.push({ type: 'warn',  text: `SEO técnico mejorable (${seo}/100). Revisa etiquetas title, meta description y encabezados H1.` })
  else if (seo > 0)    recs.push({ type: 'error', text: `SEO técnico deficiente (${seo}/100). Agrega sitemap.xml, robots.txt y datos estructurados (JSON-LD).` })
  if (acc < 70 && acc > 0) recs.push({ type: 'warn', text: `Accesibilidad (${acc}/100). Agrega texto alternativo a imágenes y asegura contraste suficiente.` })
  recs.push({ type: 'warn', text: 'Incluye un motor de reservas directo (HotelBeds, Cloudbeds, etc.) para capturar reservas sin comisión.' })
  recs.push({ type: 'warn', text: 'Agrega un formulario de contacto con WhatsApp visible y número de teléfono en el header.' })
  return recs
}

function recsP2c(business: Business): Rec[] {
  const recs: Rec[] = []
  const rating  = business.rating ?? 0
  const reviews = business.num_reviews ?? 0
  if (rating >= 4.5 && reviews >= 50) {
    recs.push({ type: 'ok', text: `Reputación sobresaliente: ${rating} ⭐ con ${reviews} reseñas. Sigue respondiendo para mostrar compromiso.` })
  } else if (rating >= 4.0) {
    recs.push({ type: 'ok',   text: `Buena reputación (${rating} ⭐). Aspira a superar 4.5 respondiendo a cada comentario.` })
    recs.push({ type: 'warn', text: 'Las reseñas de los últimos 90 días tienen más peso en el algoritmo de Google. Mantén un flujo constante.' })
  } else if (rating >= 3.5) {
    recs.push({ type: 'warn', text: `Calificación media (${rating} ⭐). Identifica los problemas más mencionados y corrígelos operativamente.` })
    recs.push({ type: 'warn', text: 'Responde reseñas negativas con soluciones concretas — mejora tu imagen pública.' })
  } else {
    recs.push({ type: 'error', text: `Calificación crítica (${rating} ⭐). Requiere atención urgente: revisa las quejas más frecuentes y comunica mejoras.` })
  }
  if (reviews < 20)      recs.push({ type: 'error', text: 'Muy pocas reseñas — aumenta el volumen con mensajes de seguimiento post-estadía.' })
  else if (reviews < 50) recs.push({ type: 'warn',  text: `${reviews} reseñas. Implementa un proceso sistemático: QR en habitaciones, tarjeta en el check-out, mensaje por WhatsApp.` })
  recs.push({ type: 'warn', text: 'Establece alertas (Google Alerts o ReviewTrackers) para recibir notificaciones de nuevas reseñas en tiempo real.' })
  return recs
}

// ── P2d: Social per-platform tips ────────────────────────────────────────────

type SocialPlatform = {
  key: string
  label: string
  color: string
  icon: React.ReactNode
  tipsPresente: string[]
  tipAusente: string
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: 'instagram_url', label: 'Instagram', color: 'text-pink-600',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    tipsPresente: [
      'Publica al menos 3 veces por semana: Reels cortos de 15–30 s generan el mayor alcance orgánico.',
      'Usa entre 5 y 10 hashtags de nicho (#hostalchile #viajeroschile) más 2–3 locales (#santiagochile).',
      'Comparte Stories diarias: encuestas, preguntas y countdowns generan interacción sin esfuerzo extra.',
      'Agrega el link de reserva directa en la bio y usa el botón "Reservar" de Instagram Business.',
      'Responde cada comentario y mensaje directo en menos de 2 horas para mejorar el ranking del algoritmo.',
    ],
    tipAusente: 'No tienes Instagram. Es la red con mayor impacto visual para turismo y hospitalidad — crea una cuenta Business y comienza con 3 fotos por semana.',
  },
  {
    key: 'facebook_url', label: 'Facebook', color: 'text-blue-600',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    tipsPresente: [
      'Mantén la sección "Servicios" actualizada — aparece en búsquedas de Facebook.',
      'Crea eventos para temporada alta, promociones o actividades especiales.',
      'Activa el botón "Reservar ahora" con tu motor de reservas o número de WhatsApp.',
      'Publica reseñas destacadas de Google o TripAdvisor como posts de imagen — generan confianza.',
      'Responde en Facebook Messenger: muchos viajeros prefieren escribir por allí antes de reservar.',
    ],
    tipAusente: 'No tienes Página de Facebook. Muchos viajeros mayores de 35 años buscan y contactan negocios directamente en Facebook — créala gratis.',
  },
  {
    key: 'tiktok_url', label: 'TikTok', color: 'text-gray-800',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1-.13z" />
      </svg>
    ),
    tipsPresente: [
      'Publica tours rápidos de habitaciones y áreas comunes — tienen altísima retención en TikTok.',
      'Muestra el "día en el hostal/hotel": desayuno, vista, actividades — el formato "behind the scenes" funciona muy bien.',
      'Usa trends de audio populares para que el algoritmo amplifique el alcance.',
      'Responde comentarios con videos cortos para multiplicar el engagement.',
    ],
    tipAusente: 'TikTok es la plataforma de mayor crecimiento para turismo entre viajeros 18–35 años. Un tour de 30 segundos de tus instalaciones puede generar miles de vistas sin inversión.',
  },
  {
    key: 'youtube_url', label: 'YouTube', color: 'text-red-600',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.5 2.8 12 2.8 12 2.8s-4.5 0-6.8.2C4.6 3 3.3 3 2.2 4.2 1.3 5 1 7 1 7S.7 9.3.7 11.6v2.1C.7 16 1 18.3 1 18.3s.3 2 1.2 2.8C3.3 22.3 4.8 22.2 5.5 22.3c2.2.2 9.5.3 9.5.3s4.5 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8S26 16 26 13.7v-2.1C23.3 9.3 23 7 23 7zM9.7 15.5V8.8l8.1 3.4-8.1 3.3z"/>
      </svg>
    ),
    tipsPresente: [
      'Sube un video tour completo del alojamiento (3–5 min) — es el contenido más buscado antes de reservar.',
      'Crea una lista de reproducción "Qué ver en [ciudad]" para capturar turistas en fase de planificación.',
      'Optimiza títulos con keywords: "Hotel en [ciudad] Chile | Tour completo 2025".',
      'Incrusta los videos en tu sitio web para mejorar el tiempo de permanencia y SEO.',
    ],
    tipAusente: 'YouTube es el segundo buscador más usado en el mundo. Un video tour de tu alojamiento posiciona en búsquedas de viajes y genera confianza antes de reservar.',
  },
  {
    key: 'tripadvisor_url', label: 'TripAdvisor', color: 'text-emerald-600',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6.5" cy="12" r="3.5" />
        <circle cx="17.5" cy="12" r="3.5" />
        <path d="M12 7C9.2 7 6.7 8.1 5 10H2l2 2a6.5 6.5 0 0010 0l2-2h-3C11.3 8.1 8.8 7 12 7z" />
      </svg>
    ),
    tipsPresente: [
      'Responde el 100 % de las reseñas — TripAdvisor premia a quienes responden con mayor visibilidad.',
      'Activa el "Widget de opiniones" de TripAdvisor en tu sitio web para mostrar tu puntuación.',
      'Solicita el Certificado de Excelencia una vez que superes 4.0 y al menos 20 reseñas.',
    ],
    tipAusente: 'TripAdvisor es la plataforma líder de reseñas de viaje en español. Regístrate gratis y comienza a recopilar opiniones desde el primer día.',
  },
]

function recsP2d(socialData: Record<string, string | null>) {
  return SOCIAL_PLATFORMS.map(p => ({ platform: p, presente: !!socialData[p.key] }))
}

function recsP2e(report: Report): Rec[] {
  const recs: Rec[] = []
  const datos = (report.modulo_p2e?.datos ?? {}) as Record<string, unknown>
  const googleAi   = datos.google_ai_overview   as boolean | undefined
  const perplexity = datos.perplexity_mentioned as boolean | undefined
  const structured = datos.has_structured_data   as boolean | undefined
  const guides     = datos.travel_guides_count   as number  | undefined
  if (googleAi)  recs.push({ type: 'ok',   text: 'Tu negocio aparece en el AI Overview de Google — máxima visibilidad en búsquedas.' })
  else           recs.push({ type: 'error', text: 'No apareces en el AI Overview de Google. Publica contenido de autoridad en tu sitio (blog de viajes, guías locales) y obtén menciones en directorios relevantes.' })
  if (perplexity) recs.push({ type: 'ok',  text: 'Tu negocio es mencionado por Perplexity AI.' })
  else            recs.push({ type: 'warn', text: 'No apareces en Perplexity AI. Regístrate en directorios de autoridad: TripAdvisor, Sernatur, Lonely Planet, Booking y similares.' })
  if (structured) recs.push({ type: 'ok',  text: 'Tu sitio web tiene datos estructurados (JSON-LD) — ayuda a los motores de IA a entender tu negocio.' })
  else            recs.push({ type: 'error', text: 'Tu sitio web no tiene datos estructurados (JSON-LD). Agrega Schema.org para Lodging/Hotel: nombre, dirección, calificación, precio.' })
  if (guides && guides > 0) recs.push({ type: 'ok',   text: `Mencionado en ${guides} guía${guides > 1 ? 's' : ''} de autoridad — excelente para SEO y visibilidad en IA.` })
  else                      recs.push({ type: 'warn', text: 'No se detectaron menciones en guías de viaje de autoridad. Contacta a bloggers de viaje y plataformas como Lonely Planet o Sernatur.' })
  recs.push({ type: 'warn', text: 'Crea contenido propio sobre actividades en tu zona ("Qué hacer en [ciudad]") — las IAs citan páginas con contenido de valor local.' })
  return recs
}

function recsP2f(platformData: Record<string, string | null>): Rec[] {
  const recs: Rec[] = []
  const platforms = [
    { url: 'booking_url',     name: 'Booking.com', rating: 'booking_rating',     reviews: 'booking_reviews' },
    { url: 'airbnb_url',      name: 'Airbnb',       rating: 'airbnb_rating',      reviews: 'airbnb_reviews' },
    { url: 'tripadvisor_url', name: 'TripAdvisor',  rating: 'tripadvisor_rating', reviews: 'tripadvisor_reviews' },
    { url: 'expedia_url',     name: 'Expedia',      rating: 'expedia_rating',     reviews: 'expedia_reviews' },
    { url: 'despegar_url',    name: 'Despegar',     rating: 'despegar_rating',    reviews: 'despegar_reviews' },
  ]
  const present = platforms.filter(p => !!platformData[p.url])
  const missing = platforms.filter(p => !platformData[p.url])
  if (present.length === 0) recs.push({ type: 'error', text: 'No tienes presencia en ninguna OTA. Booking.com y Airbnb son prioritarios — llegan a millones de viajeros.' })
  else                      recs.push({ type: 'ok',   text: `Presencia en ${present.length} plataforma${present.length > 1 ? 's' : ''}: ${present.map(p => p.name).join(', ')}.` })
  present.forEach(p => {
    const rating  = parseFloat(platformData[p.rating] ?? '0') || 0
    const reviews = parseInt(platformData[p.reviews]  ?? '0') || 0
    if (rating > 0 && rating < 8.0) recs.push({ type: 'warn', text: `${p.name}: calificación de ${rating}/10 — responde a reseñas negativas y actualiza fotos y descripción.` })
    else if (rating >= 8.0)         recs.push({ type: 'ok',   text: `${p.name}: excelente puntuación (${rating}/10) con ${reviews} reseñas.` })
  })
  missing.forEach(p => recs.push({ type: 'warn', text: `No estás en ${p.name}. Considera registrarte para ampliar tu alcance.` }))
  recs.push({ type: 'warn', text: 'Mantén precios, fotos y descripción consistentes en todas las plataformas — la inconsistencia genera desconfianza.' })
  recs.push({ type: 'warn', text: 'Activa el programa de "Propiedad favorita" o "Superhost" en cada plataforma para aumentar la visibilidad orgánica.' })
  return recs
}

// ── Module card (controlled open state) ──────────────────────────────────────

interface ModuleCardProps {
  index:    number
  code:     string
  label:    string
  desc:     string
  max:      number
  score:    number
  nota:     string | null
  open:     boolean
  onToggle: () => void
  children: React.ReactNode
}

function ModuleCard({ index, code, label, desc, max, score, nota, open, onToggle, children }: ModuleCardProps) {
  const pct = Math.min(1, score / max)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-700"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 hover:bg-gray-50/60 transition-colors dark:hover:bg-gray-800/60"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeBg(pct)} ${scoreColor(pct)}`}>
                {code}
              </span>
              <span className="text-base font-semibold text-gray-800 dark:text-gray-100">{label}</span>
              <span className="text-sm text-gray-400 dark:text-gray-500 hidden sm:inline">{desc}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ delay: index * 0.05 + 0.15, duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${barColor(pct)}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xl font-bold tabular-nums ${scoreColor(pct)}`}>
              {score}<span className="text-gray-300 dark:text-gray-600 font-normal text-sm">/{max}</span>
            </span>
            {open
              ? <ChevronUp   className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            }
          </div>
        </div>
        {nota && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3 pr-8">{nota}</p>
        )}
      </button>

      {/* Recommendations */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-4 mb-3">
                Recomendaciones
              </p>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── CTA footer (identical to ModuloSitioWeb) ─────────────────────────────────

function CtaFooter({ business, slug, pricingNuevo, pricingOptimizar }: {
  business:          Business
  slug:              string
  pricingNuevo?:     CountryPricing | null
  pricingOptimizar?: CountryPricing | null
}) {
  const tieneWeb = !!business.website
  const action   = business.lh_action

  const ctaPrimary = !tieneWeb || action === 'reemplazar'
    ? { label: pricingNuevo
        ? `${!tieneWeb ? 'Crear' : 'Reemplazar'} mi sitio — ${pricingNuevo.price_display}`
        : (!tieneWeb ? 'Crear mi sitio web' : 'Reemplazar mi sitio') }
    : action === 'optimizar'
    ? { label: pricingOptimizar
        ? `Optimizar mi sitio — ${pricingOptimizar.price_display}`
        : 'Optimizar mi sitio' }
    : { label: pricingNuevo
        ? `Crear sitio web — ${pricingNuevo.price_display}`
        : 'Crear sitio web Innovando' }

  const ctaSecondary =
    action === 'reemplazar' && pricingOptimizar
      ? { label: `Solo optimizar — ${pricingOptimizar.price_display}` }
      : action === 'optimizar' && pricingNuevo
      ? { label: `Crear sitio nuevo — ${pricingNuevo.price_display}` }
      : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          ¿Listo para mejorar?
        </p>
        <p className="text-lg font-bold text-white leading-tight">
          Convierte estas recomendaciones en resultados
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2">
        {/* Primary CTA */}
        <a
          href="https://innovando.cl/contacto"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          {ctaPrimary.label}
          <ChevronRight className="w-4 h-4" />
        </a>

        {/* Secondary CTA (optional) */}
        {ctaSecondary && (
          <a
            href="https://innovando.cl/contacto"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {ctaSecondary.label}
          </a>
        )}

        {/* Demo preview link */}
        <a
          href={`/${slug}/demo`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          Obtén tu sitio AHORA
        </a>

        <p className="text-xs text-center text-amber-600 font-medium mt-1">
          ⏳ La vista previa estará disponible en las próximas horas
        </p>
        <p className="text-xs text-center text-gray-400">
          Sin suscripción · pago único · entrega en horas
        </p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const MODULE_KEYS = ['P2a', 'P2b', 'P2c', 'P2d', 'P2e', 'P2f'] as const

export default function ModulosDetalle({ report, business, socialData, platformData, slug, pricingNuevo, pricingOptimizar }: Props) {
  const [openSet, setOpenSet] = useState<Set<string>>(() => new Set())

  const allOpen  = openSet.size === MODULE_KEYS.length
  const anyOpen  = openSet.size > 0

  function toggleAll() {
    if (allOpen) setOpenSet(new Set())
    else         setOpenSet(new Set(MODULE_KEYS))
  }

  function toggleOne(code: string) {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else                next.add(code)
      return next
    })
  }

  const modules = [
    { code: 'P2a', label: 'Google Maps',    desc: 'Ficha y reseñas',   max: 20, key: 'score_p2a' as const, nota: report.modulo_p2a?.nota ?? null },
    { code: 'P2b', label: 'Sitio web',      desc: 'Presencia propia',  max: 20, key: 'score_p2b' as const, nota: report.modulo_p2b?.nota ?? null },
    { code: 'P2c', label: 'Reputación',     desc: 'Calificaciones',    max: 20, key: 'score_p2c' as const, nota: report.modulo_p2c?.nota ?? null },
    { code: 'P2d', label: 'Redes sociales', desc: 'Instagram y más',   max: 15, key: 'score_p2d' as const, nota: report.modulo_p2d?.nota ?? null },
    { code: 'P2e', label: 'IA & SEO',       desc: 'Posicionamiento',   max: 5,  key: 'score_p2e' as const, nota: report.modulo_p2e?.nota ?? null },
    { code: 'P2f', label: 'Plataformas',    desc: 'Booking, Airbnb…',  max: 20, key: 'score_p2f' as const, nota: report.modulo_p2f?.nota ?? null },
  ]

  const socialAnalysis = recsP2d(socialData)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Global expand/collapse button ── */}
      <button
        onClick={toggleAll}
        className="self-start inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {allOpen
          ? <><ChevronsDownUp className="w-4 h-4 text-gray-400" /> Colapsar todo</>
          : <><ChevronsUpDown className="w-4 h-4 text-gray-400" /> Desplegar todo</>
        }
        {anyOpen && !allOpen && (
          <span className="ml-1 text-xs text-gray-400">({openSet.size}/{MODULE_KEYS.length})</span>
        )}
      </button>

      {/* ── Module cards ── */}
      {modules.map((m, i) => {
        const score = Math.min(report[m.key] as number ?? 0, m.max)
        return (
          <ModuleCard
            key={m.code}
            index={i}
            code={m.code}
            label={m.label}
            desc={m.desc}
            max={m.max}
            score={score}
            nota={m.nota}
            open={openSet.has(m.code)}
            onToggle={() => toggleOne(m.code)}
          >
            {m.code === 'P2a' && (
              <ul className="flex flex-col gap-2">
                {recsP2a(business).map((r, j) => <RecItem key={j} rec={r} />)}
              </ul>
            )}
            {m.code === 'P2b' && (
              <ul className="flex flex-col gap-2">
                {recsP2b(business).map((r, j) => <RecItem key={j} rec={r} />)}
              </ul>
            )}
            {m.code === 'P2c' && (
              <ul className="flex flex-col gap-2">
                {recsP2c(business).map((r, j) => <RecItem key={j} rec={r} />)}
              </ul>
            )}
            {m.code === 'P2d' && (
              <div className="flex flex-col gap-5">
                {socialAnalysis.map(({ platform, presente }) => (
                  <div key={platform.key}>
                    <div className={`flex items-center gap-2 mb-2 font-semibold ${platform.color}`}>
                      {platform.icon}
                      <span className="text-sm">{platform.label}</span>
                      {presente
                        ? <span className="ml-auto text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-normal dark:bg-green-900/50 dark:text-green-300 dark:border-green-800">Activo</span>
                        : <span className="ml-auto text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full font-normal dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">Sin presencia</span>
                      }
                    </div>
                    {presente ? (
                      <ul className="flex flex-col gap-1.5 pl-6">
                        {platform.tipsPresente.map((tip, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600 leading-snug">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="pl-6 text-xs text-gray-500 leading-snug">{platform.tipAusente}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {m.code === 'P2e' && (
              <ul className="flex flex-col gap-2">
                {recsP2e(report).map((r, j) => <RecItem key={j} rec={r} />)}
              </ul>
            )}
            {m.code === 'P2f' && (
              <ul className="flex flex-col gap-2">
                {recsP2f(platformData).map((r, j) => <RecItem key={j} rec={r} />)}
              </ul>
            )}
          </ModuleCard>
        )
      })}

      {/* ── CTA footer — identical to ModuloSitioWeb ── */}
      <CtaFooter
        business={business}
        slug={slug}
        pricingNuevo={pricingNuevo}
        pricingOptimizar={pricingOptimizar}
      />
    </div>
  )
}
