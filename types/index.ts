export type BusinessStatus =
  | 'new'
  | 'analyzed'
  | 'contacted'
  | 'follow_up_1'
  | 'follow_up_2'
  | 'follow_up_3'
  | 'report_paid'
  | 'huella_paid'
  | 'tutorial_paid'
  | 'site_active'
  | 'renewal_pending'
  | 'renewed'
  | 'lost'
  | 'closed_permanently'

export type IssueStatus = 'pending' | 'reviewed' | 'resolved' | 'ignored'
export type IssueType = 'wrong_profile' | 'incorrect_link' | 'outdated_info'

export interface Business {
  id: string
  place_id: string
  slug: string
  name: string
  category: string | null
  city: string | null
  country: string
  address: string | null
  phone: string | null
  email: string | null
  email_source: string | null
  whatsapp: string | null
  whatsapp_source: string | null
  website: string | null
  needs_review: boolean
  missing_fields: string[] | null
  score_p2a: number
  score_p2b: number
  score_p2c: number
  score_p2d: number
  score_p2e: number
  score_p2f: number
  score_total: number
  rating: number | null
  num_reviews: number
  status: BusinessStatus
  plan: string | null
  has_reported_issue: boolean
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  latest_report_id: string | null
  lh_performance: number | null
  lh_seo: number | null
  lh_accessibility: number | null
  lh_best_practices: number | null
  lh_lcp_ms: number | null
  lh_action: string | null
  scraped_at: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  business_id: string
  type: string
  generated_at: string
  score_total: number
  score_p2a: number
  score_p2b: number
  score_p2c: number
  score_p2d: number
  score_p2e: number
  score_p2f: number
  general_note: string | null
  general_note_edited: boolean
  modulo_p2a: ModuloData | null
  modulo_p2b: ModuloData | null
  modulo_p2c: ModuloData | null
  modulo_p2d: ModuloData | null
  modulo_p2e: ModuloData | null
  modulo_p2f: ModuloData | null
  modulo_sentimientos: SentimientosData | null
  is_public: boolean
  version: number
}

export interface SentimientosTema {
  tema:      string
  menciones: number
  sample?:   string | null
}

export interface SentimientosResena {
  autor:        string
  rating:       number
  fecha:        string          // ISO o "hace 3 meses"
  texto:        string
  sentimiento:  'positivo' | 'neutro' | 'negativo'
  plataforma:   string          // 'google' | 'booking' | 'airbnb' | 'tripadvisor' | etc.
}

export interface SentimientosPalabra {
  palabra:     string
  peso:        number            // 0-100, controla tamaño en el cloud
  sentimiento: 'pos' | 'neu' | 'neg'
}

export interface SentimientosEvolucion {
  mes:   string                  // 'ene', 'feb', ... o '2026-01'
  score: number                  // 0-100
}

export interface SentimientosData {
  total_resenas:      number
  resenas_analizadas: number
  sentiment_score:    number             // 0-100
  positivas_pct:      number
  neutras_pct:        number
  negativas_pct:      number
  resumen:            string
  temas_positivos:    SentimientosTema[]
  temas_negativos:    SentimientosTema[]
  resenas_destacadas: SentimientosResena[]
  palabras_clave:     SentimientosPalabra[]
  evolucion?:         SentimientosEvolucion[] | null
  generated_at?:      string
}

export interface ModuloData {
  score: number
  nota: string | null
  nota_editada: boolean
  datos: Record<string, unknown>
}

export interface CountryPricing {
  id: string
  country: string
  category: string
  service: string
  price: number
  currency: string
  price_display: string
  active: boolean
}

export interface IssueReport {
  id: string
  business_id: string
  report_id: string | null
  type: IssueType
  detalle: string | null
  status: IssueStatus
  internal_note: string | null
  action_taken: string | null
  reported_at: string
  resolved_at: string | null
}
