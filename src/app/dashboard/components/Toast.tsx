'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

const icons = {
  success: <CheckCircle2 size={16} color="#16a34a" />,
  error:   <XCircle     size={16} color="#dc2626" />,
  info:    <Info        size={16} color="#2563eb" />,
}

const colors = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
  error:   { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' },
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const c = colors[t.type]
        return (
          <div
            key={t.id}
            className="animate-slide-in"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: c.bg, border: `1.5px solid ${c.border}`,
              borderRadius: 12, padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              minWidth: 280, maxWidth: 360,
              pointerEvents: 'all', cursor: 'default',
            }}
          >
            {icons[t.type]}
            <span style={{ fontSize: 14, fontWeight: 600, color: c.text, flex: 1 }}>
              {t.message}
            </span>
            <button
              onClick={() => onRemove(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: c.text, opacity: 0.6 }}
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/** Hook to manage toasts */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => remove(id), 3500)
  }, [remove])

  return { toasts, toast, remove }
}
