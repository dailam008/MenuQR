'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QrCode, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
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

  // Supabase puts the token in the URL hash — handle it
  useEffect(() => {
    const supabase = createClient()
    // Listen for the PASSWORD_RECOVERY event from the URL hash
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in recovery mode — ready to set new password
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Gagal reset password. Link mungkin sudah kadaluarsa.')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  if (success) {
    return (
      <div className="animate-fade-in card" style={{ padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={32} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Password berhasil diubah!</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Mengarahkan ke dashboard...</p>
        <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
          Ke Dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Buat password baru</h1>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
        Masukkan password baru untuk akun Anda.
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
          <label className="form-label" htmlFor="new-password">Password Baru</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: 38, paddingRight: 44 }}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirm-password">Konfirmasi Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: 38 }}
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
          style={{ width: '100%', height: 44 }}
          disabled={loading}
        >
          {loading ? (
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
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
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #f5f3ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
              <QrCode size={22} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </Link>
        </div>
        <Suspense fallback={<div className="card" style={{ padding: 40, textAlign: 'center' }}>Memuat...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
