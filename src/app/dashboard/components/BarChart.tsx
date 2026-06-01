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

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px`, display: 'flex', flexDirection: 'column' }}>
      
      {/* Chart Area */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 4px', zIndex: 1 }}>
        
        {/* Grid lines (Background) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ borderBottom: '1px solid #f3f4f6', width: '100%', height: '25%' }} />
          ))}
        </div>

        {/* Bars */}
        {data.map((d) => {
          const barHeightPercent = (d.value / maxVal) * 100
          
          return (
            <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
              {/* Value Label */}
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', opacity: d.value > 0 ? 1 : 0 }}>
                {d.value}
              </div>
              
              {/* Bar */}
              <div 
                style={{ 
                  width: '60%', 
                  maxWidth: '32px',
                  height: `calc(${barHeightPercent}% - 20px)`, // Leave space for number
                  minHeight: d.value > 0 ? '4px' : '0px',
                  backgroundColor: color, 
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.85
                }} 
              />
            </div>
          )
        })}
      </div>

      {/* X-Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0 4px', borderTop: '1px solid #e5e7eb', marginTop: '2px' }}>
        {data.map(d => (
          <div key={d.label} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
