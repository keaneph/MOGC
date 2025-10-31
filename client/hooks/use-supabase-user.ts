"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

function formatName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function useSupabaseUser() {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const raw = data.user.user_metadata?.full_name || data.user.email
        setUserName(formatName(raw))
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const raw =
            session.user.user_metadata?.full_name || session.user.email
          setUserName(formatName(raw))
        } else {
          setUserName(null)
        }
      }
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return userName
}
