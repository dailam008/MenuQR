import { createClient } from '@/lib/supabase/server'
import { getActiveOutlet } from '@/lib/supabase/outlet'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/summary
 * Authenticated — returns analytics and stats for the owner's outlet.
 * Includes: daily views (7d), top menus, KPI totals, peak hour, 30d summary, week-over-week delta
 */
export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { activeOutlet: outlet } = await getActiveOutlet(supabase, user)

  if (!outlet) {
    return NextResponse.json({
      error: 'Outlet not found',
      stats: { menu_count: 0, available_count: 0, category_count: 0, outlet_count: 0 },
      views_per_day: [],
      top_menus: [],
      total_views: 0,
      total_today: 0,
      total_this_week: 0,
      total_last_week: 0,
      total_this_month: 0,
      peak_hour: null,
      hourly_distribution: [],
    })
  }

  // ── Fetch Stats ──────────────────────────────────────────────────────────
  const [{ count: menuCount }, { count: availableCount }, { count: categoryCount }, { count: outletCount }] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id).eq('is_available', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('outlet_id', outlet.id),
    supabase.from('outlets').select('*', { count: 'exact', head: true }).eq('owner_id', user.id),
  ])

  // ── Date Ranges ──────────────────────────────────────────────────────────
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  // Last 7 days
  const days7: { date: string; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days7.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
    })
  }
  const since7 = days7[0].date + 'T00:00:00.000Z'

  // This week vs last week (Mon–Sun)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon = 0
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - dayOfWeek)
  thisWeekStart.setHours(0, 0, 0, 0)

  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setMilliseconds(-1)

  // This month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // ── Fetch All Views (30 days) ─────────────────────────────────────────────
  const since30 = new Date(now)
  since30.setDate(now.getDate() - 29)
  since30.setHours(0, 0, 0, 0)

  const { data: allViews } = await (supabase.from('menu_views') as any)
    .select('viewed_at, menu_item_id')
    .eq('outlet_id', outlet.id)
    .gte('viewed_at', since30.toISOString())

  const pageViews: { viewed_at: string }[] = ((allViews ?? []) as any[]).filter((v: any) => !v.menu_item_id)
  const itemViews: { menu_item_id: string; viewed_at: string }[] = ((allViews ?? []) as any[]).filter((v: any) => v.menu_item_id)

  // ── 7-Day Daily Aggregation ───────────────────────────────────────────────
  const countsByDate: Record<string, number> = {}
  for (const v of pageViews) {
    const d = v.viewed_at.slice(0, 10)
    if (d >= days7[0].date) {
      countsByDate[d] = (countsByDate[d] || 0) + 1
    }
  }
  const views_per_day = days7.map(d => ({
    date: d.date,
    label: d.label,
    count: countsByDate[d.date] ?? 0,
  }))

  // ── Totals ────────────────────────────────────────────────────────────────
  const total_today = countsByDate[todayStr] ?? 0

  const total_this_week = pageViews.filter(v =>
    new Date(v.viewed_at) >= thisWeekStart
  ).length

  const total_last_week = pageViews.filter(v => {
    const t = new Date(v.viewed_at)
    return t >= lastWeekStart && t <= lastWeekEnd
  }).length

  const total_this_month = pageViews.filter(v =>
    v.viewed_at >= thisMonthStart
  ).length

  const total_views = pageViews.filter(v => v.viewed_at >= since7).length

  // ── Peak Hour Analysis ────────────────────────────────────────────────────
  const hourCounts: Record<number, number> = {}
  for (let h = 0; h < 24; h++) hourCounts[h] = 0
  for (const v of pageViews) {
    const hour = new Date(v.viewed_at).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  }

  const hourly_distribution = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    label: `${String(h).padStart(2, '0')}:00`,
    count: hourCounts[h],
  }))

  const peak_hour_entry = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]
  const peak_hour = peak_hour_entry && parseInt(peak_hour_entry[1] as unknown as string) > 0
    ? { hour: parseInt(peak_hour_entry[0]), count: parseInt(peak_hour_entry[1] as unknown as string) }
    : null

  // ── Top Menu Items (7 days) ───────────────────────────────────────────────
  const itemCounts: Record<string, number> = {}
  for (const v of itemViews) {
    if (v.viewed_at >= since7 && v.menu_item_id) {
      itemCounts[v.menu_item_id] = (itemCounts[v.menu_item_id] || 0) + 1
    }
  }

  const topIds = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  let top_menus: { menu_item_id: string; name: string; image_url: string | null; price: number; view_count: number }[] = []

  if (topIds.length > 0) {
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, name, image_url, price')
      .in('id', topIds)

    top_menus = (menuItems ?? []).map(m => ({
      menu_item_id: m.id,
      name: m.name,
      image_url: m.image_url,
      price: m.price,
      view_count: itemCounts[m.id] ?? 0,
    })).sort((a, b) => b.view_count - a.view_count)
  }

  return NextResponse.json({
    stats: {
      menu_count: menuCount ?? 0,
      available_count: availableCount ?? 0,
      category_count: categoryCount ?? 0,
      outlet_count: outletCount ?? 0,
    },
    views_per_day,
    top_menus,
    total_views,
    total_today,
    total_this_week,
    total_last_week,
    total_this_month,
    peak_hour,
    hourly_distribution,
  })
}
