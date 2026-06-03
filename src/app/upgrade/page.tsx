import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UpgradeClient from './UpgradeClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade Plan - MenuQR Pro',
  description: 'Upgrade akun MenuQR Anda ke plan Pro untuk mendapatkan akses penuh ke semua fitur premium.',
}

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch full user profile details from public.users for the session name
  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .maybeSingle()

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pemilik'
  const emailAddress = userData?.email || user.email || ''

  const sessionUser = {
    name: displayName,
    email: emailAddress
  }

  return <UpgradeClient user={sessionUser} />
}
