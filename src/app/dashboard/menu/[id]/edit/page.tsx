import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import MenuItemForm from '../../MenuItemForm'
import type { Metadata } from 'next'
import type { Category, MenuItem } from '@/types/database'
import { getActiveOutlet } from '@/lib/supabase/outlet'

export const metadata: Metadata = { title: 'Edit Menu' }

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, authUser)
  if (!outlet) redirect('/dashboard/settings')


  const { data: itemData } = await supabase
    .from('menu_items').select('*').eq('id', id).eq('outlet_id', outlet.id).single()
  if (!itemData) notFound()
  const item = itemData as MenuItem

  const { data } = await supabase
    .from('categories').select('*').eq('outlet_id', outlet.id).order('sort_order')
  const categories = (data ?? []) as Category[]

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Edit Menu</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Perbarui informasi item menu.</p>
      </div>
      <MenuItemForm outletId={outlet.id} categories={categories} existingItem={item} />
    </div>
  )
}
