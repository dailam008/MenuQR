import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CategoriesClient from './CategoriesClient'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'

export const metadata: Metadata = { title: 'Kategori Menu' }

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { data: outlet } = await supabase
    .from('outlets').select('*').eq('owner_id', authUser.id).single()

  let categories: Category[] = []
  if (outlet) {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('outlet_id', outlet.id)
      .order('sort_order')
    categories = data ?? []
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Kategori Menu</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Organisasi menu Anda berdasarkan kategori (Makanan, Minuman, dll).</p>
      </div>
      {!outlet ? (
        <div className="empty-state">
          <p>Buat outlet terlebih dahulu.</p>
        </div>
      ) : (
        <CategoriesClient outletId={outlet.id} initialCategories={categories} />
      )}
    </div>
  )
}
