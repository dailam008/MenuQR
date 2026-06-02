import { SupabaseClient, User } from '@supabase/supabase-js'
import type { Outlet } from '@/types/database'

export async function getActiveOutlet(supabase: SupabaseClient, user: User) {
  const activeId = user.user_metadata?.active_outlet_id
  const isPro = user.user_metadata?.is_pro === true

  // Fetch all outlets owned by this user
  const { data: allOutlets } = await supabase
    .from('outlets')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  const outlets = (allOutlets ?? []) as Outlet[]

  let activeOutlet: Outlet | null = null
  if (activeId) {
    activeOutlet = outlets.find(o => o.id === activeId) || null
  }

  // Fallback to the first outlet if activeOutlet is not found or not set
  if (!activeOutlet && outlets.length > 0) {
    activeOutlet = outlets[0]
    
    // Attempt to update user metadata in the background to lock in this active outlet
    try {
      await supabase.auth.updateUser({
        data: { active_outlet_id: activeOutlet.id }
      })
    } catch (e) {
      console.warn("Could not update user active_outlet_id metadata in getActiveOutlet:", e)
    }
  }

  return {
    activeOutlet,
    outlets,
    isPro
  }
}
