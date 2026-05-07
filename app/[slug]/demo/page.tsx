import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

// En producción cada negocio tiene su propio deploy de innovando-web
// con BUSINESS_SLUG configurado. Por ahora en dev apunta a localhost:3002/demo
export default async function DemoRedirectPage({ params }: PageProps) {
  const { slug } = await params
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3002'
  redirect(`${webUrl}/demo`)
}
