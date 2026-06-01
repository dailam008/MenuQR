import Link from 'next/link'
import { ArrowRight, Utensils } from 'lucide-react'

export default function MenuNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="animate-fade-in"
      >
        {/* Simple Premium Plate Illustration with Broken Fork Line-art SVG */}
        <div style={{ width: '120px', height: '120px', marginBottom: '28px' }}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '100%', height: '100%', color: '#f97316' }}
          >
            {/* Outer plate circle */}
            <circle cx="50" cy="50" r="40" stroke="#f97316" strokeWidth="3" />
            {/* Inner plate circle */}
            <circle cx="50" cy="50" r="26" stroke="#fed7aa" strokeWidth="2" strokeDasharray="6 4" />
            
            {/* Minimalist broken/empty fork and spoon inside */}
            {/* Fork on the left */}
            <path d="M38 42v12m4-12v12m-8-12v12m4 0v16" stroke="#fdba74" strokeWidth="2.5" />
            {/* Spoon/knife on the right */}
            <path d="M62 42c0 5-4 8-4 8s-4-3-4-8 4-8 4-8 4 3 4 8zm-4 8v16" stroke="#fdba74" strokeWidth="2.5" />
            
            {/* Tiny steam line to show emptiness */}
            <path d="M48 24c0-2 2-2 2-4s-2-2-2-4" stroke="#f97316" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        {/* Text */}
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
          Warung ini belum terdaftar 🏪
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Apakah kamu pemilik warung? Daftar gratis dan buat menu digital interaktif dengan QR code-mu sekarang.
        </p>

        {/* CTA Button */}
        <Link
          href="/register"
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          className="btn-cta"
        >
          Daftar Gratis <ArrowRight size={16} />
        </Link>
      </div>

      {/* Brand Label Footer */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Utensils size={12} color="#ffffff" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#64748b' }}>
          Menu<span style={{ color: '#f97316' }}>QR</span>
        </span>
      </div>
    </div>
  )
}
