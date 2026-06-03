import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MenuItemForm from '../MenuItemForm'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'
import { getActiveOutlet } from '@/lib/supabase/outlet'
import UpgradeWall from '../../components/UpgradeWall'

export const metadata: Metadata = { title: 'Tambah Menu' }

export default async function NewMenuItemPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, authUser)
  if (!outlet) redirect('/dashboard/settings')

  // 1. Fetch user subscription details from DB
  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', authUser.id)
    .maybeSingle()

  const plan = userData?.plan || 'free'

  // 2. Count total menu items
  const { data: outlets } = await supabase
    .from('outlets')
    .select('id')
    .eq('owner_id', authUser.id)

  const outletIds = outlets?.map(o => o.id) || []
  let menuCount = 0

  if (outletIds.length > 0) {
    const { count } = await supabase
      .from('menu_items')
      .select('id', { count: 'exact', head: true })
      .in('outlet_id', outletIds)
    menuCount = count || 0
  }

  // 3. Guard limits
  if (plan === 'free' && menuCount >= 50) {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>Tambah Menu Baru</h1>
        <UpgradeWall feature="menu_item" />
      </div>
    )
  }

  const { data } = await supabase
    .from('categories').select('*').eq('outlet_id', outlet.id).order('sort_order')
  const categories = (data ?? []) as Category[]

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Tambah Menu Baru</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Isi detail item menu yang ingin ditambahkan.</p>
      </div>
      <MenuItemForm outletId={outlet.id} categories={categories} />
    </div>
  )
}
