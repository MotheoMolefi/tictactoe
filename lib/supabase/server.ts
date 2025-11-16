"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// Create a simple server-side Supabase client
export async function createServerSupabaseClient() {
    let cookieStore = cookies()
    return createServerClient(
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
}

// export async function getUser() {
//   const supabase = createServerSupabaseClient()
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()
//     return user
//   } catch (error) {
//     console.error('Error getting user:', error)
//     return null
//   }
// } 