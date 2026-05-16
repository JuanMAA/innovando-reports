'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      window.location.href = 'https://innovando.cl'
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Página no encontrada
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <p className="text-slate-700 dark:text-slate-300">
            Serás redirigido a <span className="font-semibold text-blue-600 dark:text-blue-400">innovando.cl</span> en{' '}
            <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{countdown}</span>
            {countdown === 1 ? ' segundo' : ' segundos'}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = 'https://innovando.cl')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Ir a innovando.cl ahora
        </button>
      </div>
    </div>
  )
}
