import { createServerClient } from "@supabase/ssr"
import type { cookies } from "next/headers"

export async function createClient(cookieStore?: ReturnType<typeof cookies>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Only import cookies() dynamically in app directory
  let cookieObj = cookieStore
  if (!cookieObj && typeof window === 'undefined') {
    try {
      // Dynamic import to avoid loading in pages directory
      const { cookies } = await import("next/headers")
      cookieObj = cookies()
    } catch (e) {
      // We're in the pages directory, handle accordingly
      return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op for pages directory
          },
        },
      })
    }
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieObj?.getAll() || []
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieObj?.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
