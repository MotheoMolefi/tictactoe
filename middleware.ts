import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function middleware(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  // If no tokens are present, redirect to login
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: 'No tokens found' },
      { status: 403 }
    )
  }

  try {
    // Verify the session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      // If session is invalid, try to refresh it using the refresh token from cookies
      // PROBLEM: refreshSession() without parameters tries to use Supabase's internal state
      //          but middleware doesn't have access to that state, so it always fails
      // SOLUTION: Pass refresh_token explicitly from cookies so Supabase can use it
      // OLD CODE: const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession()
      const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (refreshError || !newSession) {
        // If refresh fails, redirect to login
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 403 }
        )
      }

      // If refresh succeeds, update the cookies with new tokens
      const response = NextResponse.next()
      response.cookies.set('sb-access-token', newSession.access_token, {
        path: '/',
        maxAge: newSession.expires_in,
        secure: true,
        sameSite: 'lax'
      })
      response.cookies.set('sb-refresh-token', newSession.refresh_token, {
        path: '/',
        maxAge: newSession.expires_in,
        secure: true,
        sameSite: 'lax'
      })
      return response
    }

    // If session is valid, proceed with the request
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Configure which routes should be protected by the middleware
export const config = {
  matcher: ['/home/:path*']
} 