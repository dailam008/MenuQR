import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Outlet, Category, MenuItem } from '@/types/database'
import MenuPublicClient from './MenuPublicClient'

interface Props {
  params: Promise<{ slug: string }>
}

// Simple anon client — no cookie/session overhead for public pages
function getAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = getAnonClient()
  const { data } = await supabase
    .from('outlets')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!data) return { title: 'Menu tidak ditemukan' }
  return {
    title: `Menu ${data.name}`,
    description: data.description || `Lihat menu lengkap ${data.name} di sini.`,
  }
}

export default async function PublicMenuPage({ params }: Props) {
  const { slug } = await params
  const supabase = getAnonClient()

  // Get outlet first
  const { data: outletData, error: outletError } = await supabase
    .from('outlets')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (outletError || !outletData) notFound()
  const outlet = outletData as Outlet

  // Fetch categories and items in parallel
  const [{ data: categoriesData }, { data: itemsData }] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('outlet_id', outlet.id)
      .order('sort_order'),
    supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
      .order('sort_order'),
  ])

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
