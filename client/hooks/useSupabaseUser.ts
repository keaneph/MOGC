'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'

export function useSupabaseUser() {
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
            const name = data.user.user_metadata?.full_name || data.user.email
            setUserName(name)
        }
        })

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            const name = session.user.user_metadata?.full_name || session.user.email
            setUserName(name)
        } else {
            setUserName(null)
        }
        })

        return () => {
        subscription.subscription.unsubscribe()
        }
    }, [])

    return userName
}
