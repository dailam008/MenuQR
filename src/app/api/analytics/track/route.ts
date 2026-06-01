import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { outlet_id, menu_item_id } = await req.json()
    if (!outlet_id) return NextResponse.json({ error: 'Missing outlet_id' }, { status: 400 })

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const userAgent = req.headers.get('user-agent') || undefined
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    const { error } = await (supabase.from('menu_views') as any).insert({
      outlet_id,
      menu_item_id: menu_item_id || null,
      user_agent: userAgent,
      ip_hash: ipHash,
    })

    if (error) {
      console.error('Analytics tracking error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Failed to track view:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
