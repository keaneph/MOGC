"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

export function useSupabaseEmail() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email ?? null)
      }
    })

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email ?? null)
        } else {
          setUserEmail(null)
        }
      }
    )

    return () => {
      subscription?.subscription?.unsubscribe()
    }
  }, [])

  return userEmail
}
