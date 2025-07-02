// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr' // or '@supabase/auth-helpers-nextjs' if using that package
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'No tokens found' }, { status: 403 })
  }

  // Create a new Supabase client with the tokens from cookies
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        get: (name) => {
          if (name === 'sb-access-token') return accessToken
          if (name === 'sb-refresh-token') return refreshToken
          return undefined
        }
      }
    }
  )

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      // Try to refresh session
      const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
      if (refreshError || !newSession) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 403 })
      }
      // Set new cookies as before...
      const response = NextResponse.next()
      response.cookies.set('sb-access-token', newSession.access_token, { path: '/', maxAge: newSession.expires_in, secure: true, sameSite: 'lax' })
      response.cookies.set('sb-refresh-token', newSession.refresh_token, { path: '/', maxAge: newSession.expires_in, secure: true, sameSite: 'lax' })
      return response
    }
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const config = {
  matcher: ['/home/:path*']
}