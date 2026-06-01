import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * GET /api/analytics/summary
 * Authenticated — returns analytics and stats for the owner's outlet.
 */
export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: outlet } = await supabase
    .from('outlets')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!outlet) {
    return NextResponse.json({
      error: 'Outlet not found',
      stats: {
        menu_count: 0,
        available_count: 0,
        category_count: 0,
        outlet_active: false
      },
      views_per_day: [],
      top_menus: []
    })
  }

  // Fetch Stats
  const [{ count: menuCount }, { count: availableCount }, { count: categoryCount }] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id).eq('is_available', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id),
  ])

  // Build last-7-days date range
  const today = new Date()
  const days: { date: string; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('id-ID', { weekday: 'short' })
    days.push({ date: iso, label })
  }

  // Fetch daily view counts
  const since = days[0].date + 'T00:00:00.000Z'
  const { data: rawViews } = await (supabase
    .from('menu_views') as any)
    .select('viewed_at')
    .eq('outlet_id', outlet.id)
    .gte('viewed_at', since)
    .is('menu_item_id', null) // only page-level views (not item-level)

  // Aggregate per day
  const countsByDate: Record<string, number> = {}
  for (const v of (rawViews as any[]) ?? []) {
    const d = v.viewed_at.slice(0, 10)
    countsByDate[d] = (countsByDate[d] || 0) + 1
  }

  const views_per_day = days.map(d => ({
    date:  d.date,
    label: d.label,
    count: countsByDate[d.date] ?? 0,
  }))

  const total_views = (rawViews ?? []).length

  // Fetch top menu items by view count
  const { data: itemViews } = await (supabase
    .from('menu_views') as any)
    .select('menu_item_id')
    .eq('outlet_id', outlet.id)
    .not('menu_item_id', 'is', null)
    .gte('viewed_at', since)

  // Count per item
  const itemCounts: Record<string, number> = {}
  for (const v of (itemViews as any[]) ?? []) {
    if (v.menu_item_id) {
      itemCounts[v.menu_item_id] = (itemCounts[v.menu_item_id] || 0) + 1
    }
  }

  // Sort top 3
  const topIds = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id)

  let top_menus: { menu_item_id: string; name: string; image_url: string | null; price: number; view_count: number }[] = []

  if (topIds.length > 0) {
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, name, image_url, price')
      .in('id', topIds)

    top_menus = (menuItems ?? []).map(m => ({
      menu_item_id: m.id,
      name:         m.name,
      image_url:    m.image_url,
      price:        m.price,
      view_count:   itemCounts[m.id] ?? 0,
    })).sort((a, b) => b.view_count - a.view_count)
  }

  return NextResponse.json({
    stats: {
      menu_count: menuCount ?? 0,
      available_count: availableCount ?? 0,
      category_count: categoryCount ?? 0,
      outlet_active: outlet ? true : false,
    },
    views_per_day,
    top_menus,
    total_views,
    total_today: countsByDate[today.toISOString().slice(0, 10)] ?? 0,
  })
}
