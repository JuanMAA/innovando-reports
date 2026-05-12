'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  score: number
}

function scoreColor(score: number) {
  if (score >= 70) return { stroke: '#16a34a', text: 'text-green-600', label: 'Buena presencia', bg: 'text-green-700' }
  if (score >= 40) return { stroke: '#d97706', text: 'text-amber-600', label: 'Presencia media', bg: 'text-amber-700' }
  return { stroke: '#dc2626', text: 'text-red-600', label: 'Presencia débil', bg: 'text-red-700' }
}

const SIZE = 220
const STROKE_WIDTH = 16
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreGauge({ score }: Props) {
  const { stroke, text, label } = scoreColor(score)
  const motionScore = useMotionValue(0)
  const displayScore = useTransform(motionScore, (v) => Math.round(v))
  const dashoffset = useTransform(
    motionScore,
    (v) => CIRCUMFERENCE - (v / 100) * CIRCUMFERENCE
  )

  useEffect(() => {
    const controls = animate(motionScore, score, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [score, motionScore])

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={STROKE_WIDTH}
            className="dark:stroke-gray-800"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className={`text-7xl font-bold tabular-nums leading-none ${text}`}>
            {displayScore}
          </motion.span>
          <span className="text-lg text-gray-400 font-medium mt-1 dark:text-gray-500">de 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-xl font-bold ${text}`}>{label}</p>
        <p className="text-base text-gray-500 mt-1 dark:text-gray-400">Presencia digital total</p>
      </div>
    </div>
  )
}
