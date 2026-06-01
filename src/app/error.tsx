'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { QrCode, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: 480 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={20} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
        </Link>

        <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          Terjadi kesalahan
        </h1>
        <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 36 }}>
          Ups! Ada sesuatu yang tidak beres. Coba muat ulang halaman atau kembali ke beranda.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn-primary">
            <RefreshCw size={16} />
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={16} />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
