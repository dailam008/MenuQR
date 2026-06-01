import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardClient from './DashboardClient'
import type { Outlet } from '@/types/database'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outlet } = await supabase
    .from('outlets')
    .select('*')
    .eq('owner_id', authUser.id)
    .single()

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pemilik'
  const greeting = new Date().getHours() < 12 ? 'Selamat pagi' : new Date().getHours() < 17 ? 'Selamat siang' : 'Selamat malam'

  return (
    <DashboardClient
      fullName={fullName}
      greeting={greeting}
      initialOutlet={outlet as Outlet | null}
    />
  )
}
