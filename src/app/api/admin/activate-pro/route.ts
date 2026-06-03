import { createAdminClient } from '@/lib/supabase/admin'
import { sendActivationEmail } from '@/lib/email-templates'
import { NextResponse } from 'next/server'

/**
 * PUT /api/admin/activate-pro
 * Admin endpoint to manually activate Pro plan for a merchant.
 * Protected by x-admin-secret header.
 * 
 * Body parameters:
 * - email (string): Email of the merchant to activate.
 * - duration_days (number): Number of days for Pro plan (default 30).
 * 
 * Example Curl:
 * curl -X PUT http://localhost:3000/api/admin/activate-pro \
 *   -H "x-admin-secret: c3b8f2d5e9a4f617b0c9d8e7a6f5e4d3" \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"user@gmail.com","duration_days":30}'
 */
export async function PUT(req: Request) {
  try {
    // 1. Verify admin secret
    const adminSecret = process.env.ADMIN_SECRET
    const reqSecret = req.headers.get('x-admin-secret')

    if (!adminSecret || reqSecret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin secret' }, { status: 401 })
    }

    const { email, duration_days = 30 } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // 2. Find user in public.users by email
    const { data: userData, error: findError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (findError || !userData) {
      return NextResponse.json({ error: 'User not found in public.users table' }, { status: 404 })
    }

    const userId = userData.id
    const now = new Date()
    const expiryDate = new Date(now.getTime() + duration_days * 24 * 60 * 60 * 1000)

    // 3. Update public.users record
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        plan: 'pro',
        pro_started_at: now.toISOString(),
        pro_expired_at: expiryDate.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      throw new Error('Failed to update user plan details in database: ' + updateError.message)
    }

    // 4. Update Supabase Auth metadata for consistency
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { is_pro: true }
    })

    if (authUpdateError) {
      console.warn('Warning: Failed to update auth metadata for user:', authUpdateError.message)
    }

    // 5. Update upgrade_logs status to 'activated'
    const { error: logUpdateError } = await supabaseAdmin
      .from('upgrade_logs')
      .update({ status: 'activated' })
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (logUpdateError) {
      console.warn('Warning: Failed to update upgrade_logs table:', logUpdateError.message)
    }

    // 6. Fetch full user metadata for display name
    const { data: authUser, error: fetchAuthError } = await supabaseAdmin.auth.admin.getUserById(userId)
    const displayName = (!fetchAuthError && authUser?.user?.user_metadata?.full_name) 
      ? authUser.user.user_metadata.full_name 
      : email.split('@')[0]

    // 7. Send Pro Plan activation email to the merchant
    try {
      await sendActivationEmail(email, displayName, now, expiryDate)
    } catch (emailErr) {
      console.error('Failed to send activation email:', emailErr)
    }

    return NextResponse.json({
      success: true,
      user: email,
      plan: 'pro',
      pro_until: expiryDate.toISOString()
    })

  } catch (err: any) {
    console.error('Error in activate-pro:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
