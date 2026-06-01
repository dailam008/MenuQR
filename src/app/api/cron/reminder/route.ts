import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { sendEmail, getReminderEmailHtml } from '@/lib/email'

/**
 * GET /api/cron/reminder
 * Background job to send reminder emails to owners who registered 24-48 hours ago
 * but haven't created an outlet yet.
 * Securely authenticated via CRON_SECRET header or query parameter.
 */
export async function GET(req: NextRequest) {
  // 1. Simple security validation
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = 
    !cronSecret || // Skip check in dev if CRON_SECRET is not set
    authHeader === `Bearer ${cronSecret}` ||
    req.nextUrl.searchParams.get('key') === cronSecret

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized CRON trigger' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // If Supabase Admin details are missing (e.g. locally in dev), warn and skip gracefully
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('⚠️ CRON Warning: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing. Onboarding reminder cron is bypassed in development.')
    return NextResponse.json({
      message: 'CRON reminder skipped: Supabase Service Role credentials not configured.',
      success: true,
      developmentMode: true
    })
  }

  // Initialize Supabase Admin client to select from auth.users (requires service role key)
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 2. Fetch users list via Auth Admin API
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found in database.', sentCount: 0 })
    }

    // Filter users who registered between 24 and 48 hours ago
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const twoDaysAgo = now - 48 * 60 * 60 * 1000

    const targetUsers = users.filter((u) => {
      const regTime = new Date(u.created_at).getTime()
      return regTime >= twoDaysAgo && regTime <= oneDayAgo
    })

    if (targetUsers.length === 0) {
      return NextResponse.json({
        message: 'No users signed up in the 24-48 hour window.',
        totalUsersChecked: users.length,
        sentCount: 0
      })
    }

    let sentCount = 0

    // 3. Check each user if they've created an outlet
    for (const user of targetUsers) {
      const { data: outlet } = await supabaseAdmin
        .from('outlets')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

      // If they haven't created an outlet, send the reminder email!
      if (!outlet && user.email) {
        const fullName = user.user_metadata?.full_name || 'Mitra MenuQR'
        const htmlBody = getReminderEmailHtml(fullName)
        
        const emailResult = await sendEmail({
          to: user.email,
          subject: `Menu digital warungmu belum aktif, ${fullName} 🏪`,
          html: htmlBody
        })

        if (emailResult.success) {
          sentCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding inactive reminder processing complete.',
      usersChecked: targetUsers.length,
      emailsSent: sentCount
    })

  } catch (error: any) {
    console.error('❌ CRON Onboarding Reminder failed:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
