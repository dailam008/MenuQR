import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isPro } = await request.json()
    if (typeof isPro !== 'boolean') {
      return NextResponse.json({ error: 'Status isPro bertipe boolean diperlukan.' }, { status: 400 })
    }

    // Update user metadata
    const { error: updateErr } = await supabase.auth.updateUser({
      data: { ...user.user_metadata, is_pro: isPro }
    })

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
