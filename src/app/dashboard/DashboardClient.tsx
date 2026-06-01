'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Tag, QrCode, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { BarChart } from './components/BarChart'
import type { Outlet } from '@/types/database'

const tips = [
  { icon: '📸', title: 'Foto menu yang menarik', body: 'Gunakan cahaya alami dan latar netral. Foto makanan yang baik bisa meningkatkan pemesanan hingga 30%!' },
  { icon: '💰', title: 'Update harga rutin', body: 'Selalu update harga sebelum bahan baku naik. Pelanggan suka transparansi harga yang akurat.' },
  { icon: '📲', title: 'Sebar QR code lebih luas', body: 'Cetak QR dan tempel di pintu masuk, meja, dan struk. Semakin banyak titik scan = lebih banyak pengunjung digital.' },
  { icon: '🏷️', title: 'Gunakan kategori menu', body: 'Kelompokkan menu ke kategori (Makanan, Minuman, Snack). Pelanggan lebih mudah menemukan apa yang dicari.' },
  { icon: '⭐', title: 'Tandai menu unggulan', body: 'Tambahkan deskripsi singkat "Best Seller" atau "Favorit Pelanggan" di nama menu untuk menarik perhatian.' },
  { icon: '🕐', title: 'Tandai menu habis tepat waktu', body: 'Segera update status Habis/Tersedia agar pelanggan tidak kecewa pesan menu yang sudah habis.' },
  { icon: '🌟', title: 'Minta review dari pelanggan', body: 'Share link menu ke WhatsApp status. Semakin sering dilihat, semakin dikenal warung Anda.' },
]

interface DashboardClientProps {
  fullName: string
  greeting: string
  initialOutlet: Outlet | null
}

interface AnalyticsData {
  stats: {
    menu_count: number
    available_count: number
    category_count: number
    outlet_active: boolean
  }
  views_per_day: { date: string; label: string; count: number }[]
  top_menus: {
    menu_item_id: string
    name: string
    image_url: string | null
    price: number
    view_count: number
  }[]
  total_views: number
  total_today: number
}

export default function DashboardClient({ fullName, greeting, initialOutlet }: DashboardClientProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics/summary', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Gagal memuat data dari server')
        }
        const summary = await res.json()
        setData(summary)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const todayTip = tips[new Date().getDay()]
  const medals = ['🥇', '🥈', '🥉']

  // Stats definition helper
  const statsDef = [
    { label: 'Total Menu', key: 'menu_count' as const, icon: UtensilsCrossed, color: '#f97316', bg: '#fff7ed' },
    { label: 'Menu Tersedia', key: 'available_count' as const, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Kategori', key: 'category_count' as const, icon: Tag, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Outlet Aktif', key: 'outlet_active' as const, icon: QrCode, color: '#06b6d4', bg: '#ecfeff' },
  ]

  const hasScanData = data && data.views_per_day.some(d => d.count > 0)
  const chartData = data?.views_per_day.map(d => ({ label: d.label, value: d.count })) || []

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          {greeting}, {fullName}! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          {initialOutlet ? `Outlet "${initialOutlet.name}" sedang aktif.` : 'Yuk, buat outlet pertama Anda untuk mulai!'}
        </p>
      </div>

      {/* No outlet banner */}
      {!initialOutlet && (
        <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fed7aa)', border: '1.5px solid #fdba74', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#9a3412', marginBottom: 4 }}>Belum ada outlet 🏪</h2>
            <p style={{ fontSize: 14, color: '#c2410c' }}>Buat outlet pertama Anda untuk mulai mengelola menu digital.</p>
          </div>
          <Link href="/dashboard/settings" className="btn btn-primary"><Plus size={16} />Buat Outlet</Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid stagger" style={{ marginBottom: 28 }}>
        {statsDef.map(s => {
          const val = data ? (s.key === 'outlet_active' ? (data.stats[s.key] ? 1 : 0) : data.stats[s.key]) : null
          return (
            <div key={s.label} className="stat-card animate-fade-in">
              <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
              {loading ? (
                <div className="animate-pulse" style={{ height: 28, width: 60, background: '#e5e7eb', borderRadius: 6, margin: '8px 0' }} />
              ) : (
                <div className="stat-value">{val ?? 0}</div>
              )}
              <div className="stat-label">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Error alert */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px', color: '#b91c1c', fontSize: 13, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>

        {/* Bar Chart Section */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Scan QR 7 Hari Terakhir</h2>
            </div>
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 160, justifyContent: 'flex-end', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="animate-pulse" style={{ flex: 1, height: `${20 + (i * 12) % 60}%`, background: '#e5e7eb', borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
                  <span key={day} style={{ fontSize: 10, color: '#9ca3af', width: '100%', textAlign: 'center' }}>{day}</span>
                ))}
              </div>
            </div>
          ) : !initialOutlet ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 13 }}>Belum memiliki outlet untuk melihat grafik.</p>
            </div>
          ) : !hasScanData ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📲</div>
              <p style={{ fontSize: 13, color: '#4b5563', fontWeight: 600 }}>Belum ada scan hari ini</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Sebar QR code ke meja pelanggan!</p>
            </div>
          ) : (
            <BarChart data={chartData} color="#f97316" height={160} />
          )}
        </div>

        {/* Popular Menu Section */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Menu Terpopuler</h2>
          
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e5e7eb' }} />
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e5e7eb' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, width: '70%', background: '#e5e7eb', borderRadius: 4, marginBottom: 6 }} />
                    <div style={{ height: 12, width: '40%', background: '#e5e7eb', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.top_menus || data.top_menus.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 20px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Menu belum ada yang dilihat pelanggan</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                <Link href="/dashboard/menu/new" style={{ color: '#f97316', fontWeight: 600 }}>Tambah menu</Link> atau bagikan link menu Anda.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.top_menus.slice(0, 3).map((item, idx) => (
                <div key={item.menu_item_id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{medals[idx]}</span>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: item.image_url ? 'transparent' : '#f3f4f6', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span>🍽️</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#f97316', fontWeight: 700 }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', flexShrink: 0, background: '#f3f4f6', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>
                    {item.view_count}x dilihat
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip of the day */}
        <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #fff7ed, #fffbf7)', border: '1.5px solid #fed7aa' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ea6c0a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            💡 Tips Hari Ini
          </div>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{todayTip.icon}</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#9a3412', marginBottom: 8 }}>{todayTip.title}</h3>
          <p style={{ fontSize: 13, color: '#c2410c', lineHeight: 1.6 }}>{todayTip.body}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Aksi Cepat</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {[
          { href: '/dashboard/menu/new', icon: Plus, label: 'Tambah Menu Baru', desc: 'Tambahkan item ke menu Anda', color: '#f97316', bg: '#fff7ed' },
          { href: '/dashboard/categories', icon: Tag, label: 'Kelola Kategori', desc: 'Atur kategori menu Anda', color: '#8b5cf6', bg: '#f5f3ff' },
          { href: '/dashboard/qr', icon: QrCode, label: 'Lihat QR Code', desc: 'Download QR untuk outlet', color: '#06b6d4', bg: '#ecfeff' },
          { href: initialOutlet ? `/menu/${initialOutlet.slug}` : '#', icon: ArrowRight, label: 'Lihat Menu Publik', desc: 'Tampilan yang dilihat pelanggan', color: '#16a34a', bg: '#f0fdf4' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            target={action.href.startsWith('/menu') ? '_blank' : undefined}
            className="card card-hover"
            style={{ padding: '18px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <action.icon size={20} color={action.color} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{action.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
