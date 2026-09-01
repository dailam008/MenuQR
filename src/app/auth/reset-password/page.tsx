'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QrCode, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in recovery mode
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok. Silakan periksa kembali.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal harus terdiri dari 8 karakter.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Gagal mengatur ulang password. Tautan mungkin telah kadaluarsa, silakan minta tautan baru.')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    }
  }

  if (success) {
    return (
      <div className="card" style={{ width: '100%', padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={28} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Password Berhasil Diubah</h1>
        <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6, marginBottom: 32 }}>
          Anda akan dialihkan secara otomatis ke Dashboard dalam beberapa detik...
        </p>
        <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10 }}>
          Masuk ke Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="card" style={{ width: '100%', padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Buat Password Baru</h1>
      <p style={{ fontSize: 14.5, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
        Masukkan kata sandi baru untuk akun Anda yang kuat dan mudah diingat.
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
          <label className="form-label" htmlFor="new-password" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Password Baru</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ 
                paddingLeft: 42, paddingRight: 44,
                height: 48, 
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                fontSize: 14.5,
                color: '#0f172a'
              }}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="confirm-password" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Konfirmasi Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ 
                paddingLeft: 42, paddingRight: 44,
                height: 48, 
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                fontSize: 14.5,
                color: '#0f172a'
              }}
              placeholder="Ulangi password baru"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          id="btn-update-password"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10, marginTop: 8 }}
          disabled={loading}
        >
          {loading ? (
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
          ) : 'Simpan Password Baru'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px',
    }}>
      {/* Header matching screenshot layout (Logo centered or top rightish depending on screen size, but here we center it above the card like Tokopedia's centered auth pages) */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
        </Link>
      </div>

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 440 }}>
        <Suspense fallback={<div className="card" style={{ padding: 40, textAlign: 'center', background: 'white' }}>Memuat form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
