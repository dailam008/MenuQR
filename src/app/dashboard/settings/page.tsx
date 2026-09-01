import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OutletSettingsForm from './OutletSettingsForm'
import type { Metadata } from 'next'
import type { Outlet } from '@/types/database'
import { getActiveOutlet } from '@/lib/supabase/outlet'

export const metadata: Metadata = { title: 'Pengaturan Outlet' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, authUser)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          {outlet ? 'Pengaturan Outlet' : 'Buat Outlet Baru'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          {outlet ? 'Update informasi warung kamu di sini.' : 'Isi data warung kamu untuk mulai jualan digital.'}
        </p>
      </div>
      <OutletSettingsForm outlet={outlet} userId={authUser.id} />
    </div>
  )
}
