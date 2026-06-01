'use client'

import { useEffect, useRef, useState } from 'react'

interface DataPoint {
  label: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  color?: string
  height?: number
}

export function BarChart({ data, color = '#f97316', height = 160 }: BarChartProps) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barWidth = 100 / (data.length * 2)
  const gap = barWidth / 2

  return (
    <svg
      ref={ref}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height }}
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(fraction => (
        <line
          key={fraction}
          x1="0" y1={height - fraction * (height - 20)}
          x2="100" y2={height - fraction * (height - 20)}
          stroke="#f3f4f6" strokeWidth="0.5"
        />
      ))}

      {data.map((d, i) => {
        const barH = animated ? ((d.value / maxVal) * (height - 36)) : 0
        const x = gap + i * (barWidth + gap) * 2
        const y = height - 20 - barH

        return (
          <g key={d.label}>
            {/* Bar */}
            <rect
              x={x} y={y}
              width={barWidth} height={barH}
              rx="2" ry="2"
              fill={color}
              opacity={0.85}
              style={{
                transition: `height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s, y 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s`,
              }}
            />
            {/* Value label */}
            {d.value > 0 && (
              <text
                x={x + barWidth / 2} y={y - 3}
                textAnchor="middle"
                fontSize="4"
                fill="#6b7280"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
              >
                {d.value}
              </text>
            )}
            {/* Day label */}
            <text
              x={x + barWidth / 2} y={height - 6}
              textAnchor="middle"
              fontSize="4"
              fill="#9ca3af"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
