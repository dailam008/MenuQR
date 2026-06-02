'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { QrCode, LayoutDashboard, UtensilsCrossed, Tag, LogOut, Menu, X, Settings, Store, ChevronDown, Plus, Sparkles, CreditCard, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import BillingModal from './components/BillingModal'

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
  const [outlets, setOutlets] = useState<any[]>([])
  const [activeOutletId, setActiveOutletId] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [billingOpen, setBillingOpen] = useState(false)
  const [loadingOutlets, setLoadingOutlets] = useState(true)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [updatingActive, setUpdatingActive] = useState(false)

  async function fetchOutlets() {
    try {
      const res = await fetch('/api/outlets?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache' }
      })
      if (res.ok) {
        const data = await res.json()
        setOutlets(data.outlets || [])
        setActiveOutletId(data.activeOutletId)
        setIsPro(data.isPro)
      }
    } catch (e) {
      console.error('Gagal memuat outlet', e)
    } finally {
      setLoadingOutlets(false)
    }
  }

  useEffect(() => {
    fetchOutlets()
  }, [])

  async function handleSwitchOutlet(id: string) {
    setUpdatingActive(true)
    setSwitcherOpen(false)
    try {
      const res = await fetch('/api/outlets/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('Gagal berpindah outlet.')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingActive(false)
    }
  }

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

  const activeOutlet = outlets.find(o => o.id === activeOutletId)

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
        {/* Logo & PRO Badge */}
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          {isPro && (
            <span style={{
              background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              border: '1px solid #fed7aa',
              color: '#f97316',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 20,
              letterSpacing: '0.5px'
            }}>PRO</span>
          )}
        </div>

        {/* Outlet Switcher Section */}
        <div style={{ padding: '0 16px 16px', position: 'relative', borderBottom: '1px solid #f3f4f6' }}>
          {loadingOutlets ? (
            <div className="animate-pulse" style={{ height: 40, background: '#f3f4f6', borderRadius: 10 }} />
          ) : outlets.length === 0 ? (
            <Link href="/dashboard/settings" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Buat Outlet Baru
            </Link>
          ) : (
            <>
              <button
                id="btn-outlet-switcher"
                onClick={() => setSwitcherOpen(!switcherOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                  padding: '8px 12px', cursor: 'pointer', textAlign: 'left', outline: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <Store size={16} color="#f97316" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeOutlet?.name || 'Pilih Outlet...'}
                  </span>
                </div>
                <ChevronDown size={14} color="#64748b" style={{ transform: switcherOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Switcher Dropdown */}
              {switcherOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 16, right: 16,
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 12,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 50, marginTop: 4, padding: 6, display: 'flex', flexDirection: 'column', gap: 2
                }}>
                  {outlets.map(o => (
                    <button
                      key={o.id}
                      onClick={() => handleSwitchOutlet(o.id)}
                      disabled={updatingActive}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 10px', background: o.id === activeOutletId ? '#fff7ed' : 'transparent',
                        border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        fontSize: 13, fontWeight: o.id === activeOutletId ? 600 : 500,
                        color: o.id === activeOutletId ? '#ea6c0a' : '#475569'
                      }}
                    >
                      <Store size={14} style={{ opacity: o.id === activeOutletId ? 1 : 0.6 }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                      {o.id === activeOutletId && <Check size={12} color="#f97316" strokeWidth={3} />}
                    </button>
                  ))}
                  
                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
                    <Link
                      href="/dashboard/settings/new"
                      onClick={() => setSwitcherOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 10px', textDecoration: 'none', color: '#f97316',
                        fontSize: 12.5, fontWeight: 700
                      }}
                    >
                      <Plus size={14} /> Tambah Outlet Baru
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
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

        {/* Bottom Panel */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Dynamic Plan Promotion Button */}
          {!loadingOutlets && (
            <button
              onClick={() => setBillingOpen(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: isPro ? '#f8fafc' : 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                border: isPro ? '1px solid #e2e8f0' : '1px solid #fed7aa',
                borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                textAlign: 'left', outline: 'none'
              }}
            >
              {isPro ? (
                <>
                  <CreditCard size={16} color="#64748b" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155' }}>Kelola Paket PRO</span>
                    <span style={{ fontSize: 9.5, color: '#64748b' }}>Rp 49.000/bulan</span>
                  </div>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#f97316" className="animate-pulse" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#ea6c0a' }}>⚡ Upgrade ke PRO</span>
                    <span style={{ fontSize: 9.5, color: '#c2410c' }}>Kelola hingga 5 outlet</span>
                  </div>
                </>
              )}
            </button>
          )}

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

      {/* Billing & Checkout Modal Simulation */}
      <BillingModal
        isOpen={billingOpen}
        onClose={() => setBillingOpen(false)}
        isPro={isPro}
        onPlanUpdated={fetchOutlets}
      />
    </div>
  )
}
