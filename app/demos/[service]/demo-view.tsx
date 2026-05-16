'use client'

import Link from 'next/link'
import {
  ArrowLeft, AlertTriangle, Activity, ShieldCheck,
  Globe, Star, MessageCircle, Heart, Clock, Server,
  ChevronRight, ExternalLink,
} from 'lucide-react'

/* ── tipos & meta ─────────────────────────────────────────────────── */
export type DemoServiceKey =
  | 'desarrollo-web'
  | 'auditoria-sitio-web'
  | 'mantencion-sitio-web'
  | 'huella-digital'

export const DEMO_META: Record<DemoServiceKey, {
  title:    string
  subtitle: string
  isPreview: boolean
  accent:   string         // gradient classes
}> = {
  'desarrollo-web': {
    title:    'Desarrollo Web',
    subtitle: 'Sitio turístico moderno, multilenguaje y optimizado para reservas.',
    isPreview: false,
    accent:   'from-sky-500 via-teal-500 to-indigo-600',
  },
  'auditoria-sitio-web': {
    title:    'Auditoría de Sitio Web',
    subtitle: 'Diagnóstico técnico priorizado por impacto.',
    isPreview: false,
    accent:   'from-amber-500 via-orange-500 to-red-500',
  },
  'mantencion-sitio-web': {
    title:    'Mantención de Sitio Web',
    subtitle: 'Dashboard mensual con uptime, backups y mejoras continuas.',
    isPreview: false,
    accent:   'from-emerald-500 via-teal-500 to-cyan-600',
  },
  'huella-digital': {
    title:    'Auditoría Huella Digital',
    subtitle: 'Diagnóstico 360° con score y análisis de sentimientos.',
    isPreview: true,
    accent:   'from-pink-500 via-rose-500 to-orange-500',
  },
}

/* ── primitives ───────────────────────────────────────────────────── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'red' | 'amber' | 'gray' | 'emerald' }) {
  const tones = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    red:     'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    amber:   'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    gray:    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tones[tone]}`}>{children}</span>
}

/* ── componente principal ─────────────────────────────────────────── */
export default function DemoView({ demoKey, originalService }: { demoKey: DemoServiceKey; originalService: string }) {
  const meta = DEMO_META[demoKey]

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <Link
            href="https://innovando.cl"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            innovando.cl
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <img src="/logo-innovando.png" alt="Innovando" className="h-9 w-9" />
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Demo en vivo</p>
            {meta.isPreview && <Badge tone="amber">Próximamente</Badge>}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${meta.accent}`}>
              {meta.title}
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{meta.subtitle}</p>
        </div>
      </div>

      {/* Demo content */}
      <div className="mb-10">
        {demoKey === 'desarrollo-web'      && <DemoDesarrolloWeb />}
        {demoKey === 'auditoria-sitio-web' && <DemoAuditoriaSitio />}
        {demoKey === 'mantencion-sitio-web'&& <DemoMantencion />}
        {demoKey === 'huella-digital'      && <DemoHuellaDigital />}
      </div>

      {/* CTA bar */}
      <Card className="p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">¿Te interesa este servicio?</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Volvé al landing y pedí más información sin compromiso.</p>
        </div>
        <a
          href={`https://innovando.cl/es/turismo/${originalService}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 text-sm font-bold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        >
          Quiero esto para mi negocio
          <ChevronRight className="w-4 h-4" />
        </a>
      </Card>
    </div>
  )
}

/* ── DEMOS ────────────────────────────────────────────────────────── */

function DemoDesarrolloWeb() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 mx-2 rounded bg-white dark:bg-gray-900 text-xs text-gray-500 px-2 py-1 truncate">
          🔒 cabanas-queltehue.cl
        </div>
      </div>

      <div className="relative h-72 md:h-96 bg-gradient-to-br from-teal-500 via-sky-500 to-indigo-600 flex flex-col items-center justify-center text-white p-8 text-center">
        <nav className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
          <span className="font-extrabold tracking-tight">Queltehue</span>
          <div className="hidden md:flex gap-4 opacity-90">
            <span>Habitaciones</span><span>Actividades</span><span>Galería</span><span>Contacto</span>
          </div>
          <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold">ES / EN / PT</span>
        </nav>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl">Tu refugio en Chiloé</h2>
        <p className="mt-2 text-sm md:text-base opacity-90 max-w-xl">Cabañas frente al mar · Ancud, Chiloé</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button className="rounded-lg bg-white text-gray-900 px-4 py-2 text-sm font-bold shadow">Reservar</button>
          <span className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-xs font-semibold">Desde <b>$65.000 CLP</b> /noche</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
        {[
          { icon: Globe,          label: 'SEO local optimizado',     hint: 'Visible en búsquedas de tu ciudad' },
          { icon: Star,           label: 'Integración Booking · Airbnb', hint: 'Disponibilidad sincronizada' },
          { icon: MessageCircle,  label: 'WhatsApp directo',         hint: 'Click → conversación' },
        ].map((b, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 flex items-start gap-2">
            <b.icon className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold leading-tight">{b.label}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{b.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function DemoAuditoriaSitio() {
  const scores = [
    { label: 'Performance',   value: 42, color: 'bg-red-500'    },
    { label: 'SEO',           value: 71, color: 'bg-amber-500'  },
    { label: 'Accessibility', value: 86, color: 'bg-emerald-500'},
    { label: 'Best practices',value: 78, color: 'bg-amber-500'  },
  ]
  const findings: Array<{ level: 'red' | 'amber' | 'gray'; label: string; text: string }> = [
    { level: 'red',   label: 'Alto',  text: 'LCP de 4.8s en mobile — imágenes sin lazy-loading.' },
    { level: 'red',   label: 'Alto',  text: 'Falta de hreflang en versiones EN/PT.' },
    { level: 'amber', label: 'Medio', text: 'Meta description ausente en 7 páginas.' },
    { level: 'amber', label: 'Medio', text: 'CTA principal sin contraste suficiente (3.1:1).' },
    { level: 'gray',  label: 'Bajo',  text: 'Favicon en baja resolución (16x16).' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-4">
      <Card className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Métricas Lighthouse</h3>
        <div className="flex flex-col gap-3.5">
          {scores.map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-xs font-semibold w-28 truncate text-gray-700 dark:text-gray-300">{s.label}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
              </div>
              <span className="text-sm font-bold tabular-nums w-9 text-right">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-500/10 p-3 flex items-start gap-2">
          <Activity className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            <b>Resumen ejecutivo:</b> el sitio tiene buen SEO de contenido pero pierde visitantes por performance. Mejorando LCP esperamos +15-25% conversión.
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Hallazgos priorizados</h3>
        <ul className="flex flex-col gap-2.5">
          {findings.map((f, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-2.5">
              <Badge tone={f.level}>{f.label}</Badge>
              <span className="text-sm leading-snug text-gray-700 dark:text-gray-300">{f.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function DemoMantencion() {
  const events = [
    { icon: ShieldCheck,   color: 'text-emerald-500', text: 'WordPress 6.4 → 6.5 actualizado · 12 may' },
    { icon: Server,        color: 'text-emerald-500', text: 'Backup completo verificado · 11 may 03:00' },
    { icon: AlertTriangle, color: 'text-amber-500',   text: 'Pico de tráfico desde Google Ads · 8 may' },
    { icon: ShieldCheck,   color: 'text-emerald-500', text: 'Plugin Yoast SEO actualizado · 7 may' },
    { icon: Server,        color: 'text-emerald-500', text: 'Optimización imágenes (-32% peso) · 4 may' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Activity,    label: 'Disponibilidad', value: '99.98%', sub: '↑ 0.02 vs mes pasado' },
          { icon: Server,      label: 'Backups',        value: '30/30',  sub: '100% verificados'     },
          { icon: ShieldCheck, label: 'Actualizaciones',value: '14',     sub: '0 vulnerabilidades'   },
          { icon: Clock,       label: 'LCP',            value: '1.8s',   sub: '↓ 0.3s mes pasado'    },
        ].map((s, i) => (
          <Card key={i} className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <s.icon className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400">{s.label}</span>
            </div>
            <span className="text-2xl font-black tabular-nums text-gray-900 dark:text-white">{s.value}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{s.sub}</span>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Registro reciente</h3>
        <ul className="flex flex-col">
          {events.map((e, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <e.icon className={`w-4 h-4 ${e.color} shrink-0`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{e.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function DemoHuellaDigital() {
  const modules = ['Maps', 'Web', 'Reputación', 'Redes', 'IA/SEO', 'Plataformas']
  const scores = [16, 11, 17, 9, 4, 12]
  const maxes  = [20, 20, 20, 15, 5, 20]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4">
      <Card className="p-5 flex flex-col items-center text-center gap-3">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="9" stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="9" strokeLinecap="round"
              stroke="#16a34a" strokeDasharray={`${(69/100)*276} 276`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">69</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">/ 100</span>
          </div>
        </div>
        <p className="text-sm font-semibold">Score total</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Buena base en Google Maps y reputación, pero perdés visibilidad en plataformas de reserva y velocidad web.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 text-sm font-bold mt-1 hover:opacity-90"
        >
          Abrir reporte completo
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </Card>

      <Card className="p-5 flex flex-col gap-3">
        {modules.map((m, i) => {
          const pct = scores[i] / maxes[i]
          const color = pct >= 0.7 ? 'bg-emerald-500' : pct >= 0.4 ? 'bg-amber-400' : 'bg-red-400'
          return (
            <div key={m} className="flex items-center gap-3">
              <span className="text-xs font-semibold w-24 truncate text-gray-700 dark:text-gray-300">{m}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct * 100}%` }} />
              </div>
              <span className="text-xs tabular-nums w-12 text-right text-gray-500 dark:text-gray-400">{scores[i]}/{maxes[i]}</span>
            </div>
          )
        })}

        <div className="mt-3 rounded-lg border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-500/10 p-3 flex items-start gap-2">
          <Heart className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">Análisis de sentimientos</p>
            <p className="text-sm leading-relaxed mt-0.5 text-gray-700 dark:text-gray-300">
              <b>78/100</b> · positivo. Lo más mencionado: <b>limpieza, atención, vista</b>. A mejorar: <b>wifi, estacionamiento</b>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
