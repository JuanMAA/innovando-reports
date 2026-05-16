-- Análisis de sentimientos en base a reseñas
-- Sólo se popula cuando el usuario ha comprado el reporte completo.
-- Estructura del JSON esperado: SentimientosData en /types/index.ts

alter table public.reports
  add column if not exists modulo_sentimientos jsonb;

comment on column public.reports.modulo_sentimientos is
  'Análisis de sentimientos de reseñas (premium). NULL = sin comprar / sin generar. Schema: SentimientosData.';

-- Ejemplo de payload válido (para pruebas):
-- update public.reports set modulo_sentimientos = '{
--   "total_resenas": 187,
--   "resenas_analizadas": 150,
--   "sentiment_score": 78,
--   "positivas_pct": 72,
--   "neutras_pct": 18,
--   "negativas_pct": 10,
--   "resumen": "Los huéspedes destacan la limpieza, la atención del anfitrión y la vista. Las quejas más recurrentes son sobre el wifi y la falta de estacionamiento.",
--   "temas_positivos": [
--     {"tema": "Limpieza",   "menciones": 84},
--     {"tema": "Atención",   "menciones": 71},
--     {"tema": "Vista",      "menciones": 53},
--     {"tema": "Ubicación",  "menciones": 41}
--   ],
--   "temas_negativos": [
--     {"tema": "WiFi lento",         "menciones": 18},
--     {"tema": "Sin estacionamiento","menciones": 12},
--     {"tema": "Ruido nocturno",     "menciones": 6}
--   ],
--   "resenas_destacadas": [
--     {"autor": "María P.", "rating": 5, "fecha": "hace 2 meses", "plataforma": "google",
--      "sentimiento": "positivo",
--      "texto": "Lugar impecable, la anfitriona muy amable, volveremos sin duda."}
--   ],
--   "palabras_clave": [
--     {"palabra": "limpio",      "peso": 95, "sentimiento": "pos"},
--     {"palabra": "amable",      "peso": 88, "sentimiento": "pos"},
--     {"palabra": "wifi",        "peso": 45, "sentimiento": "neg"},
--     {"palabra": "tranquilo",   "peso": 60, "sentimiento": "pos"}
--   ],
--   "evolucion": [
--     {"mes": "dic", "score": 71},
--     {"mes": "ene", "score": 74},
--     {"mes": "feb", "score": 76},
--     {"mes": "mar", "score": 79},
--     {"mes": "abr", "score": 78},
--     {"mes": "may", "score": 78}
--   ]
-- }'::jsonb where id = '<report_id>';
