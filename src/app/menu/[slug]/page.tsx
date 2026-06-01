import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Outlet, Category, MenuItem } from '@/types/database'
import MenuPublicClient from './MenuPublicClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: outletData } = await supabase
    .from('outlets').select('name, description').eq('slug', slug).single()
  const outlet = outletData as Pick<Outlet, 'name' | 'description'> | null

  if (!outlet) return { title: 'Menu tidak ditemukan' }
  return {
    title: `Menu ${outlet.name}`,
    description: outlet.description || `Lihat menu lengkap ${outlet.name} di sini.`,
  }
}

export default async function PublicMenuPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Get outlet
  const { data: outletData } = await supabase
    .from('outlets')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!outletData) notFound()
  const outlet = outletData as Outlet


  // Get categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('outlet_id', outlet.id)
    .order('sort_order')

  // Get ALL menu items (both available and unavailable)
  const { data: itemsData } = await supabase
    .from('menu_items')
    .select('*')
    .eq('outlet_id', outlet.id)
    .order('sort_order')

  const allItems = (itemsData ?? []) as MenuItem[]
  const allCategories = (categoriesData ?? []) as Category[]

  return (
    <MenuPublicClient
      outlet={outlet}
      categories={allCategories}
      menuItems={allItems}
    />
  )
}
