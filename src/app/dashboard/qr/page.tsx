import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QRCodeDisplay from './QRCodeDisplay'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Outlet } from '@/types/database'

export const metadata: Metadata = { title: 'QR Code Outlet' }

export default async function QRPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outletData } = await supabase
    .from('outlets').select('*').eq('owner_id', authUser.id).single()

  if (!outletData) {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>QR Code</h1>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: 16 }}>Buat outlet terlebih dahulu untuk generate QR Code.</p>
          <Link href="/dashboard/settings" className="btn btn-primary">Buat Outlet</Link>
        </div>
      </div>
    )
  }

  const outlet = outletData as Outlet

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>QR Code</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Download dan cetak QR code ini untuk dipasang di meja pelanggan.</p>
      </div>
      <QRCodeDisplay outlet={outlet} />
    </div>
  )
}
