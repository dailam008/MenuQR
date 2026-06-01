import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import MenuClientPage from './MenuClientPage'
import type { Metadata } from 'next'
import type { Category, MenuItem } from '@/types/database'

export const metadata: Metadata = { title: 'Menu Saya' }

type MenuItemWithCategory = MenuItem & { categories: { name: string } | null }

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outlet } = await supabase
    .from('outlets').select('*').eq('owner_id', authUser.id).single()

  if (!outlet) {
    return (
      <div className="animate-fade-in">
        <div className="empty-state">
          <div className="empty-state-icon"><Plus size={28} /></div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Buat outlet dulu</h2>
          <p style={{ marginBottom: 20 }}>Sebelum menambah menu, buat outlet Anda terlebih dahulu.</p>
          <Link href="/dashboard/settings" className="btn btn-primary">Buat Outlet</Link>
        </div>
      </div>
    )
  }

  const { data: rawItems } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .eq('outlet_id', outlet.id)
    .order('sort_order', { ascending: true })

  const items = (rawItems ?? []) as MenuItemWithCategory[]

  const { data: categories } = await supabase
    .from('categories').select('*').eq('outlet_id', outlet.id).order('sort_order')
  const cats = (categories ?? []) as Category[]

  return <MenuClientPage items={items} categories={cats} outletId={outlet.id} />
}
