import Link from 'next/link'
import {
  ArrowLeft, AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Eye,
  Mail, MapPin, Camera, Globe, Lock, Search, Users, FileWarning,
  ChevronRight, ExternalLink, Heart, Clock,
} from 'lucide-react'

export const metadata = {
  title:       'Auditoría Huella Digital — Demo · Innovando',
  description: 'Informe completo de auditoría de huella digital. Ejemplo con datos ficticios.',
}

/* ─────────────────────────────────────────────────────────────
   DATOS FICTICIOS — Marcelo Pérez (Persona)
   ───────────────────────────────────────────────────────────── */

const DEMO = {
  type:       'Persona Natural' as 'Persona Natural' | 'Empresa',
  subject:    'Marcelo Pérez Salinas',
  email_main: 'marcelo.perez@gmail.com',
  country:    'Chile',
  industry:   'Profesional independiente · Consultor de marketing',
  audited_at: '2026-05-15',
  scan_scope: 'Búsquedas en Google · 12 plataformas sociales · 4 bases de filtraciones · Whois público',
  exposure_score:    62,  // 0-100 (más alto = más expuesto = peor)
  privacy_score:     54,  // 0-100 (más alto = más privacidad)
  risk_level:        'medio' as 'bajo' | 'medio' | 'alto',
  summary:
    'Tu huella digital es **moderada-alta** principalmente por filtraciones históricas en LinkedIn y Dropbox, fotos públicas con metadatos GPS, y tu lista de amigos visible en Facebook. Las 3 acciones prioritarias se resuelven en menos de 1 hora y reducen tu exposición un 40%.',
  breaches: [
    { source: 'LinkedIn',   date: '2021-06', data: 'email · nombre · teléfono · cargo profesional', severity: 'alta', verified: true },
    { source: 'Dropbox',    date: '2016-08', data: 'email · hash de contraseña (bcrypt)',           severity: 'media', verified: true },
    { source: 'Canva',      date: '2019-05', data: 'email · nombre · país · ciudad',                severity: 'media', verified: true },
    { source: 'MyFitnessPal', date: '2018-02', data: 'email · username · IP',                       severity: 'baja',  verified: true },
  ],
  metadata_findings: [
    { file: 'foto_perfil_2024.jpg',  location: 'Las Condes, Santiago', device: 'iPhone 13 Pro',     date: '2024-03-12', issue: 'GPS exacto + modelo de dispositivo' },
    { file: 'curriculum-mp.pdf',     location: 'Las Condes, Santiago', device: 'MacBook Pro 16"',   date: '2024-01-08', issue: 'Autor real + nombre de equipo' },
    { file: 'casa_lago_2023.jpg',    location: 'Llanquihue, X Región', device: 'Samsung S22',       date: '2023-12-25', issue: 'Foto vacacional con GPS de domicilio secundario' },
    { file: 'reunion-clientes.png',  location: 'Providencia, Santiago',device: 'iPhone 13 Pro',     date: '2024-02-20', issue: 'Captura con metadatos de software' },
  ],
  social_privacy: [
    { network: 'Instagram',  visibility: 'Público',  alert: true,  notes: '8.4k seguidores · stories archivadas visibles · email en bio' },
    { network: 'Facebook',   visibility: 'Público',  alert: true,  notes: 'Lista de amigos visible · cumpleaños público · check-ins históricos' },
    { network: 'LinkedIn',   visibility: 'Público',  alert: false, notes: 'Perfil completo apropiado para uso profesional' },
    { network: 'X/Twitter',  visibility: 'Público',  alert: false, notes: 'Sin información sensible' },
    { network: 'TikTok',     visibility: 'Privado',  alert: false, notes: 'Cuenta privada · sin riesgos detectados' },
    { network: 'YouTube',    visibility: 'Público',  alert: true,  notes: 'Comentarios antiguos en política y temas sensibles' },
    { network: 'Reddit',     visibility: 'Público',  alert: true,  notes: 'Cuenta vinculada al email expuesto · historial visible' },
    { network: 'GitHub',     visibility: 'Público',  alert: false, notes: 'Apropiado para portafolio técnico' },
  ],
  public_search: [
    { url: 'directorios.cl/profesionales/marcelo-perez',  type: 'Directorio comercial', risk: 'medio', text: 'Teléfono + dirección laboral · email · LinkedIn enlazado' },
    { url: 'google.com/maps · contributions',             type: 'Reseñas de Google',    risk: 'bajo',  text: '47 reseñas con foto y nombre real desde 2018' },
    { url: 'archive.org/details/blog-marcelo',            type: 'Wayback Machine',      risk: 'medio', text: 'Blog personal eliminado en 2019 todavía accesible con opiniones políticas' },
    { url: 'truecaller / similares (data brokers)',       type: 'Data brokers',         risk: 'alto',  text: 'Número telefónico + nombre completo + ubicación aproximada' },
    { url: 'github.com/marceloperez · commits',            type: 'GitHub público',       risk: 'bajo',  text: 'Email expuesto en commits antiguos (puede limpiarse)' },
  ],
  domains: [
    { kind: 'WHOIS',  detail: 'Dominio marceloperez.cl con datos personales públicos (nombre + email + dirección).', risk: 'alto' },
    { kind: 'DNS/SSL',detail: 'Certificado SSL emitido a nombre completo — visible en CT logs (Certificate Transparency).', risk: 'medio' },
  ],
  recommendations: [
    { phase: 'Rápidas (< 1 hora)', items: [
      'Activar 2FA en Gmail, LinkedIn, Dropbox y Canva (urgente por filtraciones).',
      'Cambiar contraseña de las 4 cuentas filtradas — usá un gestor (1Password, Bitwarden).',
      'Hacer "Privado" tu Facebook (lista de amigos, posts antiguos, check-ins).',
      'Eliminar email de la bio pública de Instagram.',
    ]},
    { phase: 'Esta semana', items: [
      'Eliminar metadatos GPS de fotos antes de subirlas (Mac: Preview → Tools → Show Inspector → Remove).',
      'Renovar dominio marceloperez.cl con "WHOIS privacy" o "WHOIS guard".',
      'Solicitar la baja de tu perfil en directorios comerciales y data brokers (Truecaller, etc.).',
      'Revisar comentarios públicos en YouTube y Reddit — eliminar los sensibles.',
    ]},
    { phase: 'Este mes', items: [
      'Pedir a Archive.org la baja del blog antiguo (formulario "Remove from Wayback").',
      'Limpiar commits viejos de GitHub con email expuesto (git filter-repo o BFG).',
      'Suscribirte a un servicio de monitoreo de filtraciones (HaveIBeenPwned + alertas).',
      'Considerar un alias de email para registros públicos (SimpleLogin, Apple Hide My Email).',
    ]},
  ],
}

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

function riskTone(level: string) {
  const l = level === 'alta' ? 'alto' : level === 'media' ? 'medio' : level === 'baja' ? 'bajo' : level
  if (l === 'alto')  return { bg: 'bg-red-100',   text: 'text-red-700',   dot: 'bg-red-500',    label: 'Alto'  }
  if (l === 'medio') return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500',  label: 'Medio' }
  return                    { bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400',   label: 'Bajo'  }
}

function exposureColor(score: number) {
  // Más alto = más expuesto = más rojo
  if (score >= 70) return { stroke: '#f87171', text: 'text-red-600',    label: 'Alta exposición' }
  if (score >= 40) return { stroke: '#fbbf24', text: 'text-amber-600',  label: 'Exposición moderada' }
  return                 { stroke: '#10b981', text: 'text-emerald-600',label: 'Baja exposición' }
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function DemoHuellaDigitalPage() {
  const expColors = exposureColor(DEMO.exposure_score)
  const alertedSocial = DEMO.social_privacy.filter(s => s.alert).length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">

          <Link href="https://innovando.cl" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            innovando.cl
          </Link>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <img src="/logo-innovando.png" alt="Innovando" className="h-10 w-10" />
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-violet-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Auditoría Huella Digital</p>
            </div>
            <span className="ml-auto inline-flex items-center rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Demo · datos ficticios
            </span>
          </div>

          {/* Subject + score */}
          <div className="flex items-end justify-between gap-5 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{DEMO.type}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">{DEMO.subject}</h1>
              <p className="text-sm text-gray-500 mt-1">{DEMO.industry} · {DEMO.country}</p>
              <p className="text-xs text-gray-400 mt-2">Auditado el {DEMO.audited_at}</p>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Nivel de exposición</span>
              <div className="relative w-32 h-32 mt-1">
                <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="9" stroke="currentColor" className="text-gray-100" />
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="9" strokeLinecap="round"
                    stroke={expColors.stroke}
                    strokeDasharray={`${(DEMO.exposure_score/100)*276} 276`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black tabular-nums leading-none ${expColors.text}`}>{DEMO.exposure_score}</span>
                  <span className="text-[10px] text-gray-400">/ 100</span>
                </div>
              </div>
              <p className={`text-xs font-medium ${expColors.text} mt-1`}>{expColors.label}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── Resumen ejecutivo ───────────────────────────── */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Resumen ejecutivo</p>
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {DEMO.summary}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <p className="text-[10px] uppercase tracking-widest text-red-700 mb-1">Filtraciones</p>
              <p className="text-xl font-black tabular-nums text-red-700">{DEMO.breaches.length}</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <p className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Archivos con metadatos</p>
              <p className="text-xl font-black tabular-nums text-amber-700">{DEMO.metadata_findings.length}</p>
            </div>
            <div className="rounded-lg bg-orange-50 border border-orange-100 p-3">
              <p className="text-[10px] uppercase tracking-widest text-orange-700 mb-1">Redes con alerta</p>
              <p className="text-xl font-black tabular-nums text-orange-700">{alertedSocial}/{DEMO.social_privacy.length}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
              <p className="text-[10px] uppercase tracking-widest text-emerald-700 mb-1">Privacidad</p>
              <p className="text-xl font-black tabular-nums text-emerald-700">{DEMO.privacy_score}/100</p>
            </div>
          </div>
        </section>

        {/* ── Brechas de seguridad ───────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Brechas de seguridad</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-red-50">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-800">
                <span className="font-bold">{DEMO.email_main}</span> aparece en <span className="font-bold">{DEMO.breaches.length} filtraciones</span> verificadas.
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {DEMO.breaches.map((b, i) => {
                const tone = riskTone(b.severity)
                return (
                  <li key={i} className="px-5 py-4 flex items-start gap-4">
                    <span className={`shrink-0 inline-flex h-6 items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-widest ${tone.bg} ${tone.text}`}>
                      {tone.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{b.source} <span className="text-xs font-normal text-gray-400">· {b.date}</span></p>
                      <p className="text-xs text-gray-600 mt-1">Datos expuestos: <span className="text-gray-800">{b.data}</span></p>
                    </div>
                    {b.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verificada
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ── Metadatos en archivos ──────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Metadatos en archivos públicos</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {DEMO.metadata_findings.map((m, i) => (
                <li key={i} className="px-5 py-4 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-center">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Camera className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-mono text-gray-700 truncate" title={m.file}>{m.file}</span>
                  </div>
                  <span className="text-xs text-gray-600 inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {m.location}
                  </span>
                  <span className="text-xs text-gray-500">{m.device}</span>
                  <span className="text-xs text-gray-400 tabular-nums">{m.date}</span>
                  <div className="md:col-span-4 text-xs text-amber-700 inline-flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {m.issue}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Redes sociales ─────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Configuración de privacidad en redes</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {DEMO.social_privacy.map((s, i) => (
                <li key={i} className={`px-5 py-3 flex items-center gap-4 ${s.alert ? 'bg-amber-50/40' : ''}`}>
                  <span className="font-semibold text-sm text-gray-900 w-24 shrink-0">{s.network}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shrink-0 ${
                    s.visibility === 'Público'
                      ? (s.alert ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600')
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {s.visibility}
                  </span>
                  <span className="text-xs text-gray-600 flex-1 truncate" title={s.notes}>{s.notes}</span>
                  {s.alert && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Información pública en internet ────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Información pública en internet</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {DEMO.public_search.map((r, i) => {
                const tone = riskTone(r.risk as 'alto' | 'medio' | 'bajo')
                return (
                  <li key={i} className="px-5 py-4 flex items-start gap-4">
                    <Search className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-gray-500 truncate" title={r.url}>{r.url}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">{r.type}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 leading-snug">{r.text}</p>
                    </div>
                    <span className={`shrink-0 inline-flex h-6 items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-widest ${tone.bg} ${tone.text}`}>
                      {tone.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ── Dominios y WHOIS ──────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Dominios y WHOIS</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {DEMO.domains.map((d, i) => {
                const tone = riskTone(d.risk as 'alto' | 'medio' | 'bajo')
                return (
                  <li key={i} className="px-5 py-4 flex items-start gap-4">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{d.kind}</p>
                      <p className="text-sm text-gray-700">{d.detail}</p>
                    </div>
                    <span className={`shrink-0 inline-flex h-6 items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-widest ${tone.bg} ${tone.text}`}>
                      {tone.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ── Plan de acción ─────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Plan de acción priorizado</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {DEMO.recommendations.map((p, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm font-bold text-gray-900 mb-3 inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                {p.phase}
              </p>
              <ul className="flex flex-col gap-2">
                {p.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── CTA ────────────────────────────────────────── */}
        <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-violet-900">¿Querés que limpiemos esto por vos?</p>
            <p className="text-xs text-violet-700 mt-0.5">Ofrecemos servicio de limpieza manual: solicitud de baja en directorios, eliminación de perfiles viejos y un informe final.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://innovando.cl/es/huella-digital/limpieza-huella-digital"
               className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-bold hover:bg-gray-700">
              Solicitar limpieza
              <ChevronRight className="w-4 h-4" />
            </a>
            <a href="https://innovando.cl/es/huella-digital/auditoria-huella-digital"
               className="inline-flex items-center gap-1.5 rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">
              Pedir otra auditoría
            </a>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="border-t border-gray-200 pt-6 mt-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-500">Aviso:</span> Este es un informe de demostración con datos ficticios. Los informes reales se generan a partir de fuentes públicas y bases de filtraciones (HaveIBeenPwned, etc.) tras una conversación inicial.
          </p>
          <a href="https://innovando.cl" className="text-xs text-gray-400 hover:text-gray-600">innovando.cl</a>
        </footer>

      </main>
    </div>
  )
}
