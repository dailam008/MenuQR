import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email } = await req.json()

    const userName = name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pemilik'
    const userEmail = email || user.email || ''

    const wibTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'

    // 1. Send Email Notification to Admin
    const emailSubject = '[MenuQR] Ada User Mau Upgrade Pro!'
    const emailBody = `
      <h3>Ada User Mau Upgrade Pro!</h3>
      <p>Berikut rincian informasi pengguna:</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 400px; font-family: sans-serif; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 100px;">Nama:</td>
          <td style="padding: 8px 0;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Waktu:</td>
          <td style="padding: 8px 0;">${wibTime}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Status:</td>
          <td style="padding: 8px 0; color: #f97316; font-weight: bold;">User menuju WhatsApp untuk konfirmasi bayar</td>
        </tr>
      </table>
      <br/>
      <p>Silakan tunggu bukti transfer di WhatsApp admin (6289618418569). Setelah terverifikasi, gunakan endpoint admin untuk melakukan aktivasi Pro.</p>
    `

    await sendEmail({
      to: 'daimoh442@gmail.com',
      subject: emailSubject,
      html: emailBody
    })

    // 2. Save log into upgrade_logs table using Admin Client to bypass RLS
    const supabaseAdmin = createAdminClient()
    const { error: logError } = await supabaseAdmin
      .from('upgrade_logs')
      .insert({
        user_id: user.id,
        status: 'pending'
      })

    if (logError) {
      console.error('Failed to save upgrade log:', logError)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error in /api/upgrade/notify:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
