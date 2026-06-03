'use client'

import { usePlanLimit } from '@/hooks/usePlanLimit'
import Link from 'next/link'
import { Sparkles, AlertTriangle } from 'lucide-react'

export function PlanBadge() {
  const { proUntil, loading, isPro } = usePlanLimit()

  if (loading) {
    return <div style={{ height: 42, background: '#f3f4f6', borderRadius: 10 }} className="animate-pulse" />
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!isPro) {
    return (
      <div style={{
        background: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: 12,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Plan Saat Ini</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>Gratis</span>
        </div>
        <Link href="/upgrade" style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#f97316',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          Upgrade <span style={{ transition: 'transform 0.2s' }}>→</span>
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
      border: '1px solid #fed7aa',
      borderRadius: 12,
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#ea6c0a', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={8} /> Plan Aktif
        </span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#ea6c0a' }}>⚡ Pro</span>
      </div>
      {proUntil && (
        <span style={{ fontSize: 10, color: '#c2410c', fontWeight: 600 }}>
          s/d {formatDate(proUntil)}
        </span>
      )}
    </div>
  )
}

export function PlanWarningBanner() {
  const { isPro, expiresInDays, loading } = usePlanLimit()

  if (loading || !isPro || expiresInDays === null || expiresInDays > 7) {
    return null
  }

  return (
    <div style={{
      background: '#fffbeb',
      borderBottom: '1px solid #fef3c7',
      color: '#b45309',
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '11.5px' }}>
          Plan Pro habis <strong>{expiresInDays === 0 ? 'hari ini' : `${expiresInDays} hari lagi`}</strong>.
        </span>
      </div>
      <Link href="/upgrade" style={{
        background: '#f59e0b',
        color: 'white',
        padding: '3px 8px',
        borderRadius: 6,
        fontSize: '10.5px',
        fontWeight: 700,
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }}>
        Perpanjang
      </Link>
    </div>
  )
}
