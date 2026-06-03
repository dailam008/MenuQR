'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, Copy, Check, QrCode, MessageCircle } from 'lucide-react'
import { getPublicMenuUrl } from '@/lib/utils'
import type { Outlet } from '@/types/database'

interface Props { outlet: Outlet }

type Template = 'minimalis' | 'colorful' | 'classic'

const templates: { id: Template; label: string; emoji: string }[] = [
  { id: 'minimalis', label: 'Minimalis', emoji: '⬜' },
  { id: 'colorful',  label: 'Colorful',  emoji: '🟠' },
  { id: 'classic',   label: 'Classic',   emoji: '🖤' },
]

export default function QRCodeDisplay({ outlet }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [copied,   setCopied]   = useState(false)
  const [template, setTemplate] = useState<Template>('colorful')
  const [hover,    setHover]    = useState(false)
  const menuUrl = getPublicMenuUrl(outlet.slug)

  useEffect(() => { generateQR() }, [menuUrl])

  async function generateQR() {
    const QRCode = (await import('qrcode')).default
    const canvas = canvasRef.current
    if (!canvas) return
    await QRCode.toCanvas(canvas, menuUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    })
  }

  async function downloadQR() {
    const QRCode = (await import('qrcode')).default
    const SIZE = 1000
    const exportCanvas = document.createElement('canvas')
    const ctx = exportCanvas.getContext('2d')!

    if (template === 'minimalis') {
      exportCanvas.width = SIZE; exportCanvas.height = SIZE + 160
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, SIZE, SIZE + 160)
      // Border
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 4
      ctx.strokeRect(2, 2, SIZE - 4, SIZE + 156)
      // QR
      const qrDataUrl = await QRCode.toDataURL(menuUrl, { width: SIZE - 80, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#111827', light: '#ffffff' } })
      const img = new Image(); img.src = qrDataUrl
      await new Promise(r => { img.onload = r })
      ctx.drawImage(img, 40, 40, SIZE - 80, SIZE - 80)
      // Footer
      ctx.fillStyle = '#111827'; ctx.font = `bold 36px sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(outlet.name, SIZE / 2, SIZE + 60)
      ctx.fillStyle = '#9ca3af'; ctx.font = `28px sans-serif`
      ctx.fillText('Scan untuk melihat menu', SIZE / 2, SIZE + 110)
      ctx.fillStyle = '#f97316'; ctx.font = `bold 24px sans-serif`
      ctx.fillText('menuqr.vercel.app', SIZE / 2, SIZE + 148)

    } else if (template === 'colorful') {
      exportCanvas.width = SIZE; exportCanvas.height = SIZE + 200
      // Gradient BG
      const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE + 200)
      grad.addColorStop(0, '#fff7ed'); grad.addColorStop(1, '#ffedd5')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, SIZE, SIZE + 200)
      // Header
      const hGrad = ctx.createLinearGradient(0, 0, SIZE, 140)
      hGrad.addColorStop(0, '#f97316'); hGrad.addColorStop(1, '#ea6c0a')
      ctx.fillStyle = hGrad; ctx.roundRect(0, 0, SIZE, 140, [0, 0, 0, 0]); ctx.fill()
      ctx.fillStyle = '#ffffff'; ctx.font = `bold 44px sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(outlet.name, SIZE / 2, 88)
      // White QR box
      ctx.fillStyle = '#ffffff'; ctx.roundRect(60, 160, SIZE - 120, SIZE - 120, [24, 24, 24, 24]); ctx.fill()
      const qrDataUrl = await QRCode.toDataURL(menuUrl, { width: SIZE - 200, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#111827', light: '#ffffff' } })
      const img = new Image(); img.src = qrDataUrl
      await new Promise(r => { img.onload = r })
      ctx.drawImage(img, 100, 180, SIZE - 200, SIZE - 200)
      // Footer
      ctx.fillStyle = '#9a3412'; ctx.font = `bold 36px sans-serif`
      ctx.fillText('Scan untuk melihat menu kami', SIZE / 2, SIZE + 90)
      ctx.fillStyle = '#ea6c0a'; ctx.font = `bold 28px sans-serif`
      ctx.fillText('📱 Tanpa install aplikasi!', SIZE / 2, SIZE + 148)

    } else { // classic
      exportCanvas.width = SIZE; exportCanvas.height = SIZE + 180
      ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, SIZE, SIZE + 180)
      ctx.fillStyle = '#f97316'
      ctx.fillRect(0, 0, SIZE, 8)
      ctx.fillRect(0, SIZE + 172, SIZE, 8)
      // White QR area
      ctx.fillStyle = '#ffffff'; ctx.roundRect(60, 60, SIZE - 120, SIZE - 120, [16, 16, 16, 16]); ctx.fill()
      const qrDataUrl = await QRCode.toDataURL(menuUrl, { width: SIZE - 200, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#111827', light: '#ffffff' } })
      const img = new Image(); img.src = qrDataUrl
      await new Promise(r => { img.onload = r })
      ctx.drawImage(img, 100, 80, SIZE - 200, SIZE - 200)
      ctx.fillStyle = '#ffffff'; ctx.font = `bold 40px sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(outlet.name, SIZE / 2, SIZE + 70)
      ctx.fillStyle = '#9ca3af'; ctx.font = `28px sans-serif`
      ctx.fillText('Scan untuk lihat menu', SIZE / 2, SIZE + 120)
      ctx.fillStyle = '#f97316'; ctx.font = `bold 24px sans-serif`
      ctx.fillText('MenuQR', SIZE / 2, SIZE + 162)
    }

    const url = exportCanvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.download = `qr-${template}-${outlet.slug}.png`
    a.href = url; a.click()
  }

  async function copyLink() {
    await navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Lihat menu ${outlet.name} kami di sini: ${menuUrl} 🍽️\nScan QR atau klik linknya!`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const templateColors: Record<Template, { header: string; border: string }> = {
    minimalis: { header: '#f9fafb', border: '#e5e7eb' },
    colorful:  { header: 'linear-gradient(135deg, #f97316, #ea6c0a)', border: '#fdba74' },
    classic:   { header: '#111827', border: '#374151' },
  }
  const tc = templateColors[template]

  return (
    <div style={{ gap: 24, maxWidth: 820 }} className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-start">

      {/* QR Card */}
      <div className="card w-full max-w-[340px] mx-auto md:mx-0" style={{ padding: 20, textAlign: 'center' }}>
        {/* Header */}
        <div style={{
          background: tc.header, border: `1px solid ${tc.border}`,
          borderRadius: 14, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
        }}>
          <QrCode size={18} color={template === 'classic' ? '#f97316' : template === 'minimalis' ? '#111827' : 'white'} />
          <span style={{ color: template === 'minimalis' ? '#111827' : 'white', fontWeight: 700, fontSize: 15 }}>
            {outlet.name}
          </span>
        </div>

        {/* QR with hover overlay */}
        <div
          style={{ position: 'relative', display: 'inline-block', cursor: 'crosshair', maxWidth: '100%' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <canvas ref={canvasRef} style={{ borderRadius: 12, border: '1px solid #e5e7eb', display: 'block', maxWidth: '100%', height: 'auto' }} />
          {hover && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 12,
              background: 'rgba(249,115,22,0.85)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'white', gap: 6,
            }}>
              <span style={{ fontSize: 28 }}>📱</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Arahkan kamera HP</span>
              <span style={{ fontSize: 12, opacity: 0.9 }}>untuk scan QR ini</span>
            </div>
          )}
        </div>

        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10, marginBottom: 16 }}>
          Hover QR untuk instruksi scan
        </p>

        {/* Template Picker */}
        <div className="flex flex-wrap gap-2 justify-center" style={{ marginBottom: 16 }}>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              style={{
                padding: '5px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                background: template === t.id ? '#f97316' : '#f9fafb',
                color: template === t.id ? 'white' : '#6b7280',
                border: `1.5px solid ${template === t.id ? '#f97316' : '#e5e7eb'}`,
                transition: 'all 0.15s',
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Download */}
        <button id="btn-download-qr" onClick={downloadQR} className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: 8, padding: '10px' }}>
          <Download size={15} /> Download {template.charAt(0).toUpperCase() + template.slice(1)} (1000px)
        </button>
        <a id="btn-open-menu" href={menuUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '10px' }}>
          <ExternalLink size={15} /> Buka Halaman Menu
        </a>
      </div>

      {/* Info Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Link + Copy + WhatsApp */}
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>🔗 Link Menu Publik</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <div style={{ flex: 1, padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, color: '#374151', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {menuUrl}
            </div>
            <button id="btn-copy-link" onClick={copyLink} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
          <button
            id="btn-share-whatsapp"
            onClick={shareWhatsApp}
            className="btn btn-sm"
            style={{ width: '100%', background: '#25d366', color: 'white', border: 'none', gap: 8 }}
          >
            <MessageCircle size={16} />
            Share via WhatsApp
          </button>
        </div>

        {/* Template Info */}
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>🎨 Template Stiker Cetak</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {templates.map(t => (
              <div key={t.id} style={{
                padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                background: template === t.id ? '#fff7ed' : '#f9fafb',
                border: `1.5px solid ${template === t.id ? '#fdba74' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }} onClick={() => setTemplate(t.id)}>
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: template === t.id ? '#9a3412' : '#374151' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {t.id === 'minimalis' && 'Putih bersih, cocok untuk warung modern'}
                    {t.id === 'colorful'  && 'Orange vibrant, menarik perhatian pelanggan'}
                    {t.id === 'classic'   && 'Hitam elegan, premium dan profesional'}
                  </div>
                </div>
                {template === t.id && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#f97316' }}>Aktif</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>📋 Cara Pakai QR Code</p>
          {[
            { num: '1', text: 'Pilih template, lalu download PNG resolusi 1000×1000px' },
            { num: '2', text: 'Print di kertas atau stiker (ukuran min. 5×5 cm)' },
            { num: '3', text: 'Tempel di meja, kasir, atau pintu masuk warung' },
            { num: '4', text: 'Share link via WhatsApp ke pelanggan setia Anda' },
          ].map(tip => (
            <div key={tip.num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 8, background: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                {tip.num}
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{tip.text}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginBottom: 4 }}>✅ Rekomendasi Cetak</p>
          <p style={{ fontSize: 13, color: '#166534' }}>
            Cetak di ukuran <strong>10×10 cm</strong> untuk hasil scan terbaik. Gunakan kertas glossy agar tahan lama.
          </p>
        </div>
      </div>
    </div>
  )
}
