import { SupabaseClient } from '@supabase/supabase-js'

export interface PlanStatus {
  plan: 'free' | 'pro'
  pro_expired_at: string | null
}

/**
 * Checks if a user's Pro plan has expired and performs an automatic downgrade if needed.
 * Returns true if the user was downgraded.
 */
export async function isProExpired(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('plan, pro_expired_at')
      .eq('id', userId)
      .maybeSingle()

    if (error || !userData) {
      return false
    }

    if (userData.plan?.toLowerCase() === 'pro' && userData.pro_expired_at) {
      const expiryTime = new Date(userData.pro_expired_at).getTime()
      if (Date.now() > expiryTime) {
        // 1. Downgrade public.users record
        await supabase
          .from('users')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        // 2. Downgrade Supabase Auth metadata for consistency
        await supabase.auth.updateUser({
          data: { is_pro: false }
        })

        return true
      }
    }
  } catch (e) {
    console.error('Error in isProExpired:', e)
  }
  return false
}

export interface CheckPlanResult {
  allowed: boolean
  error?: string
  message?: string
  upgrade_url?: string
}

/**
 * Validates if the user is allowed to perform a feature/action based on their current plan.
 */
export async function checkPlan(
  supabase: SupabaseClient,
  userId: string,
  feature: 'add_outlet' | 'add_menu_item' | 'custom_domain' | 'analytics' | 'priority_support'
): Promise<CheckPlanResult> {
  // First, perform check to auto-downgrade if expired
  await isProExpired(supabase, userId)

  // Fetch current plan status
  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .maybeSingle()

  const plan = userData?.plan?.toLowerCase() || 'free'

  // Pro-only features check
  if (['custom_domain', 'analytics', 'priority_support'].includes(feature)) {
    if (plan !== 'pro') {
      return {
        allowed: false,
        error: 'PLAN_LIMIT_REACHED',
        message: 'Fitur ini khusus pengguna plan Pro. Upgrade ke Pro untuk menikmati akses penuh.',
        upgrade_url: '/upgrade'
      }
    }
    return { allowed: true }
  }

  // Count active outlets owned by user
  if (feature === 'add_outlet') {
    const { count, error } = await supabase
      .from('outlets')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', userId)

    if (error) {
      return { allowed: false, message: 'Gagal memvalidasi limitasi plan.' }
    }

    const currentOutlets = count || 0
    const limit = plan?.toLowerCase() === 'pro' ? 5 : 1

    if (currentOutlets >= limit) {
      return {
        allowed: false,
        error: 'PLAN_LIMIT_REACHED',
        message: plan?.toLowerCase() === 'pro' 
          ? 'Kamu sudah mencapai batas maksimal 5 outlet untuk plan Pro.'
          : 'Kamu sudah mencapai batas plan Gratis (maksimal 1 outlet). Upgrade ke Pro untuk mengelola hingga 5 outlet.',
        upgrade_url: '/upgrade'
      }
    }
  }

  // Count total menu items across all outlets owned by user
  if (feature === 'add_menu_item') {
    // 1. Get all outlets owned by this user
    const { data: outlets } = await supabase
      .from('outlets')
      .select('id')
      .eq('owner_id', userId)

    const outletIds = outlets?.map(o => o.id) || []

    if (outletIds.length === 0) {
      // No outlets yet, technically cannot add a menu item but let other validations catch this
      return { allowed: true }
    }

    // 2. Count menu items in those outlets
    const { count, error } = await supabase
      .from('menu_items')
      .select('id', { count: 'exact', head: true })
      .in('outlet_id', outletIds)

    if (error) {
      return { allowed: false, message: 'Gagal memvalidasi limitasi menu.' }
    }

    const currentMenus = count || 0

    // Free plan limit is 50. Pro has unlimited menu items.
    if (plan === 'free' && currentMenus >= 50) {
      return {
        allowed: false,
        error: 'PLAN_LIMIT_REACHED',
        message: 'Kamu sudah mencapai batas plan Gratis (maksimal 50 menu item). Upgrade ke Pro untuk upload menu sepuasnya tanpa batas.',
        upgrade_url: '/upgrade'
      }
    }
  }

  return { allowed: true }
}
