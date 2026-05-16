import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DemoView, { type DemoServiceKey, DEMO_META } from './demo-view'

export const dynamic = 'force-static'

interface Props {
  params: Promise<{ service: string }>
}

/* ── Mapping: cualquier value localizado del landing → key canónico ── */
const SERVICE_KEY: Record<string, DemoServiceKey> = {
  'desarrollo-web':       'desarrollo-web',
  'web-development':      'desarrollo-web',
  'desenvolvimento-web':  'desarrollo-web',
  'developpement-web':    'desarrollo-web',
  'auditoria-sitio-web':  'auditoria-sitio-web',
  'website-audit':        'auditoria-sitio-web',
  'auditoria-site':       'auditoria-sitio-web',
  'audit-site-web':       'auditoria-sitio-web',
  'mantencion-sitio-web': 'mantencion-sitio-web',
  'website-maintenance':  'mantencion-sitio-web',
  'manutencao-site':      'mantencion-sitio-web',
  'maintenance-site-web': 'mantencion-sitio-web',
  'huella-digital':       'huella-digital',
  'digital-footprint':    'huella-digital',
  'pegada-digital':       'huella-digital',
  'empreinte-numerique':  'huella-digital',
}

export function generateStaticParams() {
  return Object.keys(SERVICE_KEY).map((service) => ({ service }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params
  const key = SERVICE_KEY[service]
  if (!key) return { title: 'Demo · Innovando' }
  const meta = DEMO_META[key]
  return {
    title: `${meta.title} · Demo · Innovando`,
    description: meta.subtitle,
  }
}

export default async function DemoPage({ params }: Props) {
  const { service } = await params
  const key = SERVICE_KEY[service]
  if (!key) notFound()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DemoView demoKey={key} originalService={service} />
    </div>
  )
}
