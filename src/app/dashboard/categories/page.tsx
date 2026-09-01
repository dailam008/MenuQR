import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CategoriesClient from './CategoriesClient'
import type { Metadata } from 'next'
import type { Category } from '@/types/database'
import { getActiveOutlet } from '@/lib/supabase/outlet'

export const metadata: Metadata = { title: 'Kategori Menu' }

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const authUser = user!

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, authUser)


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
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Kategori Menu</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Kelompokkan menu kamu supaya pelanggan lebih mudah cari apa yang mereka mau.</p>
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
