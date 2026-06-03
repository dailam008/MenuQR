'use client'

import { useState } from 'react'
import { Check, X, Copy, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface UpgradeClientProps {
  user: {
    email?: string
    name?: string
  } | null
}

export default function UpgradeClient({ user }: UpgradeClientProps) {
  const [copied, setCopied] = useState(false)
  const [notifying, setNotifying] = useState(false)

  const accountNumber = '901022110944'
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text', err)
    }
  }

  // Format today's date in ID-id format: e.g. "04 Jun 2026"
  const getTodayFormatted = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Pelanggan'
  const userEmail = user?.email || '-'
  const todayStr = getTodayFormatted()

  const waMessage = `Halo Dailam, saya sudah transfer untuk upgrade MenuQR Pro.
Nama: ${userName}
Email: ${userEmail}
Tanggal transfer: ${todayStr}
Mohon aktivasi akun saya. Terima kasih!`

  const encodedWaUrl = `https://wa.me/6289618418569?text=${encodeURIComponent(waMessage)}`

  const handleWaClick = async () => {
    if (notifying) return
    setNotifying(true)
    try {
      await fetch('/api/upgrade/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail
        })
      })
    } catch (err) {
      console.error('Failed to send upgrade notification', err)
    } finally {
      setNotifying(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 6, 
            color: '#64748b', textDecoration: 'none', fontSize: 14, 
            fontWeight: 600, marginBottom: 24, transition: 'color 0.2s' 
          }}
          className="hover-orange"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Upgrade ke Menu<span style={{ color: '#f97316' }}>QR</span> Pro ⚡
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
            Pilih paket terbaik untuk warung Anda. Dapatkan akses fitur lengkap dan tingkatkan pelayanan pelanggan Anda.
          </p>
        </div>

        {/* Section A: Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 56 }}>
          
          {/* Card 1: Free */}
          <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: 24,
            padding: 32, display: 'flex', flexDirection: 'column', position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#475569', marginBottom: 4 }}>Gratis</h3>
            <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 16 }}>Sempurna untuk coba-coba</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#1e293b' }}>Rp 0</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>/ selamanya</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#475569' }}>
                <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>1 Outlet Cabang</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#475569' }}>
                <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Maksimal 50 Item Menu</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#475569' }}>
                <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>QR Code Standar</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#475569' }}>
                <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Menu Publik Aktif</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#94a3b8', textDecoration: 'line-through' }}>
                <X size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Analitik Pengunjung</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#94a3b8', textDecoration: 'line-through' }}>
                <X size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Domain Kustom</span>
              </li>
            </ul>

            <Link href="/dashboard" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Mulai Sekarang
            </Link>
          </div>

          {/* Card 2: Pro (Highlight) */}
          <div style={{
            background: 'white', 
            border: '2px solid #f97316', 
            borderRadius: 24,
            padding: 32, 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(249, 115, 22, 0.1), 0 10px 10px -5px rgba(249, 115, 22, 0.04)'
          }}>
            {/* Populer Badge */}
            <span style={{
              position: 'absolute', top: -14, right: 24,
              background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
              color: 'white', fontSize: 11, fontWeight: 800,
              padding: '4px 12px', borderRadius: 20, boxShadow: '0 4px 10px rgba(249, 115, 22, 0.25)',
              letterSpacing: '0.5px'
            }}>POPULER</span>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f97316', marginBottom: 4 }}>Pro</h3>
            <p style={{ fontSize: 12.5, color: '#f97316', fontWeight: 600, marginBottom: 16 }}>Pilihan terbaik untuk bisnis kuliner</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#1e293b' }}>Rp 49.000</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>/ bulan</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Hingga 5 Outlet Aktif</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Menu Item Tanpa Batas</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>QR Code Premium Kustom</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Menu Publik Aktif</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Analitik Menu Pengunjung</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Domain Kustom (PRO)</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#334155', fontWeight: 600 }}>
                <Check size={16} color="#f97316" strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Prioritas Dukungan Admin</span>
              </li>
            </ul>

            <button 
              onClick={() => {
                document.getElementById('stepper-section')?.scrollIntoView({ behavior: 'smooth' })
              }} 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Langganan PRO Sekarang
            </button>
          </div>
        </div>

        {/* Section B: Instruction Stepper */}
        <div id="stepper-section" className="card" style={{ padding: 40, border: '1px solid #e2e8f0', background: 'white', borderRadius: 24, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginBottom: 28, textAlign: 'center' }}>
            Cara Upgrade Ke Paket PRO
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
            
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0
              }}>
                1
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                  Transfer biaya langganan Rp 49.000
                </p>
                <div style={{ 
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16,
                  padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 12, marginTop: 8
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Bank Penerima</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginTop: 2 }}>SeaBank</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Nomor Rekening</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f97316', marginTop: 2, letterSpacing: '0.5px' }}>
                      {accountNumber}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Atas Nama (a.n.)</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                      Mochammad Dailam Al Muhibi
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCopy}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={14} color="#16a34a" />
                        <span style={{ color: '#16a34a' }}>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0
              }}>
                2
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px 0' }}>
                  Screenshot / Simpan bukti transfer
                </p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                  Pastikan nominal transfer tepat Rp 49.000 dan menunjukkan status transfer berhasil.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0
              }}>
                3
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px 0' }}>
                  Klik tombol WhatsApp di bawah untuk konfirmasi
                </p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                  Sistem akan mengarahkan Anda ke WhatsApp dengan pesan detail yang terisi otomatis.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0
              }}>
                4
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px 0' }}>
                  Kirim pesan WhatsApp & lampirkan bukti transfer
                </p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                  Kirim pesan tersebut ke admin dan unggah bukti transfer gambar yang disimpan sebelumnya.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0
              }}>
                5
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px 0' }}>
                  Akun aktif dalam waktu 1x24 jam
                </p>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: 0 }}>
                  Setelah verifikasi manual oleh admin, Anda akan menerima email aktivasi dan akun Anda akan otomatis beralih ke Pro.
                </p>
              </div>
            </div>

          </div>

          {/* WA Confirmation Button */}
          <a
            href={encodedWaUrl}
            onClick={handleWaClick}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#25d366', color: 'white', textDecoration: 'none',
              padding: '16px 24px', borderRadius: 16, fontWeight: 800, fontSize: 15,
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.25)', transition: 'transform 0.2s',
              textAlign: 'center'
            }}
            className="hover-scale"
          >
            <Phone size={18} fill="white" />
            Konfirmasi Pembayaran via WhatsApp
          </a>

        </div>

      </div>
    </div>
  )
}
