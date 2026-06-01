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
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barWidth = 100 / (data.length * 2)
  const gap = barWidth / 2

  return (
    <svg
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
        const barH = (d.value / maxVal) * (height - 36)
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
