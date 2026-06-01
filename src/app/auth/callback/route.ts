import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sendEmail, getWelcomeEmailHtml } from '@/lib/email'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data?.user?.email) {
      const fullName = data.user.user_metadata?.full_name || 'Mitra MenuQR'
      try {
        const welcomeHtml = getWelcomeEmailHtml(fullName)
        await sendEmail({
          to: data.user.email,
          subject: `Selamat datang di MenuQR, ${fullName}! 👋`,
          html: welcomeHtml,
        })
      } catch (emailErr) {
        console.error('Failed to send onboarding welcome email:', emailErr)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
