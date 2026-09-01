import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QRCodeDisplay from './QRCodeDisplay'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Outlet } from '@/types/database'
import { getActiveOutlet } from '@/lib/supabase/outlet'

export const metadata: Metadata = { title: 'QR Code Outlet' }

export default async function QRPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, authUser)

  if (!outlet) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 20 }}>QR Code</h1>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: 16 }}>Buat outlet dulu sebelum bisa generate QR Code.</p>
          <Link href="/dashboard/settings" className="btn btn-primary">Buat Outlet</Link>
        </div>
      </div>
    )
  }


  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>QR Code Outlet</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Cetak dan tempel QR code ini di meja, etalase, atau pintu masuk warung kamu.</p>
      </div>
      <QRCodeDisplay outlet={outlet} />
    </div>
  )
}
