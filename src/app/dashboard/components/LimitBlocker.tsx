'use client'

import { useState } from 'react'
import { AlertTriangle, Sparkles, Store, PhoneCall } from 'lucide-react'
import BillingModal from './BillingModal'

interface LimitBlockerProps {
  limitType: 'free' | 'pro'
  currentCount: number
}

export default function LimitBlocker({ limitType, currentCount }: LimitBlockerProps) {
  const [billingOpen, setBillingOpen] = useState(false)

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600, margin: '20px auto 40px' }}>
      <div className="card" style={{
        padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20, border: '2px dashed #fdba74', background: '#fffbeb'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#ffedd5',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <AlertTriangle size={32} color="#f97316" />
        </div>

        {limitType === 'free' ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#7c2d12', margin: 0 }}>
              Batas Outlet Akun Gratis Tercapai 🚨
            </h2>
            <p style={{ fontSize: 14, color: '#b45309', lineHeight: 1.6, margin: 0 }}>
              Anda saat ini menggunakan paket **Gratis** yang dibatasi hanya **1 outlet**. 
              Anda telah membuat {currentCount} outlet. Upgrade ke paket **PRO** untuk mengelola hingga **5 outlet** aktif secara bersamaan!
            </p>
            <button
              onClick={() => setBillingOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
                color: 'white', border: 'none', padding: '12px 24px',
                borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)', marginTop: 8
              }}
            >
              <Sparkles size={16} color="white" /> Buka Akses Tambah Outlet (Paket PRO)
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#7c2d12', margin: 0 }}>
              Batas Maksimal Paket PRO Tercapai 🏪
            </h2>
            <p style={{ fontSize: 14, color: '#b45309', lineHeight: 1.6, margin: 0 }}>
              Akun **PRO** Anda telah mencapai batas maksimal kuota yaitu **5 outlet aktif**.
              Silakan hubungi tim dukungan kami jika Anda memerlukan paket kustom korporasi/enterprise untuk jaringan warung yang lebih besar!
            </p>
            <a
              href="mailto:support@menuqr.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#475569', color: 'white', textDecoration: 'none',
                padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 12px rgba(71, 85, 105, 0.2)', marginTop: 8
              }}
            >
              <PhoneCall size={16} color="white" /> Hubungi Dukungan Bisnis
            </a>
          </>
        )}
      </div>

      <BillingModal
        isOpen={billingOpen}
        onClose={() => setBillingOpen(false)}
        isPro={false}
        onPlanUpdated={() => {
          window.location.reload()
        }}
      />
    </div>
  )
}
