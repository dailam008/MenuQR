'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { QrCode, LayoutDashboard, UtensilsCrossed, Tag, LogOut, Menu, X, Settings, Store, ChevronDown, Plus, Sparkles, CreditCard, Loader2, Check, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import BillingModal from './components/BillingModal'
import { PlanBadge, PlanWarningBanner } from './components/PlanBadge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/menu', icon: UtensilsCrossed, label: 'Menu Saya' },
  { href: '/dashboard/categories', icon: Tag, label: 'Kategori' },
  { href: '/dashboard/qr', icon: QrCode, label: 'QR Code' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analitik', isProOnly: true },
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
        <PlanWarningBanner />
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <item.icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </div>
                {item.isProOnly && (
                  <span style={{
                    background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                    border: '1px solid #fed7aa',
                    color: '#f97316',
                    fontSize: 8.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 10,
                    textTransform: 'uppercase',
                    marginLeft: 6
                  }}>PRO</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Panel */}
        <div style={{ padding: '12px 12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PlanBadge />

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
        <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: 12 }}>
          {/* Hamburger Menu (Mobile) */}
          <button 
            className="md:hidden" 
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#111827', flexShrink: 0 }}
          >
            <Menu size={24} />
          </button>

          {/* Mobile Outlet Switcher */}
          <div style={{ position: 'relative', width: 160 }} className="md:hidden">
            {loadingOutlets ? (
              <div className="animate-pulse" style={{ height: 36, background: '#f3f4f6', borderRadius: 8 }} />
            ) : outlets.length > 0 && (
              <>
                <button
                  id="btn-outlet-switcher-mobile"
                  onClick={() => setSwitcherOpen(!switcherOpen)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '6px 10px', cursor: 'pointer', textAlign: 'left', outline: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                    <Store size={14} color="#f97316" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeOutlet?.name || 'Pilih...'}
                    </span>
                  </div>
                  <ChevronDown size={12} color="#64748b" style={{ transform: switcherOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>

                {switcherOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 50, marginTop: 4, padding: 4, display: 'flex', flexDirection: 'column', gap: 2
                  }}>
                    {outlets.map(o => (
                      <button
                        key={o.id}
                        onClick={() => handleSwitchOutlet(o.id)}
                        disabled={updatingActive}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                          padding: '6px 8px', background: o.id === activeOutletId ? '#fff7ed' : 'transparent',
                          border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                          fontSize: 12, fontWeight: o.id === activeOutletId ? 600 : 500,
                          color: o.id === activeOutletId ? '#ea6c0a' : '#475569'
                        }}
                      >
                        <Store size={12} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                        {o.id === activeOutletId && <Check size={10} color="#f97316" strokeWidth={3} style={{ flexShrink: 0 }} />}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
                      <Link
                        href="/dashboard/settings/new"
                        onClick={() => setSwitcherOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                          padding: '6px 8px', textDecoration: 'none', color: '#f97316',
                          fontSize: 11.5, fontWeight: 700
                        }}
                      >
                        <Plus size={12} /> Tambah Outlet Baru
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Upgrade / Billing Button for Mobile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!loadingOutlets && (
              <Link
                href="/upgrade"
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: isPro ? '#f1f5f9' : 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid #fed7aa',
                  borderRadius: 8, padding: '6px 10px', textDecoration: 'none', outline: 'none'
                }}
              >
                {isPro ? (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#475569' }}>PRO</span>
                ) : (
                  <>
                    <Sparkles size={12} color="#f97316" className="animate-pulse" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#ea6c0a' }}>Upgrade</span>
                  </>
                )}
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="md:hidden"
              style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <LogOut size={16} />
            </button>

            <Link
              href="/"
              style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
              target="_blank"
              className="hidden md:block"
            >
              Lihat Menu ↗
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        {navItems.map(item => {
          if (item.href === '/dashboard/analytics') return null

          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          
          let cleanLabel = item.label
          if (cleanLabel === 'Menu Saya') cleanLabel = 'Menu'
          if (cleanLabel === 'QR Code') cleanLabel = 'QR'
          if (cleanLabel === 'Pengaturan Outlet') cleanLabel = 'Pengaturan'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="bottom-nav-icon" />
              <span>{cleanLabel}</span>
            </Link>
          )
        })}
      </nav>

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
