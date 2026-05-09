'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

interface Props {
  className?: string
}

export default function ThemeToggle({ className = '' }: Props) {
  const [dark,    setDark]    = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = localStorage.getItem('theme') === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  // Avoid hydration mismatch
  if (!mounted) return <span className="w-7 h-7" />

  return (
    <button
      onClick={toggle}
      title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors
        text-gray-400 hover:text-gray-700 hover:bg-gray-100
        dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-white/10
        ${className}`}
    >
      {dark
        ? <Sun  className="w-3.5 h-3.5" />
        : <Moon className="w-3.5 h-3.5" />
      }
    </button>
  )
}
