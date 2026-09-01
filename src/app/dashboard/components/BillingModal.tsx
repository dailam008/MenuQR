'use client'

import { useState } from 'react'
import { X, Check, Sparkles, ChevronRight, Award, ShieldCheck, Loader2, ArrowRight, Store, BarChart2, Layers } from 'lucide-react'
import Link from 'next/link'

interface BillingModalProps {
  isOpen: boolean
  onClose: () => void
  isPro: boolean
  onPlanUpdated: () => void
}

export default function BillingModal({ isOpen, onClose, isPro, onPlanUpdated }: BillingModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDevToggle, setShowDevToggle] = useState(false)

  if (!isOpen) return null

  const tierFeatures = [
    {
      title: 'Maksimal Outlet Aktif',
      free: '1 Outlet',
      pro: 'Hingga 5 Outlet'
    },
    {
      title: 'Kapasitas Item Menu',
      free: 'Maksimal 50 Item',
      pro: 'Tanpa Batas (Unlimited)'
    },
    {
      title: 'Kustomisasi Dynamic QR',
      free: 'Format Standar',
      pro: 'Kustom Warna & Desain Meja'
    },
    {
      title: 'Analitik & Pelacakan Kunjungan',
      free: 'Statistik Dasar',
      pro: 'Grafik Harian & Menu Populer'
    }
  ]

  async function handleTogglePlan(targetProStatus: boolean) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/update-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPro: targetProStatus }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui status paket akun.')
      
      onPlanUpdated()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses status akun.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(4px)', padding: 16
    }}>
      <div className="animate-fade-in card" style={{
        maxWidth: 560, width: '100%', padding: 0, overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0',
        background: 'white', borderRadius: 20, maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to right, #fff7ed, #ffffff)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={20} color="#f97316" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0 }}>
              {isPro ? 'Status Paket Layanan: PRO ⚡' : 'Informasi & Kuota Paket Layanan'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, color: '#64748b', display: 'flex', alignItems: 'center'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 20px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
              padding: '12px 14px', fontSize: 13.5, color: '#dc2626', marginBottom: 16,
              display: 'flex', gap: 8, alignItems: 'center'
            }}>
              <span>⚠️</span>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Current Status Card */}
          <div style={{
            background: isPro ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${isPro ? '#bbf7d0' : '#e2e8f0'}`,
            borderRadius: 16, padding: '16px 18px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: isPro ? '#dcfce7' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isPro ? <ShieldCheck size={24} color="#16a34a" /> : <Layers size={22} color="#64748b" />}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isPro ? '#166534' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Paket Akun Saat Ini
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: isPro ? '#15803d' : '#1e293b' }}>
                  {isPro ? 'MenuQR PRO Aktif ⚡' : 'Paket Dasar (Gratis)'}
                </div>
              </div>
            </div>

            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              background: isPro ? '#22c55e' : '#64748b', color: 'white'
            }}>
              {isPro ? 'Fitur Lengkap' : 'Tier Dasar'}
            </span>
          </div>

          {/* Comparison Table / Matrix */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Perbandingan Kapasitas & Fitur
            </div>

            <div style={{
              border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              {tierFeatures.map((f, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr',
                  padding: '10px 14px', fontSize: 12.5,
                  background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  borderBottom: idx !== tierFeatures.length - 1 ? '1px solid #f1f5f9' : 'none',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{f.title}</span>
                  <span style={{ color: '#64748b', textAlign: 'center' }}>{f.free}</span>
                  <span style={{ color: '#ea580c', fontWeight: 700, textAlign: 'right' }}>{f.pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          {!isPro ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/upgrade"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white',
                  textDecoration: 'none', padding: '13px 20px', borderRadius: 12,
                  fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                  transition: 'transform 0.15s'
                }}
              >
                <Sparkles size={16} /> Lihat Prosedur Aktivasi PRO <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '11px 16px', fontSize: 13.5 }}
              >
                Tutup
              </button>
            </div>
          )}

          {/* Research / Testing Mode Section (Clean & Academic) */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
            <button
              onClick={() => setShowDevToggle(!showDevToggle)}
              style={{
                background: 'none', border: 'none', color: '#94a3b8',
                fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              {showDevToggle ? 'Sembunyikan Opsi Pengujian Sistem' : '⚙️ Opsi Pengujian / Evaluasi Sistem (Black-box Testing)'}
            </button>

            {showDevToggle && (
              <div style={{
                marginTop: 12, padding: 12, borderRadius: 10,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                fontSize: 12, color: '#475569', textAlign: 'left'
              }}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>
                  Simulasi Pengujian Hak Akses Akun:
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: 11.5, color: '#64748b' }}>
                  Gunakan tombol di bawah untuk menguji perubahan hak akses (Limitasi Outlet & Analitik) secara instan untuk kebutuhan pengujian fungsionalitas sistem.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleTogglePlan(!isPro)}
                    disabled={loading}
                    style={{
                      flex: 1, padding: '7px 12px', borderRadius: 8,
                      background: isPro ? '#fef2f2' : '#f0fdf4',
                      border: `1px solid ${isPro ? '#fca5a5' : '#86efac'}`,
                      color: isPro ? '#dc2626' : '#16a34a',
                      fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    {loading && <Loader2 className="animate-spin" size={12} />}
                    {isPro ? 'Ubah ke Mode Akun Gratis (Free Tier)' : 'Aktifkan Mode Akun PRO (Pro Tier)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

