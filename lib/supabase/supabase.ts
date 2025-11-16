// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export async function middleware(request: NextRequest) {
//   let cookieStore = cookies()
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         async getAll() {
//           return (await cookieStore).getAll()
//         },
//         async setAll(cookiesToSet) {
//           try {
//             const resolvedCookiesStore = await cookieStore
//             cookiesToSet.forEach(({ name, value, options }) =>
//               resolvedCookiesStore.set(name, value, options)
//             )
//           } catch {}
//         },
//       },
//     }
//   )
// }

//   // Refresh session if expired - required for Server Components
//   const { data: { session }, error } = await supabase.auth.getSession()

//   // If accessing protected route and no session, redirect to login
//   if (!session && request.nextUrl.pathname.startsWith('/home')) {
//     const redirectUrl = new URL('/login', request.url)
//     return NextResponse.redirect(redirectUrl)
//   }

//   // The current issue is that there is no session being created
//   // Causing the application to push to the "/login" route as opposed to the "/home" route

//   // If accessing login/signup and already authenticated, redirect to home
//   if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
//     const redirectUrl = new URL('/home', request.url)
//     return NextResponse.redirect(redirectUrl)
//   }

//   return response


// export function createClient() {
//   const cookieStore = cookies()

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         async getAll() {
//           return (await cookieStore).getAll()
//         },
//         async setAll(cookiesToSet) {
//           try {
//             const resolvedCookiesStore = await cookieStore
//             cookiesToSet.forEach(({ name, value, options }) =>
//               resolvedCookiesStore.set(name, value, options)
//             )
//           } catch {}
//         },
//       },
//     }
//   )
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }
