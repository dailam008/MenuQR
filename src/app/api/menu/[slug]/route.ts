import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * GET /api/menu/:slug
 * Public API endpoint — no auth required.
 * Returns outlet info + categories + available menu items grouped.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // Get outlet
  const { data: outlet, error: outletErr } = await supabase
    .from('outlets')
    .select('id, name, slug, address, description, logo_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (outletErr || !outlet) {
    return NextResponse.json(
      { error: 'Outlet tidak ditemukan', slug },
      { status: 404 }
    )
  }

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, sort_order')
    .eq('outlet_id', outlet.id)
    .order('sort_order')

  // Get available menu items
  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, description, price, image_url, category_id, sort_order')
    .eq('outlet_id', outlet.id)
    .eq('is_available', true)
    .order('sort_order')

  const cats = categories ?? []
  const menuItems = items ?? []

  // Group items by category
  const grouped = cats.map(cat => ({
    ...cat,
    items: menuItems.filter(item => item.category_id === cat.id),
  })).filter(cat => cat.items.length > 0)

  // Uncategorized items
  const uncategorized = menuItems.filter(item => !item.category_id)
  if (uncategorized.length > 0) {
    grouped.push({
      id: null as unknown as string,
      name: 'Lainnya',
      sort_order: 9999,
      items: uncategorized,
    })
  }

  return NextResponse.json(
    {
      outlet,
      menu: grouped,
      total_items: menuItems.length,
    },
    {
      status: 200,
      headers: {
        // Cache for 60s on CDN, revalidate in background
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
