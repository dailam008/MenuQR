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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.'
        : 'Gagal melakukan pendaftaran. Silakan coba kembali.')
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
        <div className="card p-6 sm:p-10 w-full max-w-[440px]" style={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={30} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Konfirmasi Email Terkirim</h1>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 28 }}>
            Tautan aktivasi telah dikirimkan ke <strong>{email}</strong>. Silakan buka email Anda untuk mengaktifkan akun.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Menuju Halaman Masuk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        
        {/* Back button & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>

          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={16} color="white" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </Link>
        </div>

        {/* Card Form */}
        <div className="card" style={{ padding: '32px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Pendaftaran Akun Pengelola</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
            Buat akun baru untuk mulai mengatur outlet dan katalog menu digital.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 20, fontSize: 13.5, color: '#dc2626',
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name" style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="Nama pengelola outlet"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email" style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password" style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 38, paddingRight: 44 }}
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
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength checklist */}
              {password && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {passwordChecks.map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.test(password) ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {c.test(password) && <CheckCircle2 size={10} color="#16a34a" />}
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
              style={{ width: '100%', marginTop: 4, height: 44, justifyContent: 'center', fontSize: 14 }}
              disabled={loading || !passOk}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
              ) : (
                <>Daftar Akun Sekarang <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#64748b', marginTop: 24 }}>
            Sudah memiliki akun?{' '}
            <Link href="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
              Masuk di sini
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.5, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
            Dengan mendaftar, Anda menyetujui <Link href="/terms" style={{ color: '#64748b' }}>Syarat &amp; Ketentuan</Link> dan <Link href="/privacy" style={{ color: '#64748b' }}>Kebijakan Privasi</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
