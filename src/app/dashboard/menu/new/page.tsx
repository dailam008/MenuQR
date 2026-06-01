import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MenuItemForm from '../MenuItemForm'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'

export const metadata: Metadata = { title: 'Tambah Menu' }

export default async function NewMenuItemPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outlet } = await supabase
    .from('outlets').select('*').eq('owner_id', authUser.id).single()
  if (!outlet) redirect('/dashboard/settings')

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
