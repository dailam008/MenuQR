import { createAdminClient } from '@/lib/supabase/admin'
import { sendReminderEmail, sendDowngradeEmail } from '@/lib/email-templates'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/plan-check
 * Daily cron job executing:
 * 1. Pro plan reminder H-7 emails.
 * 2. Pro plan auto-downgrades for expired users.
 * 
 * Authenticated via CRON_SECRET authorization header or key parameter.
 */
export async function GET(req: NextRequest) {
  // 1. Simple security validation
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  const isAuthorized = 
    !cronSecret || // Bypassed if CRON_SECRET is not configured in dev
    authHeader === `Bearer ${cronSecret}` ||
    req.nextUrl.searchParams.get('key') === cronSecret

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized CRON trigger' }, { status: 401 })
  }

  const supabaseAdmin = createAdminClient()
  
  const results = {
    reminder_h7: { processed: 0, failed: 0, status: 'success', message: '' },
    auto_downgrade: { processed: 0, failed: 0, status: 'success', message: '' }
  }

  // ==========================================
  // CRON 1: REMINDER H-7 EXPIRED
  // ==========================================
  try {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)

    const targetDateStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0).toISOString()
    const targetDateEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59).toISOString()

    // Select all Pro merchants expiring in exactly 7 days
    const { data: expiringUsers, error: fetchExpiringError } = await supabaseAdmin
      .from('users')
      .select('id, email, pro_expired_at')
      .eq('plan', 'pro')
      .gte('pro_expired_at', targetDateStart)
      .lte('pro_expired_at', targetDateEnd)

    if (fetchExpiringError) throw fetchExpiringError

    if (expiringUsers && expiringUsers.length > 0) {
      for (const merchant of expiringUsers) {
        if (!merchant.email) continue

        // Fetch auth details for name metadata
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(merchant.id)
        const displayName = authUser?.user?.user_metadata?.full_name || merchant.email.split('@')[0]

        try {
          await sendReminderEmail(
            merchant.email,
            displayName,
            new Date(merchant.pro_expired_at!),
            7
          )
          results.reminder_h7.processed += 1
        } catch (emailErr) {
          console.error(`Failed to send H-7 reminder to ${merchant.email}:`, emailErr)
          results.reminder_h7.failed += 1
        }
      }
    }

    // Save success log to cron_logs
    await supabaseAdmin.from('cron_logs').insert({
      cron_name: 'reminder_h7',
      users_affected: results.reminder_h7.processed,
      status: 'success',
      log_message: `Sent H-7 reminders to ${results.reminder_h7.processed} users. Failures: ${results.reminder_h7.failed}.`
    })

  } catch (err: any) {
    console.error('Error in Cron 1 (Reminder H-7):', err)
    results.reminder_h7.status = 'failed'
    results.reminder_h7.message = err.message

    try {
      await supabaseAdmin.from('cron_logs').insert({
        cron_name: 'reminder_h7',
        users_affected: 0,
        status: 'failed',
        log_message: `Fatal error: ${err.message}`
      })
    } catch (logErr) {
      console.error('Failed to write failure log to cron_logs:', logErr)
    }
  }

  // ==========================================
  // CRON 2: AUTO DOWNGRADE EXPIRED PRO PLAN
  // ==========================================
  try {
    const nowStr = new Date().toISOString()

    // Select all Pro merchants whose plan has expired
    const { data: expiredUsers, error: fetchExpiredError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('plan', 'pro')
      .lt('pro_expired_at', nowStr)

    if (fetchExpiredError) throw fetchExpiredError

    if (expiredUsers && expiredUsers.length > 0) {
      for (const merchant of expiredUsers) {
        if (!merchant.email) continue

        try {
          // 1. Revert to Free plan in public.users
          const { error: dbUpdateError } = await supabaseAdmin
            .from('users')
            .update({ plan: 'free', updated_at: nowStr })
            .eq('id', merchant.id)

          if (dbUpdateError) throw dbUpdateError

          // 2. Revert Auth metadata is_pro to false for consistency
          const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(merchant.id, {
            user_metadata: { is_pro: false }
          })

          if (authUpdateError) {
            console.warn(`Auth metadata update warning for ${merchant.email}:`, authUpdateError.message)
          }

          // 3. Get name and send email notice
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(merchant.id)
          const displayName = authUser?.user?.user_metadata?.full_name || merchant.email.split('@')[0]

          await sendDowngradeEmail(merchant.email, displayName)

          results.auto_downgrade.processed += 1
        } catch (itemErr: any) {
          console.error(`Failed to downgrade user ${merchant.email}:`, itemErr)
          results.auto_downgrade.failed += 1
        }
      }
    }

    // Save success log to cron_logs
    await supabaseAdmin.from('cron_logs').insert({
      cron_name: 'auto_downgrade',
      users_affected: results.auto_downgrade.processed,
      status: 'success',
      log_message: `Downgraded ${results.auto_downgrade.processed} expired users. Failures: ${results.auto_downgrade.failed}.`
    })

  } catch (err: any) {
    console.error('Error in Cron 2 (Auto Downgrade):', err)
    results.auto_downgrade.status = 'failed'
    results.auto_downgrade.message = err.message

    try {
      await supabaseAdmin.from('cron_logs').insert({
        cron_name: 'auto_downgrade',
        users_affected: 0,
        status: 'failed',
        log_message: `Fatal error: ${err.message}`
      })
    } catch (logErr) {
      console.error('Failed to write failure log to cron_logs:', logErr)
    }
  }

  return NextResponse.json({
    success: results.reminder_h7.status === 'success' && results.auto_downgrade.status === 'success',
    results
  })
}
