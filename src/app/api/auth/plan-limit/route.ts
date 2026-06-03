import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isProExpired } from '@/lib/plan-gate'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Auto-downgrade check
    await isProExpired(supabase, user.id)

    // Fetch plan status from database
    const { data: userData } = await supabase
      .from('users')
      .select('plan, pro_expired_at')
      .eq('id', user.id)
      .maybeSingle()

    const plan = userData?.plan || 'free'
    const proExpiredAt = userData?.pro_expired_at || null

    // Count outlets
    const { count: outletCount } = await supabase
      .from('outlets')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    // Count menu items across all outlets owned by this user
    const { data: outlets } = await supabase
      .from('outlets')
      .select('id')
      .eq('owner_id', user.id)

    const outletIds = outlets?.map(o => o.id) || []
    let menuCount = 0

    if (outletIds.length > 0) {
      const { count } = await supabase
        .from('menu_items')
        .select('id', { count: 'exact', head: true })
        .in('outlet_id', outletIds)
      
      menuCount = count || 0
    }

    return NextResponse.json({
      plan,
      outletCount: outletCount || 0,
      menuCount,
      proExpiredAt
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
