'use client'

import { Lock, Sparkles, Check, X } from 'lucide-react'
import Link from 'next/link'

interface UpgradeWallProps {
  feature: 'outlet' | 'menu_item' | 'analytics' | 'premium_qr'
  isModal?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export default function UpgradeWall({ feature, isModal = false, isOpen = true, onClose }: UpgradeWallProps) {
  if (isModal && !isOpen) return null

  const featureDesc: Record<typeof feature, string> = {
    outlet: 'Batas pembuatan outlet pada plan Gratis Anda telah tercapai. Upgrade ke Pro untuk mengelola hingga 5 outlet cabang aktif.',
    menu_item: 'Batas maksimal 50 menu item pada plan Gratis Anda telah tercapai. Upgrade ke Pro untuk menambahkan menu item sepuasnya tanpa batas.',
    analytics: 'Akses analitik lengkap statistik pengunjung, performa scan QR harian, dan item menu makanan/minuman yang paling sering dilihat pelanggan.',
    premium_qr: 'Akses template stiker QR Code (Colorful & Classic) dengan warna menarik dan frame berkualitas tinggi untuk menarik minat scan pelanggan.'
  }

  const benefits = [
    'Kelola hingga 5 outlet cabang aktif (Gratis cuma 1)',
    'Upload menu makanan & minuman tanpa batas (Gratis maks 50)',
    'Dashboard analitik kunjungan & performa menu detail',
    'Prioritas dukungan teknis langsung dari admin'
  ]

  const modalBody = (
    <div 
      className="card animate-fade-in" 
      style={{
        padding: '24px', 
        maxWidth: '480px', 
        width: '100%', 
        background: '#ffffff',
        border: '1px solid #f3f4f6', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        margin: isModal ? '0' : '20px auto',
        zIndex: 10
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {isModal && onClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, color: '#9ca3af', display: 'flex', alignItems: 'center'
          }}
        >
          <X size={20} />
        </button>
      )}

      {/* Icon Lock with premium background */}
      <div style={{
        width: 60, height: 60, borderRadius: 20,
        background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', border: '1px solid #fed7aa',
        position: 'relative'
      }}>
        <Lock size={26} color="#f97316" />
        <Sparkles size={14} color="#f97316" className="animate-pulse" style={{ position: 'absolute', top: -4, right: -4 }} />
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: 10 }}>
        Fitur ini tersedia di Paket Pro
      </h2>
      
      <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>
        {featureDesc[feature]}
      </p>

      {/* Benefits checklist */}
      <div style={{
        background: '#f8fafc', borderRadius: 16, padding: '16px',
        textAlign: 'left', marginBottom: 24, border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#ea6c0a', letterSpacing: '0.5px', marginBottom: 10, textTransform: 'uppercase' }}>
          Benefit Paket PRO:
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {benefits.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Check size={10} color="#f97316" strokeWidth={3} />
              </div>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link 
          href="/upgrade" 
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Upgrade ke Pro — Rp 18.000/bln
        </Link>
        {isModal && onClose && (
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Nanti saja
          </button>
        )}
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div 
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, backdropFilter: 'blur(4px)', padding: 16
        }}
        onClick={onClose}
      >
        {modalBody}
      </div>
    )
  }

  return modalBody
}
