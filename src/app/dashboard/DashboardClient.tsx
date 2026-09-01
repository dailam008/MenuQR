'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  UtensilsCrossed, 
  Tag, 
  QrCode, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  Store, 
  AlertCircle,
  HelpCircle,
  Camera,
  Layers,
  Sparkles,
  Smartphone,
  CheckCircle
} from 'lucide-react'
import { BarChart } from './components/BarChart'
import type { Outlet } from '@/types/database'

const guides = [
  { icon: Camera, title: 'Foto Menu Berkualitas', body: 'Gunakan pencahayaan yang cukup saat memotret menu makanan dan minuman Anda agar lebih menggugah selera pelanggan.' },
  { icon: Layers, title: 'Kelompokkan Kategori', body: 'Pisahkan menu ke dalam kategori seperti Makanan Utama, Camilan, dan Minuman agar pembeli mudah menemukan pesanan.' },
  { icon: Smartphone, title: 'Tempatkan QR di Meja', body: 'Cetak kode QR dan letakkan di area yang mudah dijangkau pelanggan seperti meja makan, kasir, atau buku menu.' },
  { icon: Sparkles, title: 'Perbarui Status Stok', body: 'Ubah status menu menjadi Habis jika bahan baku kosong agar pelanggan tidak memesan menu yang tidak tersedia.' },
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

  const currentGuide = guides[new Date().getDay() % guides.length]

  const statsDef = [
    { label: 'Total Menu', key: 'menu_count' as const, icon: UtensilsCrossed, color: '#f97316', bg: '#fff7ed' },
    { label: 'Menu Tersedia', key: 'available_count' as const, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Kategori', key: 'category_count' as const, icon: Tag, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Outlet', key: 'outlet_count' as const, icon: Store, color: '#0284c7', bg: '#f0f9ff' },
  ]

  const hasScanData = data && data.views_per_day.some(d => d.count > 0)
  const chartData = data?.views_per_day.map(d => ({ label: d.label, value: d.count })) || []

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Sapaan */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          {greeting}, {fullName.split(' ')[0]}
        </h1>
        <p style={{ color: '#64748b', fontSize: 13.5 }}>
          {initialOutlet
            ? `Panel kendali untuk outlet "${initialOutlet.name}".`
            : 'Mulai kelola menu digital Anda dengan membuat outlet pertama.'}
        </p>
      </div>

      {/* Banner belum ada outlet */}
      {!initialOutlet && (
        <div style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Store size={20} color="#ea580c" />
            </div>
            <div>
              <h2 style={{ fontSize: 14.5, fontWeight: 700, color: '#9a3412', margin: 0 }}>
                Belum Ada Outlet Aktif
              </h2>
              <p style={{ fontSize: 13, color: '#c2410c', margin: '2px 0 0' }}>
                Silakan tambahkan data outlet untuk mulai mengunggah menu dan membuat QR code.
              </p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="btn btn-primary" style={{ fontSize: 13.5, height: 40 }}>
            <Plus size={15} /> Buat Outlet Baru
          </Link>
        </div>
      )}

      {/* Grid Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {statsDef.map(s => {
          const val = data ? data.stats[s.key] : null
          return (
            <div key={s.label} className="card" style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748b' }}>{s.label}</span>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={17} color={s.color} />
                </div>
              </div>
              {loading ? (
                <div style={{ height: 28, width: 60, background: '#f1f5f9', borderRadius: 6 }} />
              ) : (
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{val ?? 0}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Error Notification */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', color: '#dc2626', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Row Utama: Grafik 7 Hari & Menu Populer & Panduan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>

        {/* Grafik 7 Hari */}
        <div className="card" style={{ padding: '20px 22px', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={17} color="#f97316" />
              <h2 style={{ fontSize: 14.5, fontWeight: 700, color: '#1e293b', margin: 0 }}>Statistik Kunjungan</h2>
            </div>
            <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 500 }}>7 Hari Terakhir</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, paddingBottom: 8 }}>
              {[40, 60, 35, 75, 50, 80, 45].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#f1f5f9', borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          ) : !initialOutlet ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <BarChart3 size={20} color="#cbd5e1" />
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Belum ada data outlet aktif</p>
            </div>
          ) : !hasScanData ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', background: '#fafbfc', border: '1px dashed #e2e8f0', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <QrCode size={18} color="#f97316" />
              </div>
              <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, margin: 0 }}>Belum Ada Aktivitas Scan</p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>Data pemindaian akan otomatis tercatat di sini.</p>
            </div>
          ) : (
            <BarChart data={chartData} color="#f97316" height={140} />
          )}
        </div>

        {/* Menu Paling Sering Dilihat */}
        <div className="card" style={{ padding: '20px 22px', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={17} color="#16a34a" />
              <h2 style={{ fontSize: 14.5, fontWeight: 700, color: '#1e293b', margin: 0 }}>Menu Paling Diminati</h2>
            </div>
            <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 500 }}>Populer</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: '#f1f5f9' }} />
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: '65%', background: '#f1f5f9', borderRadius: 4, marginBottom: 5 }} />
                    <div style={{ height: 11, width: '40%', background: '#f1f5f9', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.top_menus || data.top_menus.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', background: '#fafbfc', border: '1px dashed #e2e8f0', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <UtensilsCrossed size={18} color="#94a3b8" />
              </div>
              <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, margin: 0 }}>Belum Ada Interaksi Menu</p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
                <Link href="/dashboard/menu/new" style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>Tambah menu</Link> untuk mulai mencatat statistik.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.top_menus.slice(0, 3).map((item, idx) => (
                <div key={item.menu_item_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <span style={{ 
                    width: 22, height: 22, borderRadius: 6, 
                    background: idx === 0 ? '#ffedd5' : idx === 1 ? '#f1f5f9' : '#f8fafc',
                    color: idx === 0 ? '#ea580c' : '#64748b',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    #{idx + 1}
                  </span>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <UtensilsCrossed size={15} color="#cbd5e1" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: '#ea580c', fontWeight: 600 }}>Rp {item.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: 6, flexShrink: 0, fontWeight: 600 }}>
                    {item.view_count} kali
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panduan Pengelolaan */}
        <div className="card" style={{ padding: '20px 22px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#fafbfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <HelpCircle size={16} color="#64748b" />
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Panduan Pengelolaan
            </h2>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <currentGuide.icon size={18} color="#ea580c" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{currentGuide.title}</h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{currentGuide.body}</p>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Navigasi Cepat</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { href: '/dashboard/menu/new', icon: Plus, label: 'Tambah Menu', desc: 'Unggah item menu baru', color: '#ea580c', bg: '#fff7ed' },
            { href: '/dashboard/categories', icon: Tag, label: 'Kelola Kategori', desc: 'Atur kategori makanan & minuman', color: '#7c3aed', bg: '#f5f3ff' },
            { href: '/dashboard/qr', icon: QrCode, label: 'Kode QR Meja', desc: 'Unduh dan cetak QR outlet', color: '#0284c7', bg: '#f0f9ff' },
            { href: initialOutlet ? `/menu/${initialOutlet.slug}` : '#', icon: ArrowRight, label: 'Katalog Publik', desc: 'Tampilan menu pelanggan', color: '#16a34a', bg: '#f0fdf4' },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              target={action.href.startsWith('/menu') ? '_blank' : undefined}
              className="card card-hover"
              style={{ padding: '16px 18px', borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #f1f5f9' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={18} color={action.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
