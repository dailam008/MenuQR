import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OutletSettingsForm from './OutletSettingsForm'
import type { Metadata } from 'next'
import type { Outlet } from '@/types/database'

export const metadata: Metadata = { title: 'Pengaturan Outlet' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outletData } = await supabase
    .from('outlets')
    .select('*')
    .eq('owner_id', authUser.id)
    .single()

  const outlet = (outletData ?? null) as Outlet | null

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          {outlet ? 'Pengaturan Outlet' : 'Buat Outlet'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          {outlet ? 'Edit informasi warung Anda.' : 'Isi data warung Anda untuk mulai.'}
        </p>
      </div>
      <OutletSettingsForm outlet={outlet} userId={authUser.id} />
    </div>
  )
}
