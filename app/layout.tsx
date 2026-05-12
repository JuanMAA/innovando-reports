import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AccessibilityMenu from '@/components/AccessibilityMenu'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Innovando — Reporte de presencia digital',
  description: 'Tu auditoría de presencia digital personalizada.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-inter)]">
          {children}
          <AccessibilityMenu />
          <SpeedInsights />
        </body>
    </html>
  )
}
