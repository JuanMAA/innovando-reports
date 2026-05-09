/**
 * benchmark.ts
 * Lógica de comparación para el reporte de presencia digital.
 *
 * Niveles de comparación (elegidos por relevancia comercial):
 *   L1 — General:           todos los negocios en la BD
 *   L2 — Ciudad:            mismo destino turístico
 *   L3 — Tipo similar:      misma categoría de alojamiento (toda la BD)
 *   L4 — Ciudad + Tipo:     mismo destino Y misma categoría (más granular)
 *
 * Métricas seleccionadas:
 *   · score_total       — posición competitiva global
 *   · rating            — percepción del huésped (Google Maps)
 *   · num_reviews       — volumen de reseñas (relevancia SEO + confianza)
 *   · score_p2a         — presencia en Google (ficha completa)
 *   · score_p2c         — reputación online
 *   · score_p2f         — plataformas OTA (booking, airbnb…)
 *   · lh_performance    — velocidad del sitio web
 *
 * Parámetro "tipo similar" — normalización de categoría:
 *   Se extrae la palabra clave principal del campo category y se hace
 *   búsqueda ILIKE para agrupar variantes ("Hotel boutique" ≈ "Hotel del Sur").
 */

export type BizRow = {
  score_total:   number
  score_p2a:     number
  score_p2c:     number
  score_p2f:     number
  rating:        number | null
  num_reviews:   number
  lh_performance: number | null
  category:      string | null
}

export type BenchmarkGroup = {
  label:    string          // "Hoteles en Pucón"
  sublabel: string          // "12 hospedajes comparados"
  n:        number
  avg_score:       number
  avg_rating:      number | null
  avg_reviews:     number
  avg_p2a:         number
  avg_p2c:         number
  avg_p2f:         number
  avg_lh:          number | null
  pct_score:       number   // percentil del negocio en este grupo (0–100)
  pct_rating:      number | null
}

export type BenchmarkData = {
  catKeyword:  string | null   // "hotel", "cabaña", etc. (null si no mapea)
  catLabel:    string          // "Hoteles", "Cabañas", etc.
  groups:      BenchmarkGroup[]
}

// ── Normalización de categoría ────────────────────────────────────────────────

const CAT_MAP: [string[], string, string][] = [
  // [keywords_en_category, keyword_para_query, label_plural]
  [['hotel'],                             'hotel',       'Hoteles'        ],
  [['hostal', 'hostel'],                  'hostal',      'Hostales'       ],
  [['hostería', 'hosteria'],              'hostería',    'Hosterías'      ],
  [['resort'],                            'resort',      'Resorts'        ],
  [['apart', 'aparthotel', 'apart-hotel'],'apart',      'Apart-Hoteles'  ],
  [['lodge'],                             'lodge',       'Lodges'         ],
  [['glamping'],                          'glamping',    'Glampings'      ],
  [['cabaña', 'cabana', 'cabin'],         'cabaña',      'Cabañas'        ],
  [['alojamiento', 'posada', 'residencial'], 'alojamiento', 'Alojamientos'],
  [['restaurante', 'restaurant'],         'restaurante', 'Restaurantes'   ],
  [['café', 'cafe', 'cafetería'],         'café',        'Cafeterías'     ],
  [['bar', 'pub'],                        'bar',         'Bares'          ],
  [['tour', 'excursión', 'excursion', 'turismo'], 'tour', 'Turismo/Tours' ],
  [['spa'],                               'spa',         'Spas'           ],
]

export function parseCatKeyword(category: string | null): { keyword: string; label: string } | null {
  if (!category) return null
  const lower = category.toLowerCase()
  for (const [keys, keyword, label] of CAT_MAP) {
    if (keys.some(k => lower.includes(k))) return { keyword, label }
  }
  return null
}

// ── Helpers estadísticos ──────────────────────────────────────────────────────

function avg(arr: number[]): number {
  if (!arr.length) return 0
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length * 10) / 10
}

function avgNullable(arr: (number | null)[]): number | null {
  const valid = arr.filter((v): v is number => v !== null && v !== undefined)
  if (!valid.length) return null
  return Math.round(valid.reduce((s, v) => s + v, 0) / valid.length * 10) / 10
}

/** Percentil del valor dentro del array (0 = peor, 100 = mejor) */
function percentil(value: number, arr: number[]): number {
  if (!arr.length) return 50
  const below = arr.filter(v => v < value).length
  return Math.round((below / arr.length) * 100)
}

function percentilNullable(value: number | null, arr: (number | null)[]): number | null {
  if (value === null) return null
  const valid = arr.filter((v): v is number => v !== null)
  if (!valid.length) return null
  return percentil(value, valid)
}

// ── Builder de grupos ─────────────────────────────────────────────────────────

export function buildGroup(
  label: string,
  sublabel: string,
  rows: BizRow[],
  business: BizRow,
): BenchmarkGroup {
  const n = rows.length

  const scores    = rows.map(r => r.score_total)
  const ratings   = rows.map(r => r.rating)
  const reviews   = rows.map(r => r.num_reviews)
  const p2a       = rows.map(r => r.score_p2a)
  const p2c       = rows.map(r => r.score_p2c)
  const p2f       = rows.map(r => r.score_p2f)
  const lh        = rows.map(r => r.lh_performance)

  return {
    label,
    sublabel: `${n} negocio${n !== 1 ? 's' : ''} comparado${n !== 1 ? 's' : ''}`,
    n,
    avg_score:   avg(scores),
    avg_rating:  avgNullable(ratings),
    avg_reviews: avg(reviews),
    avg_p2a:     avg(p2a),
    avg_p2c:     avg(p2c),
    avg_p2f:     avg(p2f),
    avg_lh:      avgNullable(lh),
    pct_score:   percentil(business.score_total, scores),
    pct_rating:  percentilNullable(business.rating, ratings),
  }
}
