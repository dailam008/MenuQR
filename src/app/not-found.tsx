import Link from 'next/link'
import { QrCode, Home, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Halaman Tidak Ditemukan' }

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 60%, #f5f3ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={20} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
        </Link>

        {/* 404 */}
        <div style={{
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          404
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          Halaman tidak ditemukan
        </h1>
        <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 36 }}>
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.<br />
          Mungkin URL-nya salah?
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            Ke Beranda
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
