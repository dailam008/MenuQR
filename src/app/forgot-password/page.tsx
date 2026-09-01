'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
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
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
      setError('Email atau password yang Anda masukkan tidak sesuai. Silakan coba kembali.') // Generic error matching screenshot style
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 20px',
      }}>
        {/* Header matching screenshot */}
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft size={18} />
            Kembali ke Masuk
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </div>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: 440, padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <CheckCircle2 size={28} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Cek Email Anda</h1>
          <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6, marginBottom: 32 }}>
            Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10 }}>
            Kembali Masuk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px',
    }}>
      {/* Header matching screenshot */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={18} />
          Kembali ke Masuk
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
        </div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 440, padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Lupa Password?</h1>
        <p style={{ fontSize: 14.5, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
          Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk membuat password baru.
        </p>

        {error && (
          <div style={{
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderRadius: 8, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 24, fontSize: 13.5, color: '#e11d48',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ lineHeight: 1.5 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reset-email" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="reset-email"
                type="email"
                className="form-input"
                style={{ 
                  paddingLeft: 42, 
                  height: 48, 
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 14.5,
                  color: '#0f172a'
                }}
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
            ) : (
              <>Kirim Tautan Pemulihan <ArrowRight size={18} style={{ marginLeft: 4 }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 32 }}>
          Ingat password Anda?{' '}
          <Link href="/login" style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>
            Masuk kembali
          </Link>
        </p>
      </div>
    </div>
  )
}
