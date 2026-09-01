'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password yang Anda masukkan tidak sesuai. Silakan coba kembali.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        
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

        {/* Card */}
        <div className="card" style={{ padding: '32px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Masuk ke Akun</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
            Akses panel pengelola untuk mengatur katalog menu dan outlet Anda.
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

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email" style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="login-email"
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" htmlFor="login-password" style={{ fontSize: 13, fontWeight: 600, color: '#334155', margin: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12.5, color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
                  Lupa password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 38, paddingRight: 44 }}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 6, height: 44, justifyContent: 'center', fontSize: 14 }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
              ) : (
                <>Masuk ke Dashboard <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#64748b', marginTop: 24, borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
            Belum memiliki akun?{' '}
            <Link href="/register" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
