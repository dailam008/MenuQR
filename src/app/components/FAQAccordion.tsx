'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqData } from '@/lib/faq-data'

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {faqData.map((faq, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={i}
            style={{
              background: '#ffffff',
              border: `1.5px solid ${isOpen ? '#fdba74' : '#e5e7eb'}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                background: isOpen ? '#fff7ed' : '#ffffff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gap: 12,
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: isOpen ? '#ea6c0a' : '#111827',
                lineHeight: 1.4,
              }}>
                {faq.q}
              </span>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                background: isOpen ? '#f97316' : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <ChevronDown
                  size={16}
                  color={isOpen ? '#ffffff' : '#6b7280'}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </span>
            </button>

            <div style={{
              maxHeight: isOpen ? 200 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
              <p style={{
                padding: '0 20px 18px',
                fontSize: 14, color: '#6b7280', lineHeight: 1.75,
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
