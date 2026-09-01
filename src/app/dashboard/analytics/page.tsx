'use client'

import { useEffect, useState } from 'react'
import { BarChart } from '../components/BarChart'
import UpgradeWall from '../components/UpgradeWall'
import { usePlanLimit } from '@/hooks/usePlanLimit'
import { Users, Eye, QrCode, TrendingUp, TrendingDown, Calendar, Clock, BarChart2, Minus } from 'lucide-react'
import Link from 'next/link'

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
  total_this_week: number
  total_last_week: number
  total_this_month: number
  peak_hour: { hour: number; count: number } | null
  hourly_distribution: { hour: number; label: string; count: number }[]
}

const defaultEmptyAnalytics: AnalyticsData = {
  stats: { menu_count: 0, available_count: 0, category_count: 0, outlet_count: 0 },
  views_per_day: [
    { date: '', label: 'Sen', count: 0 },
    { date: '', label: 'Sel', count: 0 },
    { date: '', label: 'Rab', count: 0 },
    { date: '', label: 'Kam', count: 0 },
    { date: '', label: 'Jum', count: 0 },
    { date: '', label: 'Sab', count: 0 },
    { date: '', label: 'Min', count: 0 },
  ],
  top_menus: [],
  total_views: 0,
  total_today: 0,
  total_this_week: 0,
  total_last_week: 0,
  total_this_month: 0,
  peak_hour: null,
  hourly_distribution: [],
}

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return <span style={{ fontSize: 11, color: '#94a3b8' }}>Belum ada data</span>
  if (previous === 0) return <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>Baru</span>
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct > 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#16a34a', fontWeight: 700 }}>
      <TrendingUp size={12} /> +{pct}% vs minggu lalu
    </span>
  )
  if (pct < 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
      <TrendingDown size={12} /> {pct}% vs minggu lalu
    </span>
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b', fontWeight: 700 }}>
      <Minus size={12} /> Sama dengan minggu lalu
    </span>
  )
}

export default function AnalyticsPage() {
  const { isPro, loading: limitLoading } = usePlanLimit()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics/summary', { cache: 'no-store' })
        if (res.ok) {
          const summary = await res.json()
          setData(summary)
        } else {
          setData(defaultEmptyAnalytics)
        }
      } catch (err) {
        console.error('Failed to load analytics data', err)
        setData(defaultEmptyAnalytics)
      } finally {
        setLoading(false)
      }
    }
    if (!limitLoading) fetchAnalytics()
  }, [limitLoading])

  if (limitLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#f97316' }} className="animate-spin" />
      </div>
    )
  }

  const d = data || defaultEmptyAnalytics
  const chartData = d.views_per_day.map(v => ({ label: v.label, value: v.count }))
  const hasViews = d.total_views > 0 || d.total_this_month > 0

  // Hourly chart — group into 6 time blocks
  const timeBlocks = [
    { label: 'Dini Hari\n00–05', hours: [0,1,2,3,4,5] },
    { label: 'Pagi\n06–10', hours: [6,7,8,9,10] },
    { label: 'Siang\n11–14', hours: [11,12,13,14] },
    { label: 'Sore\n15–17', hours: [15,16,17] },
    { label: 'Malam\n18–21', hours: [18,19,20,21] },
    { label: 'Tengah\nMalam 22–23', hours: [22,23] },
  ]
  const hourlyBlockData = timeBlocks.map(block => ({
    label: block.label.split('\n')[0],
    sublabel: block.label.split('\n')[1],
    value: block.hours.reduce((sum, h) => sum + (d.hourly_distribution.find(hd => hd.hour === h)?.count ?? 0), 0),
  }))

  const maxHourlyVal = Math.max(...hourlyBlockData.map(b => b.value), 1)

  // Top menu total for percentage bar
  const maxMenuViews = d.top_menus[0]?.view_count ?? 1

  const formatHour = (h: number) => {
    const suffix = h < 12 ? 'pagi' : h < 17 ? 'siang' : 'malam'
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${h12}:00 ${suffix}`
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '80vh' }}>

      {/* ── Blurred content for non-Pro ────────────────────────────────── */}
      <div style={{
        filter: isPro ? 'none' : 'blur(5px)',
        pointerEvents: isPro ? 'auto' : 'none',
        userSelect: isPro ? 'auto' : 'none',
        transition: 'filter 0.3s',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Analitik</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Lihat seberapa ramai pelanggan buka menu digital kamu dan menu mana yang paling sering dilihat.
          </p>
        </div>

        {/* ── Empty State (no views yet) ────────────────────────────── */}
        {!hasViews && isPro && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <QrCode size={18} color="#f97316" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>Belum ada data kunjungan</p>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Tempel QR code di meja pelanggan, nanti data scan masuk otomatis ke sini.</p>
              </div>
            </div>
            <Link href="/dashboard/qr" className="btn btn-secondary btn-sm" style={{ fontSize: 13 }}>
              Buka QR Code
            </Link>
          </div>
        )}

        {/* ── KPI Cards Row ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          
          {/* Today */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Kunjungan Hari Ini</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={15} color="#f97316" />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{d.total_today}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Scan QR hari ini</div>
          </div>

          {/* This Week vs Last Week */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Minggu Ini</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#16a34a" />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{d.total_this_week}</div>
            <div style={{ marginTop: 6 }}>
              <DeltaBadge current={d.total_this_week} previous={d.total_last_week} />
            </div>
          </div>

          {/* This Month */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Bulan Ini</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={15} color="#3b82f6" />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{d.total_this_month}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Kunjungan bulan berjalan</div>
          </div>

          {/* Peak Hour */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Jam Tersibuk</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={15} color="#a855f7" />
              </div>
            </div>
            {d.peak_hour ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {formatHour(d.peak_hour.hour)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                  {d.peak_hour.count} kunjungan di jam ini
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#94a3b8', lineHeight: 1 }}>—</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Belum ada data</div>
              </>
            )}
          </div>

          {/* Outlet Stats */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Katalog Menu</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={15} color="#64748b" />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{d.stats.available_count}<span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>/{d.stats.menu_count}</span></div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Item tersedia / total</div>
          </div>
        </div>

        {/* ── 2-Column Grid: Daily Chart + Hourly Distribution ─────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>

          {/* Daily Chart (7 days) */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Kunjungan 7 Hari Terakhir</h3>
                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Total pemindaian QR Code per hari</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <BarChart2 size={13} color="#f97316" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>7 Hari</span>
              </div>
            </div>
            <BarChart data={chartData} />
          </div>

          {/* Hourly Distribution */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Distribusi Waktu Kunjungan</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Pola jam ramai pelanggan (30 hari terakhir)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hourlyBlockData.map((block, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, fontSize: 11, color: '#475569', fontWeight: 600, flexShrink: 0, lineHeight: 1.3 }}>
                    {block.label}
                    <br />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>{block.sublabel}</span>
                  </div>
                  <div style={{ flex: 1, height: 14, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(block.value / maxHourlyVal) * 100}%`,
                      background: block.value === maxHourlyVal
                        ? 'linear-gradient(90deg, #f97316, #ea6c0a)'
                        : '#cbd5e1',
                      borderRadius: 8,
                      transition: 'width 0.4s ease',
                      minWidth: block.value > 0 ? 4 : 0,
                    }} />
                  </div>
                  <div style={{ width: 28, fontSize: 12, fontWeight: 700, color: block.value === maxHourlyVal ? '#f97316' : '#64748b', textAlign: 'right', flexShrink: 0 }}>
                    {block.value}
                  </div>
                </div>
              ))}
            </div>
            {d.peak_hour && (
              <div style={{ marginTop: 14, padding: '8px 12px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa' }}>
                <span style={{ fontSize: 12, color: '#9a3412', fontWeight: 600 }}>
                  Pelanggan paling ramai datang pada {formatHour(d.peak_hour.hour)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Top Menu Items ────────────────────────────────────────── */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Menu Paling Sering Dilihat</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Berdasarkan interaksi pelanggan dalam 7 hari terakhir</p>
            </div>
          </div>

          {d.top_menus.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8', fontSize: 13.5 }}>
              Belum ada data interaksi menu yang tercatat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {d.top_menus.map((item, idx) => {
                const pct = Math.round((item.view_count / maxMenuViews) * 100)
                return (
                  <div key={item.menu_item_id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ 
                        width: 24, height: 24, borderRadius: 6,
                        background: idx === 0 ? '#ffedd5' : idx === 1 ? '#f1f5f9' : '#f8fafc',
                        color: idx === 0 ? '#ea580c' : '#64748b',
                        fontSize: 11.5, fontWeight: 700, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                      }}>
                        #{idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', flexShrink: 0, marginLeft: 8 }}>
                            {item.view_count}x dilihat
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ marginLeft: 36, height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: idx === 0
                          ? 'linear-gradient(90deg, #f97316, #ea6c0a)'
                          : idx === 1
                          ? '#fb923c'
                          : '#fdba74',
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Summary Stats Row ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          {[
            { label: 'Total Menu', value: d.stats.menu_count, sub: 'item terdaftar' },
            { label: 'Menu Tersedia', value: d.stats.available_count, sub: 'siap dipesan' },
            { label: 'Kategori', value: d.stats.category_count, sub: 'kelompok menu' },
            { label: 'Outlet Aktif', value: d.stats.outlet_count, sub: 'outlet Anda' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
              <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Upgrade Wall Overlay ──────────────────────────────────────── */}
      {!isPro && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, padding: '24px 16px',
        }}>
          <div style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)', borderRadius: 24 }}>
            <UpgradeWall feature="analytics" />
          </div>
        </div>
      )}
    </div>
  )
}
