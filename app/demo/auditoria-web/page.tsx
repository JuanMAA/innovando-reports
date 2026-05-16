import Link from 'next/link'
import {
  ArrowLeft, AlertTriangle, CheckCircle2, Globe, Gauge, ShieldCheck,
  Search, Smartphone, FileWarning, ExternalLink, Lock, Zap,
  Clock, Image as ImageIcon, Type, Eye, FileText, ChevronRight,
} from 'lucide-react'

export const metadata = {
  title:       'Auditoría de Sitio Web — Demo · Innovando',
  description: 'Informe completo de auditoría técnica de sitio web. Ejemplo con datos ficticios.',
}

/* ─────────────────────────────────────────────────────────────
   DATOS FICTICIOS — Cabañas Queltehue, Ancud
   ───────────────────────────────────────────────────────────── */

const DEMO = {
  business:     'Cabañas Queltehue',
  url:          'https://cabanas-queltehue.cl',
  hostname:     'cabanas-queltehue.cl',
  audited_at:   '2026-05-15',
  pages_audited: 18,
  global_score: 58,    // 0-100 ponderado
  metrics: {
    performance:   42,
    seo:           71,
    accessibility: 86,
    best_practices:78,
  },
  cwv: {
    lcp:  { value: '4.8s',   status: 'poor',    target: '< 2.5s', label: 'Largest Contentful Paint' },
    fid:  { value: '180ms',  status: 'poor',    target: '< 100ms',label: 'First Input Delay' },
    cls:  { value: '0.08',   status: 'good',    target: '< 0.1',  label: 'Cumulative Layout Shift' },
    fcp:  { value: '2.1s',   status: 'needs',   target: '< 1.8s', label: 'First Contentful Paint' },
    ttfb: { value: '720ms',  status: 'needs',   target: '< 500ms',label: 'Time to First Byte' },
    tbt:  { value: '460ms',  status: 'poor',    target: '< 200ms',label: 'Total Blocking Time' },
  },
  findings: [
    { level: 'high' as const, cat: 'Performance', text: 'LCP de 4.8s en mobile causado por imágenes hero sin lazy-loading ni formato moderno.', impact: '+25% conversión' },
    { level: 'high', cat: 'Performance', text: 'Archivos JS de 1.2MB sin minificar bloquean el render por 460ms.',                       impact: '+15% retención' },
    { level: 'high', cat: 'SEO',         text: 'Falta de hreflang en versiones EN/PT — Google indexa páginas duplicadas.',               impact: '+30% tráfico orgánico' },
    { level: 'high', cat: 'Seguridad',   text: 'Sin Content-Security-Policy ni Strict-Transport-Security headers configurados.',         impact: 'Riesgo de XSS' },
    { level: 'med',  cat: 'SEO',         text: 'Meta description ausente en 7 páginas (de 18 auditadas).',                              impact: '+10% CTR' },
    { level: 'med',  cat: 'SEO',         text: 'Sitemap.xml no incluye las páginas de habitaciones individuales.',                       impact: 'Indexación parcial' },
    { level: 'med',  cat: 'A11y',        text: 'CTA principal "Reservar" con contraste 3.1:1 (requiere ≥ 4.5:1).',                       impact: 'WCAG AA' },
    { level: 'med',  cat: 'Performance', text: 'CSS no crítico cargado en el head bloquea el render inicial.',                           impact: '−0.4s FCP' },
    { level: 'low',  cat: 'A11y',        text: 'Tags <img> sin atributo `alt` en 4 imágenes decorativas.',                              impact: 'Lectores de pantalla' },
    { level: 'low',  cat: 'A11y',        text: 'Algunos formularios sin asociación explícita label/input.',                              impact: 'A11y formularios' },
    { level: 'low',  cat: 'Performance', text: 'Favicon en baja resolución (16x16). Modern browsers piden 32x32 o más.',                 impact: 'Cosmético' },
    { level: 'low',  cat: 'SEO',         text: 'No hay Schema.org markup para "LocalBusiness" — pierde rich snippets en Google.',         impact: 'Rich results' },
  ],
  seo_checks: [
    { label: 'Título único por página',         pass: true,  detail: '18/18 páginas con <title> único' },
    { label: 'Meta description presente',       pass: false, detail: '11/18 con meta description (faltan 7)' },
    { label: 'Sitemap.xml accesible',           pass: true,  detail: '/sitemap.xml responde con 200' },
    { label: 'Robots.txt configurado',          pass: true,  detail: '/robots.txt correcto, no bloquea importantes' },
    { label: 'Structured data (Schema.org)',    pass: false, detail: 'Sin LocalBusiness, Hotel ni AggregateRating' },
    { label: 'Canonicals en orden',             pass: true,  detail: 'Todas las páginas con canonical correcto' },
    { label: 'Hreflang en multilenguaje',       pass: false, detail: 'Faltante en versiones EN/PT' },
    { label: 'Open Graph para previews',        pass: true,  detail: 'og:title, og:image, og:description ok' },
  ],
  security: [
    { label: 'HTTPS forzado',                 pass: true,  detail: 'HTTP → HTTPS via 301' },
    { label: 'TLS 1.2+ con cifrado moderno',  pass: true,  detail: 'TLS 1.3 / TLS_AES_256_GCM_SHA384' },
    { label: 'Strict-Transport-Security',     pass: false, detail: 'Header HSTS no configurado' },
    { label: 'Content-Security-Policy',       pass: false, detail: 'Sin CSP — vulnerable a XSS inyectado' },
    { label: 'X-Frame-Options',               pass: true,  detail: 'SAMEORIGIN' },
    { label: 'X-Content-Type-Options',        pass: true,  detail: 'nosniff' },
    { label: 'Referrer-Policy',               pass: false, detail: 'Header no presente' },
    { label: 'Sin software desactualizado',   pass: true,  detail: 'WordPress 6.5, plugins al día' },
  ],
  plan: [
    { phase: 'Quick wins (1-2 días)',  items: [
      'Habilitar lazy-loading en imágenes (atributo `loading="lazy"`).',
      'Comprimir JS/CSS con gzip/brotli a nivel servidor.',
      'Agregar HSTS, CSP y Referrer-Policy en headers.',
      'Completar meta description en las 7 páginas faltantes.',
    ]},
    { phase: 'Mediano plazo (1-2 semanas)', items: [
      'Convertir imágenes hero a WebP/AVIF — reduce ~60% de peso.',
      'Implementar hreflang en versiones EN/PT.',
      'Agregar Schema.org `LocalBusiness` y `Hotel` con datos estructurados.',
      'Mejorar contraste en CTA principal y formularios.',
    ]},
    { phase: 'Largo plazo (1 mes+)', items: [
      'Migración a edge/CDN (Cloudflare, Vercel Edge) para reducir TTFB.',
      'Code splitting + tree shaking en bundle JS principal.',
      'Auditoría manual de UX en mobile y desktop con usuarios reales.',
    ]},
  ],
}

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

function metricColor(score: number) {
  if (score >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600' }
  if (score >= 50) return { bar: 'bg-amber-400',   text: 'text-amber-600' }
  return                 { bar: 'bg-red-400',     text: 'text-red-500' }
}

function cwvTone(status: string) {
  if (status === 'good')  return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Bueno' }
  if (status === 'needs') return { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Mejorable' }
  return                        { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Pobre' }
}

function findingTone(level: string) {
  if (level === 'high') return { label: 'Alto',  bg: 'bg-red-100',    text: 'text-red-700' }
  if (level === 'med')  return { label: 'Medio', bg: 'bg-amber-100',  text: 'text-amber-700' }
  return                        { label: 'Bajo',  bg: 'bg-gray-100',   text: 'text-gray-600' }
}

function catIcon(cat: string) {
  if (cat === 'Performance') return Zap
  if (cat === 'SEO')         return Search
  if (cat === 'A11y')        return Eye
  if (cat === 'Seguridad')   return ShieldCheck
  return FileWarning
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function DemoAuditoriaWebPage() {
  const totalCheckSeo  = DEMO.seo_checks.filter(c => c.pass).length
  const totalCheckSec  = DEMO.security.filter(c => c.pass).length
  const highCount      = DEMO.findings.filter(f => f.level === 'high').length
  const medCount       = DEMO.findings.filter(f => f.level === 'med').length
  const lowCount       = DEMO.findings.filter(f => f.level === 'low').length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">

          <Link href="https://innovando.cl" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            innovando.cl
          </Link>

          {/* Brand + título */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <img src="/logo-innovando.png" alt="Innovando" className="h-10 w-10" />
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Auditoría de Sitio Web</p>
            </div>
            <span className="ml-auto inline-flex items-center rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Demo · datos ficticios
            </span>
          </div>

          {/* Negocio + URL */}
          <div className="flex items-end justify-between gap-5 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">{DEMO.business}</h1>
              <a href={DEMO.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mt-1">
                <Globe className="w-3.5 h-3.5" />
                {DEMO.hostname}
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <p className="text-xs text-gray-500 mt-2">Auditado el {DEMO.audited_at} · {DEMO.pages_audited} páginas escaneadas</p>
            </div>

            {/* Score global */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Score global</span>
              <span className={`text-5xl font-black tabular-nums leading-none ${metricColor(DEMO.global_score).text}`}>
                {DEMO.global_score}<span className="text-lg text-gray-400 font-normal">/100</span>
              </span>
              <span className="text-xs text-amber-600 mt-1 font-medium">Mejorable — varios issues de alto impacto</span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── Resumen ejecutivo ───────────────────────────── */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Resumen ejecutivo</p>
          <p className="text-base text-gray-700 leading-relaxed">
            Tu sitio tiene una <strong>base sólida</strong> en accesibilidad ({DEMO.metrics.accessibility}/100) pero está <strong>perdiendo visitantes y reservas por performance</strong> ({DEMO.metrics.performance}/100): tiempo de carga superior a 4 segundos en mobile y bloqueo de render por JavaScript no optimizado. Hay 4 hallazgos de alto impacto, 4 medios y 4 menores. <strong>Solucionando los Quick Wins (1-2 días) esperamos una mejora de 15-25% en conversión.</strong>
          </p>
        </section>

        {/* ── Métricas Lighthouse ────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Lighthouse</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'performance',    label: 'Performance',     hint: 'Velocidad y rendimiento' },
              { key: 'seo',            label: 'SEO',             hint: 'Optimización para buscadores' },
              { key: 'accessibility',  label: 'Accesibilidad',   hint: 'WCAG y lectores de pantalla' },
              { key: 'best_practices', label: 'Buenas prácticas',hint: 'HTTPS, errores, recursos' },
            ].map(m => {
              const v = (DEMO.metrics as Record<string, number>)[m.key]
              const c = metricColor(v)
              return (
                <div key={m.key} className="flex flex-col items-center text-center gap-2">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                      <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" stroke="currentColor" className="text-gray-100" />
                      <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" strokeLinecap="round"
                        stroke={v >= 70 ? '#10b981' : v >= 50 ? '#fbbf24' : '#f87171'}
                        strokeDasharray={`${(v/100)*276} 276`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black tabular-nums ${c.text}`}>{v}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                  <p className="text-[11px] text-gray-400 leading-tight">{m.hint}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Core Web Vitals ────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Core Web Vitals</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
              {Object.entries(DEMO.cwv).map(([k, v]) => {
                const tone = cwvTone(v.status)
                return (
                  <div key={k} className="p-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{k}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.bg} ${tone.text}`}>
                        <span className={`w-1 h-1 rounded-full ${tone.dot}`} />
                        {tone.label}
                      </span>
                    </div>
                    <span className="text-2xl font-black tabular-nums text-gray-900">{v.value}</span>
                    <p className="text-[11px] text-gray-500">{v.label}</p>
                    <p className="text-[10px] text-gray-400">Objetivo {v.target}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Hallazgos priorizados ─────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Hallazgos priorizados</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Alto impacto: {highCount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medio: {medCount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Bajo: {lowCount}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {DEMO.findings.map((f, i) => {
                const tone = findingTone(f.level)
                const Icon = catIcon(f.cat)
                return (
                  <li key={i} className="flex items-start gap-4 px-5 py-4">
                    <span className={`shrink-0 inline-flex h-6 items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-widest ${tone.bg} ${tone.text}`}>
                      {tone.label}
                    </span>
                    <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{f.text}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        <span className="font-medium text-gray-500">{f.cat}</span> · estimado: <span className="font-medium text-gray-600">{f.impact}</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ── SEO técnico ────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">SEO técnico</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-bold text-gray-900">{totalCheckSeo}/{DEMO.seo_checks.length}</span> checks técnicos superados.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO.seo_checks.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  {c.pass
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Seguridad ──────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Seguridad</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-bold text-gray-900">{totalCheckSec}/{DEMO.security.length}</span> controles de seguridad superados.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO.security.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  {s.pass
                    ? <Lock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Plan de acción ─────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Plan de acción</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {DEMO.plan.map((p, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm font-bold text-gray-900 mb-3 inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
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

        {/* ── CTAs ───────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-amber-900">¿Querés que lo arreglemos por vos?</p>
            <p className="text-xs text-amber-700 mt-0.5">Cotizamos optimización completa o reemplazo del sitio según el alcance.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://innovando.cl/es/desarrollo/auditoria_web"
               className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-bold hover:bg-gray-700">
              Solicitar auditoría completa
              <ChevronRight className="w-4 h-4" />
            </a>
            <a href="https://innovando.cl/es/desarrollo/web_maintenance"
               className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">
              Plan de mantención
            </a>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="border-t border-gray-200 pt-6 mt-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <span className="font-medium text-gray-500">Aviso:</span> Este es un informe de demostración con datos ficticios. Los informes reales se generan tras una conversación inicial sin compromiso y se entregan en 3-5 días hábiles.
          </p>
          <a href="https://innovando.cl" className="text-xs text-gray-400 hover:text-gray-600">innovando.cl</a>
        </footer>

      </main>
    </div>
  )
}
