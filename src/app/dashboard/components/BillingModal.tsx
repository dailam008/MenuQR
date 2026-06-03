'use client'

import { useState } from 'react'
import { X, Check, CreditCard, Sparkles, ChevronRight, Award, ShieldCheck, Loader2 } from 'lucide-react'

interface BillingModalProps {
  isOpen: boolean
  onClose: () => void
  isPro: boolean
  onPlanUpdated: () => void
}

export default function BillingModal({ isOpen, onClose, isPro, onPlanUpdated }: BillingModalProps) {
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [expiry, setExpiry] = useState('12/28')
  const [cvc, setCvc] = useState('•••')
  const [nameOnCard, setNameOnCard] = useState('Mitra MenuQR')

  if (!isOpen) return null

  const benefits = [
    'Maksimal hingga 5 outlet aktif (Gratis cuma 1)',
    'Menu item tanpa batas per outlet (Gratis maks 50)',
    'Desain QR Code kustom premium (Warna & Frame)',
    'Analitik menu detail (scan harian, menu terfavorit)',
    'Dukungan prioritas tim teknis 24/7'
  ]

  async function handleUpgrade() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/update-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPro: true }),
      })
      if (!res.ok) throw new Error('Gagal memproses langganan.')
      
      setStep('success')
      onPlanUpdated()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses pembayaran.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDowngrade() {
    if (!confirm('Apakah Anda yakin ingin membatalkan paket PRO dan kembali ke paket Gratis? Batas outlet Anda akan dikembalikan menjadi maksimal 1.')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/update-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPro: false }),
      })
      if (!res.ok) throw new Error('Gagal membatalkan langganan.')
      
      alert('Paket Anda berhasil diturunkan ke paket Gratis.')
      onPlanUpdated()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah paket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(4px)', padding: 12
    }}>
      <div className="animate-fade-in card" style={{
        maxWidth: 550, width: '100%', padding: 0, overflow: 'hidden',
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
              {isPro ? 'Informasi Langganan Anda' : 'Upgrade ke MenuQR PRO ⚡'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, color: '#64748b', display: 'flex', alignItems: 'center'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Wrapper */}
        <div style={{ padding: '20px 16px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
              padding: '12px 14px', fontSize: 14, color: '#dc2626', marginBottom: 16,
              display: 'flex', gap: 8, alignItems: 'center'
            }}>
              <span>⚠️</span>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* STEP 1: Plan comparison */}
          {step === 'plans' && (
            <div>
              {!isPro ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 14, color: '#64748b', marginBottom: 6 }}>INVESTASI TERBAIK BISNIS ANDA</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                      Rp 49.000<span style={{ fontSize: 16, fontWeight: 500, color: '#64748b' }}> /bulan</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
                      Buka potensi penuh digitalisasi warung kuliner Anda. Kelola banyak outlet dalam satu pintu!
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={16} color="#f97316" /> Benefit Eksklusif PRO:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {benefits.map((b, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#475569' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Check size={12} color="#f97316" strokeWidth={3} />
                          </div>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
                      color: 'white', border: 'none', padding: '14px 20px', borderRadius: 12,
                      fontWeight: 700, fontSize: 15, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    Lanjutkan Pembayaran <ChevronRight size={16} />
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 0 16px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <ShieldCheck size={32} color="#16a34a" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Akun Anda Aktif di Paket PRO ⚡</h3>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
                    Terima kasih telah berlangganan! Kuota Anda saat ini adalah **5 outlet**.
                  </p>
                  
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <button
                      onClick={onClose}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Tutup
                    </button>
                    <button
                      onClick={handleDowngrade}
                      disabled={loading}
                      style={{
                        flex: 1, padding: '10px 16px', border: '1px solid #fecaca',
                        background: '#fef2f2', color: '#dc2626', borderRadius: 10,
                        fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 6
                      }}
                    >
                      {loading && <Loader2 className="animate-spin" size={14} />}
                      Batalkan Paket PRO
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Checkout form simulation */}
          {step === 'checkout' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: '#fff7ed', border: '1px solid #ffedd5', padding: '12px 16px', borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#c2410c', fontWeight: 600 }}>PAKET PILIHAN</div>
                  <div style={{ fontSize: 14, color: '#7c2d12', fontWeight: 800 }}>MenuQR PRO Monthly</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#7c2d12' }}>Rp 49.000</div>
              </div>

              {/* Credit Card Graphic Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: 'white', padding: 20, borderRadius: 16, marginBottom: 20,
                boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', filter: 'blur(40px)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', color: '#94a3b8' }}>SIMULASI GATEWAY PEMBAYARAN</div>
                  <CreditCard size={28} color="#f97316" />
                </div>
                <div style={{ fontSize: 19, letterSpacing: '2px', fontWeight: 700, fontFamily: 'monospace', marginBottom: 24, color: '#f8fafc' }}>
                  {cardNumber}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>PEMILIK KARTU</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{nameOnCard}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>EXP</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{expiry}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>CVC</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{cvc}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 12 }}>Nama Pemegang Kartu</label>
                  <input
                    type="text"
                    className="form-input"
                    value={nameOnCard}
                    onChange={e => setNameOnCard(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 12 }}>Masa Berlaku (MM/YY)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 12 }}>CVC</label>
                    <input
                      type="password"
                      className="form-input"
                      value={cvc}
                      onChange={e => setCvc(e.target.value)}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep('plans')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  Kembali
                </button>
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  style={{
                    flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, background: '#16a34a', color: 'white', border: 'none',
                    padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Memproses...
                    </>
                  ) : (
                    'Bayar Sekarang (Simulasi)'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Success Celebration */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 0 8px' }} className="animate-fade-in">
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                position: 'relative'
              }}>
                <Sparkles size={36} color="#16a34a" />
                <div style={{ position: 'absolute', top: -5, right: -5, fontSize: 16 }}>🎉</div>
                <div style={{ position: 'absolute', bottom: -5, left: -5, fontSize: 16 }}>✨</div>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 8 }}>Pembayaran Berhasil! 🥳</h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
                Selamat! Akun Anda telah resmi ditingkatkan ke **MenuQR PRO**. Sekarang Anda dapat membuat hingga **5 outlet aktif** dan menikmati semua fitur eksklusif!
              </p>

              <button
                onClick={() => {
                  onClose()
                  setStep('plans')
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 20px' }}
              >
                Mulai Kelola Dashboard PRO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
