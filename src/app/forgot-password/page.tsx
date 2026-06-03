'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError('Gagal mengirim email. Pastikan email terdaftar.')
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
        <div className="animate-fade-in card p-6 sm:p-10 w-full max-w-[440px]" style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={32} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Cek email Anda!</h1>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
            Link reset password sudah dikirim ke <strong>{email}</strong>. Klik link tersebut untuk membuat password baru.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #f5f3ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
              <QrCode size={22} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Lupa password?</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
            Masukkan email Anda dan kami akan kirimkan link untuk reset password.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 20, fontSize: 14, color: '#dc2626',
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="email@warunganda.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              id="btn-reset-password"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: 44 }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
              ) : (
                <>Kirim Link Reset <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
            Ingat password?{' '}
            <Link href="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
              Masuk →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
