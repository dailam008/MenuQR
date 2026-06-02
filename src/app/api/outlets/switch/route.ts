import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID outlet diperlukan.' }, { status: 400 })
    }

    // Verify user owns this outlet
    const { data: outlet } = await supabase
      .from('outlets')
      .select('id')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (!outlet) {
      return NextResponse.json({ error: 'Outlet tidak ditemukan atau akses ditolak.' }, { status: 404 })
    }

    // Update user metadata
    const { error: updateErr } = await supabase.auth.updateUser({
      data: { ...user.user_metadata, active_outlet_id: id }
    })

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
