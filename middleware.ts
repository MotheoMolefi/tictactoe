// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  let cookieStore = cookies()
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  
  let supabaseServerClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedCookiesStore = await cookieStore
            cookiesToSet.forEach(({ name, value, options }) =>
              resolvedCookiesStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
  
  // const supabase = createServerClient(
  //   process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_API_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return request.cookies.get(name)?.value
  //       },
  //       set(name: string, value: string, options: any) {
  //         request.cookies.set({
  //           name,
  //           value,
  //           ...options,
  //         })
  //         response = NextResponse.next({
  //           request: {
  //             headers: request.headers,
  //           },
  //         })
  //         response.cookies.set({
  //           name,
  //           value,
  //           ...options,
  //         })
  //       },
  //       remove(name: string, options: any) {
  //         request.cookies.set({
  //           name,
  //           value: '',
  //           ...options,
  //         })
  //         response = NextResponse.next({
  //           request: {
  //             headers: request.headers,
  //           },
  //         })
  //         response.cookies.set({
  //           name,
  //           value: '',
  //           ...options,
  //         })
  //       },
  //     },
  //   }
  // )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabaseServerClient.auth.getSession()

  // Silently handle session refresh errors (old/invalid sessions)
  if (error && error.status !== 0){
    console.log('Session error:', error.message)
  }
  // If accessing protected route and no session, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/home')) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login/signup and already authenticated, redirect to home
  if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const redirectUrl = new URL('/home', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}