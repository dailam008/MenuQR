import { createClient } from '@/lib/supabase/server'
import { getActiveOutlet } from '@/lib/supabase/outlet'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { activeOutlet, outlets, isPro } = await getActiveOutlet(supabase, user)

    return NextResponse.json({
      outlets,
      activeOutletId: activeOutlet?.id || null,
      isPro
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
