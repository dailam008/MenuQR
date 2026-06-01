'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { QrCode, LayoutDashboard, UtensilsCrossed, Tag, LogOut, Menu, X, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/menu', icon: UtensilsCrossed, label: 'Menu Saya' },
  { href: '/dashboard/categories', icon: Tag, label: 'Kategori' },
  { href: '/dashboard/qr', icon: QrCode, label: 'QR Code' },
  { href: '/dashboard/settings', icon: Settings, label: 'Pengaturan Outlet' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // Ignore signOut errors — clear session locally and redirect anyway
    } finally {
      window.location.href = '/login'
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 39, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316, #ea6c0a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
            }}>
              <QrCode size={18} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
              Menu<span style={{ color: '#f97316' }}>QR</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Menu Utama</span>
          {navItems.map(item => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} className="nav-icon" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid #f3f4f6' }}>
          <button
            id="btn-logout"
            onClick={handleLogout}
            className="nav-item"
            style={{ color: '#dc2626', width: '100%' }}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button
            id="btn-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-icon"
            style={{ display: 'none' }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <style>{`
            @media (max-width: 768px) {
              #btn-toggle-sidebar { display: flex !important; }
            }
          `}</style>

          <div style={{ flex: 1 }} />

          <Link
            href="/"
            style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
            target="_blank"
          >
            Lihat Landing Page ↗
          </Link>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  )
}
