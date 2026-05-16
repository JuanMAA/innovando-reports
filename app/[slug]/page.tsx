import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Business } from '@/types'

export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Índice de informes del negocio.
 * Por ahora hay un solo informe (presencia-digital), así que redirige directo.
 * En el futuro: aquí va el listado de informes generados para el slug.
 */
export default async function BusinessIndexPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, slug')
    .eq('slug', slug)
    .maybeSingle<Business>()

  if (!business) notFound()

  // Único informe disponible → redirect.
  redirect(`/${slug}/presencia-digital`)
}
