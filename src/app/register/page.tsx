'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const passwordChecks = [
  { label: 'Minimal 8 karakter', test: (p: string) => p.length >= 8 },
  { label: 'Mengandung huruf', test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Mengandung angka', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passOk = passwordChecks.every(c => c.test(password))

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!passOk) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      if (signUpError.message === 'User already registered') {
        setError('Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.')
      } else if (signUpError.message.includes('Password')) {
        setError('Password Anda terlalu lemah. Silakan buat yang lebih kuat.')
      } else {
        // Show actual error message instead of generic generic so we can debug
        setError(`Gagal melakukan pendaftaran (${signUpError.message}). Silakan coba kembali.`)
      }
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
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </div>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: 440, padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={28} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Konfirmasi Email Terkirim</h1>
          <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6, marginBottom: 32 }}>
            Tautan aktivasi telah dikirimkan ke <strong>{email}</strong>. Silakan buka kotak masuk atau folder spam email Anda untuk mengaktifkan akun.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10 }}>
            Menuju Halaman Masuk
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
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
        </div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 440, padding: '40px 32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: 16, background: 'white' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Pendaftaran Akun</h1>
        <p style={{ fontSize: 14.5, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
          Buat akun baru untuk mulai mengatur outlet dan katalog menu digital.
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

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reg-name" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Nama Lengkap</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="reg-name"
                type="text"
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
                placeholder="Nama pengelola outlet"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reg-email" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="reg-email"
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

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reg-password" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="reg-password"
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
                placeholder="Masukkan minimal 8 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                id="toggle-reg-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength checklist */}
            {password && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                {passwordChecks.map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: c.test(password) ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.test(password) && <CheckCircle2 size={12} color="#16a34a" />}
                    </div>
                    <span style={{ color: c.test(password) ? '#16a34a' : '#64748b' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            id="btn-register"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10, marginTop: 8 }}
            disabled={loading || !passOk}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
            ) : (
              <>Daftar Akun Sekarang <ArrowRight size={18} style={{ marginLeft: 4 }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 32 }}>
          Sudah memiliki akun?{' '}
          <Link href="/login" style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>
            Masuk di sini
          </Link>
        </p>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 24, lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
          Dengan mendaftar, Anda menyetujui <Link href="/terms" style={{ color: '#64748b', textDecoration: 'underline' }}>Syarat &amp; Ketentuan</Link> dan <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'underline' }}>Kebijakan Privasi</Link>.
        </p>
      </div>
    </div>
  )
}
