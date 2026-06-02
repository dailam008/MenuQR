import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OutletSettingsForm from '../OutletSettingsForm'
import LimitBlocker from '../../components/LimitBlocker'
import { getActiveOutlet } from '@/lib/supabase/outlet'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Buat Outlet Baru' }

export default async function NewOutletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { outlets, isPro } = await getActiveOutlet(supabase, user)

  // Guard limits
  if (!isPro && outlets.length >= 1) {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>Tambah Outlet Baru</h1>
        <LimitBlocker limitType="free" currentCount={outlets.length} />
      </div>
    )
  }

  if (isPro && outlets.length >= 5) {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>Tambah Outlet Baru</h1>
        <LimitBlocker limitType="pro" currentCount={outlets.length} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          Tambah Outlet Baru
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Buat outlet tambahan untuk mengelola menu cabang baru Anda.
        </p>
      </div>
      <OutletSettingsForm outlet={null} userId={user.id} />
    </div>
  )
}
