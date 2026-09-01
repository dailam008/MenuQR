'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Tag, QrCode, Plus, ArrowRight, TrendingUp, BarChart2 } from 'lucide-react'
import { BarChart } from './components/BarChart'
import type { Outlet } from '@/types/database'

// Tips harian — dibuat manual biar relevan
const tips = [
  { icon: '📸', title: 'Foto yang bikin ngiler', body: 'Pakai cahaya alami, hindari flash langsung. Foto makanan yang bagus bisa naikkan minat pelanggan secara signifikan.' },
  { icon: '💰', title: 'Jangan sampai harga mati', body: 'Update harga secara berkala supaya pelanggan tidak kaget pas bayar. Transparansi harga itu penting banget.' },
  { icon: '📲', title: 'Sebar QR code lebih luas', body: 'Tempel di pintu masuk, meja, dan struk. Semakin banyak titik tempel = makin banyak yang buka menu digital kamu.' },
  { icon: '🏷️', title: 'Manfaatkan fitur kategori', body: 'Pisahkan Makanan, Minuman, Snack. Pelanggan jadi lebih mudah cari menu yang mereka mau.' },
  { icon: '⭐', title: 'Highlight menu andalan', body: 'Tambahkan keterangan "Best Seller" atau "Favorit" di nama menu — sederhana tapi efektif menarik perhatian.' },
  { icon: '🕐', title: 'Update stok tepat waktu', body: 'Kalau menu habis, langsung ubah statusnya. Pelanggan yang kecewa karena menu habis jarang balik lagi.' },
  { icon: '🌟', title: 'Share link menu ke WhatsApp', body: 'Bagikan link menu ke status atau grup. Semakin sering dilihat, semakin dikenal warung kamu di lingkungan sekitar.' },
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
    outlet_count: number
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
        if (!res.ok) throw new Error('Gagal memuat data dari server')
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

  const statsDef = [
    { label: 'Total Menu', key: 'menu_count' as const, icon: UtensilsCrossed, color: '#f97316', bg: '#fff7ed' },
    { label: 'Menu Tersedia', key: 'available_count' as const, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Kategori', key: 'category_count' as const, icon: Tag, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Outlet', key: 'outlet_count' as const, icon: QrCode, color: '#0891b2', bg: '#ecfeff' },
  ]

  const hasScanData = data && data.views_per_day.some(d => d.count > 0)
  const chartData = data?.views_per_day.map(d => ({ label: d.label, value: d.count })) || []

  return (
    <div>
      {/* Sapaan */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          {greeting}, {fullName.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.5 }}>
          {initialOutlet
            ? `Outlet "${initialOutlet.name}" sedang aktif. Yuk pantau performa menu hari ini.`
            : 'Belum punya outlet? Yuk buat dulu biar kamu bisa mulai kelola menu digital.'}
        </p>
      </div>

      {/* Banner belum ada outlet */}
      {!initialOutlet && (
        <div style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 14
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#9a3412', marginBottom: 4 }}>
              🏪 Belum ada outlet
            </h2>
            <p style={{ fontSize: 13.5, color: '#c2410c' }}>
              Buat outlet pertama kamu untuk mulai mengelola menu digital.
            </p>
          </div>
          <Link href="/dashboard/settings" className="btn btn-primary" style={{ fontSize: 14 }}>
            <Plus size={15} /> Buat Outlet
          </Link>
        </div>
      )}

      {/* Kartu Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
        {statsDef.map(s => {
          const val = data ? data.stats[s.key] : null
          return (
            <div key={s.label} className="card" style={{ padding: '18px 16px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <s.icon size={18} color={s.color} />
              </div>
              {loading ? (
                <div style={{ height: 28, width: 50, background: '#f3f4f6', borderRadius: 6, marginBottom: 6 }} />
              ) : (
                <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{val ?? 0}</div>
              )}
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', color: '#b91c1c', fontSize: 13, marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Baris Grafik + Menu Populer + Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>

        {/* Grafik 7 Hari */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart2 size={16} color="#f97316" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Scan QR 7 Hari Terakhir</h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110, paddingBottom: 8 }}>
              {[40, 60, 35, 75, 50, 80, 45].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#f3f4f6', borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          ) : !initialOutlet ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 13 }}>Buat outlet dulu untuk lihat grafik ini.</p>
            </div>
          ) : !hasScanData ? (
            <div style={{ textAlign: 'center', padding: '30px 16px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 10 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📲</div>
              <p style={{ fontSize: 13, color: '#4b5563', fontWeight: 600 }}>Belum ada scan hari ini</p>
              <p style={{ fontSize: 12, marginTop: 3 }}>Sebar QR code ke meja pelanggan!</p>
            </div>
          ) : (
            <BarChart data={chartData} color="#f97316" height={140} />
          )}
        </div>

        {/* Menu Terpopuler */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Menu Paling Sering Dilihat</h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f3f4f6' }} />
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f4f6' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: '65%', background: '#f3f4f6', borderRadius: 4, marginBottom: 5 }} />
                    <div style={{ height: 11, width: '40%', background: '#f3f4f6', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.top_menus || data.top_menus.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 10 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🍽️</div>
              <p style={{ fontSize: 13, color: '#4b5563' }}>Belum ada menu yang dilihat pelanggan</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>
                <Link href="/dashboard/menu/new" style={{ color: '#f97316', fontWeight: 600 }}>Tambah menu</Link> atau bagikan link menu kamu.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.top_menus.slice(0, 3).map((item, idx) => (
                <div key={item.menu_item_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{medals[idx]}</span>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f3f4f6', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 16 }}>🍽️</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>Rp {item.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', padding: '2px 7px', borderRadius: 6, flexShrink: 0, fontWeight: 600 }}>
                    {item.view_count}x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Harian */}
        <div className="card" style={{ padding: 20, background: '#fffbf7', border: '1px solid #fed7aa' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ea6c0a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            💡 Tips Hari Ini
          </div>
          <div style={{ fontSize: 26, marginBottom: 10 }}>{todayTip.icon}</div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#7c2d12', marginBottom: 6 }}>{todayTip.title}</h3>
          <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>{todayTip.body}</p>
        </div>
      </div>

      {/* Aksi Cepat */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Aksi Cepat</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { href: '/dashboard/menu/new', icon: Plus, label: 'Tambah Menu', desc: 'Tambah item ke katalog', color: '#f97316', bg: '#fff7ed' },
          { href: '/dashboard/categories', icon: Tag, label: 'Kelola Kategori', desc: 'Atur pengelompokan menu', color: '#8b5cf6', bg: '#f5f3ff' },
          { href: '/dashboard/qr', icon: QrCode, label: 'QR Code', desc: 'Download QR untuk outlet', color: '#0891b2', bg: '#ecfeff' },
          { href: initialOutlet ? `/menu/${initialOutlet.slug}` : '#', icon: ArrowRight, label: 'Lihat Menu Publik', desc: 'Tampilan yang dilihat pelanggan', color: '#16a34a', bg: '#f0fdf4' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            target={action.href.startsWith('/menu') ? '_blank' : undefined}
            className="card card-hover"
            style={{ padding: '16px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <action.icon size={18} color={action.color} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{action.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
