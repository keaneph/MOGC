"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

export function useSupabaseAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const url = data.user.user_metadata?.avatar_url || null
        setAvatarUrl(url)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const url = session.user.user_metadata?.avatar_url || null
          setAvatarUrl(url)
        } else {
          setAvatarUrl(null)
        }
      }
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return avatarUrl
}
