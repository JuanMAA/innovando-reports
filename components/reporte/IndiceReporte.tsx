'use client'

import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'

const SECCIONES = [
  { id: 'sec-diagnostico',  label: 'Diagnóstico'   },
  { id: 'sec-web',          label: 'Sitio web'      },
  { id: 'sec-plataformas',  label: 'Plataformas'    },
  { id: 'sec-benchmark',    label: 'Competencia'    },
  { id: 'sec-detalle',      label: 'Recomendaciones'},
]

interface Props {
  nombre: string
}

export default function IndiceReporte({ nombre }: Props) {
  const [active,  setActive]  = useState<string>(SECCIONES[0].id)
  const [loading, setLoading] = useState(false)

  // IntersectionObserver — marca la sección más visible
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECCIONES.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePrint() {
    setLoading(true)
    setTimeout(() => { window.print(); setLoading(false) }, 120)
  }

  return (
    <div className="print:hidden fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-1 hidden lg:flex">
      {SECCIONES.map((sec) => {
        const isActive = active === sec.id
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="group flex items-center gap-2"
          >
            <span className={`
              text-xs whitespace-nowrap transition-all duration-200
              ${isActive
                ? 'font-bold text-gray-900'
                : 'font-medium text-gray-400 hover:text-gray-600'
              }
            `}>
              {sec.label}
            </span>
            <span className={`
              rounded-full shrink-0 transition-all duration-300
              ${isActive ? 'w-2 h-2 bg-gray-900' : 'w-1.5 h-1.5 bg-gray-300 group-hover:bg-gray-400'}
            `} />
          </button>
        )
      })}

      {/* Línea separadora */}
      <div className="w-px h-4 bg-gray-200 ml-auto mr-[4px] mt-1" />

      {/* Botón PDF */}
      <button
        onClick={handlePrint}
        disabled={loading}
        className="group flex items-center gap-2 mt-1"
      >
        <span className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap flex items-center gap-1.5">
          <Download className="w-3 h-3" />
          {loading ? 'Preparando…' : 'PDF'}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors shrink-0" />
      </button>
    </div>
  )
}
