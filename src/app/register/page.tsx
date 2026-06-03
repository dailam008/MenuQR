'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const passwordChecks = [
  { label: 'Minimal 8 karakter', test: (p: string) => p.length >= 8 },
  { label: 'Mengandung huruf', test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'Mengandung angka', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
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
        ? 'Email ini sudah terdaftar. Coba masuk.'
        : 'Gagal mendaftar. Coba lagi.')
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Cek email Anda!</h1>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
            Kami mengirim link konfirmasi ke <strong>{email}</strong>. Klik link tersebut untuk mengaktifkan akun Anda.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Pergi ke Halaman Login
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

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ea6c0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
              <QrCode size={22} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Menu<span style={{ color: '#f97316' }}>QR</span></span>
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Buat akun gratis</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Mulai digitalkan menu warung Anda hari ini.</p>

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

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="Budi Santoso"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="reg-email"
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

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 38, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  id="toggle-reg-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {passwordChecks.map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.test(password) ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {c.test(password) && <CheckCircle2 size={10} color="#16a34a" />}
                      </div>
                      <span style={{ color: c.test(password) ? '#16a34a' : '#9ca3af' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              id="btn-register"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 4, height: 44 }}
              disabled={loading || !passOk}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
              ) : (
                <>Buat Akun Gratis <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
              Masuk →
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16, lineHeight: 1.6 }}>
            Dengan mendaftar, Anda menyetujui syarat & ketentuan penggunaan MenuQR.
          </p>
        </div>
      </div>
    </div>
  )
}
