import { permanentRedirect } from 'next/navigation'

// Compat con la URL antigua. El demo del informe vive ahora en /demo/presencia-digital.
export default function DemoRedirect() {
  permanentRedirect('/demo/presencia-digital')
}
