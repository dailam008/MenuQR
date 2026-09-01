import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sendEmail, getWelcomeEmailHtml } from '@/lib/email'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data?.user?.email) {
      // Only send welcome email if this looks like a new signup, not a password reset
      // We can guess it's a reset if 'next' points to reset-password
      const isPasswordReset = next.includes('reset-password')
      
      if (!isPasswordReset) {
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
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${next}`)
}
