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
      // In a real app we could use error.message, but a generic message is safer for auth
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
      background: '#fafbfc',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px',
    }}>
      {/* Header matching screenshot */}
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Masuk ke Akun</h1>
        <p style={{ fontSize: 14.5, color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
          Akses panel pengelola untuk mengatur katalog menu dan outlet Anda.
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-email" style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="login-email"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-label" htmlFor="login-password" style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 13, color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>
                Lupa password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                id="login-password"
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
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            id="btn-login"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 48, justifyContent: 'center', fontSize: 15, fontWeight: 700, borderRadius: 10, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} className="animate-spin" />
            ) : (
              <>Masuk ke Dashboard <ArrowRight size={18} style={{ marginLeft: 4 }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 32, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
          Belum memiliki akun?{' '}
          <Link href="/register" style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
