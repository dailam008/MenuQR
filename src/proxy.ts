import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isProExpired } from './lib/plan-gate'

// Edge-compatible in-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string, limit: number, windowMs: number, routeKey: string): boolean {
  const now = Date.now()
  const key = `${ip}:${routeKey}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count += 1
  return false
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
  const { pathname } = request.nextUrl

  // 1. Rate Limiting Checks (Skip in development / local)
  const isDev = process.env.NODE_ENV === 'development' || ip === '127.0.0.1' || ip === '::1'

  // Auth routes limit: max 20 req/minute in prod
  if (!isDev && (pathname === '/login' || pathname === '/register')) {
    if (isRateLimited(ip, 20, 60 * 1000, 'auth')) {
      return new NextResponse('Too Many Requests. Silakan tunggu beberapa saat sebelum mencoba kembali.', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Retry-After': '60',
        },
      })
    }
  }

  // Image Upload limit: max 30 req/minute
  if (pathname.startsWith('/api/upload')) {
    if (isRateLimited(ip, 30, 60 * 1000, 'upload')) {
      return new NextResponse('Batas unggahan foto tercapai. Silakan tunggu beberapa saat.', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Retry-After': '60',
        },
      })
    }
  }

  // Global rate limit: max 300 req/minute on prod
  if (!isDev && isRateLimited(ip, 300, 60 * 1000, 'global')) {
    return new NextResponse('Akses dibatasi sementara karena terlalu banyak permintaan.', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '60',
      },
    })
  }

  // 2. Supabase Auth Protection & Route Redirects
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if user's Pro plan has expired
    try {
      await isProExpired(supabase, user.id)
    } catch (e) {
      console.error('Proxy plan expiry check failed:', e)
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export default middleware

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
