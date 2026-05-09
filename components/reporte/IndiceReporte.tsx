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
      {SECCIONES.map((sec, i) => {
        const isActive = active === sec.id
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="group flex items-center gap-2"
          >
            {/* Label — visible on hover or active */}
            <span className={`
              text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-200 whitespace-nowrap
              ${isActive
                ? 'opacity-100 text-gray-800 bg-white border border-gray-200 shadow-sm'
                : 'opacity-0 group-hover:opacity-100 text-gray-500 bg-white border border-gray-200 shadow-sm'
              }
            `}>
              {sec.label}
            </span>

            {/* Dot */}
            <span className={`
              rounded-full shrink-0 transition-all duration-300
              ${isActive ? 'w-2.5 h-2.5 bg-gray-800' : 'w-1.5 h-1.5 bg-gray-300 group-hover:bg-gray-500'}
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
        title={loading ? 'Preparando PDF…' : `Descargar PDF — ${nombre}`}
        className="group flex items-center gap-2 mt-1"
      >
        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-gray-500 bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
          {loading ? 'Preparando…' : 'Descargar PDF'}
        </span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 shrink-0">
          <Download className="w-3 h-3 text-white" />
        </span>
      </button>
    </div>
  )
}
