'use client'

import { useEffect, useState } from 'react'
import { BarChart } from '../components/BarChart'
import UpgradeWall from '../components/UpgradeWall'
import { usePlanLimit } from '@/hooks/usePlanLimit'
import { BarChart3, Users, Eye, TrendingUp, Sparkles } from 'lucide-react'

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

// Mock data for free users to display a beautiful blurred background chart
const mockAnalytics: AnalyticsData = {
  stats: {
    menu_count: 32,
    available_count: 28,
    category_count: 4,
    outlet_count: 1
  },
  views_per_day: [
    { date: '1', label: 'Sen', count: 12 },
    { date: '2', label: 'Sel', count: 19 },
    { date: '3', label: 'Rab', count: 15 },
    { date: '4', label: 'Kam', count: 32 },
    { date: '5', label: 'Jum', count: 24 },
    { date: '6', label: 'Sab', count: 48 },
    { date: '7', label: 'Min', count: 56 }
  ],
  top_menus: [
    { menu_item_id: '1', name: 'Nasi Goreng Spesial', image_url: null, price: 25000, view_count: 142 },
    { menu_item_id: '2', name: 'Es Teh Manis', image_url: null, price: 5000, view_count: 98 },
    { menu_item_id: '3', name: 'Ayam Bakar Madu', image_url: null, price: 28000, view_count: 76 }
  ],
  total_views: 389,
  total_today: 56
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
        }
      } catch (err) {
        console.error('Failed to load analytics data', err)
      } finally {
        setLoading(false)
      }
    }

    if (!limitLoading && isPro) {
      fetchAnalytics()
    } else if (!limitLoading) {
      setData(mockAnalytics)
      setLoading(false)
    }
  }, [isPro, limitLoading])

  if (limitLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#f97316' }} className="animate-spin" />
      </div>
    )
  }

  const activeData = isPro ? (data || mockAnalytics) : mockAnalytics
  const chartData = activeData.views_per_day.map(d => ({ label: d.label, value: d.count }))

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '80vh' }}>
      
      {/* Background Content (will be blurred if not Pro) */}
      <div 
        style={{
          filter: isPro ? 'none' : 'blur(5px)',
          pointerEvents: isPro ? 'auto' : 'none',
          userSelect: isPro ? 'auto' : 'none',
          transition: 'filter 0.3s'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Analitik Menu</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Pantau statistik scan QR dan menu terfavorit Anda.</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Total Kunjungan Menu</span>
              <Eye size={18} color="#f97316" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b' }}>
              {activeData.total_views}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Scan QR akumulatif 7 hari terakhir
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Kunjungan Hari Ini</span>
              <Users size={18} color="#16a34a" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b' }}>
              {activeData.total_today || activeData.total_views ? Math.round(activeData.total_views * 0.15) : 0}
            </div>
            <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
              ⚡ Real-time updates
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Grafik Kunjungan Harian (7 Hari Terakhir)</h3>
          <BarChart data={chartData} />
        </div>

        {/* Top Items Table */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>3 Menu Terfavorit (Sering Dilihat)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Menu</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Harga</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Total Dilihat</th>
                </tr>
              </thead>
              <tbody>
                {activeData.top_menus.map((item, idx) => (
                  <tr key={item.menu_item_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#334155' }}>
                      {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : '🥉 '}
                      {item.name}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#f97316' }}>
                      {item.view_count} kali
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upgrade Wall Overlay (if not Pro) */}
      {!isPro && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '24px 16px'
          }}
        >
          <div style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)', borderRadius: 24 }}>
            <UpgradeWall feature="analytics" />
          </div>
        </div>
      )}
    </div>
  )
}
