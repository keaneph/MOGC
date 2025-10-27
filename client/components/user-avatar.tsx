'use client'

import Image from 'next/image'
import { CircleUserRoundIcon } from 'lucide-react'
import { useSupabaseAvatar } from '@/hooks/use-supabase-avatar'

export function UserAvatar() {
    const avatarUrl = useSupabaseAvatar()

    return (
        <div className="flex items-center justify-center w-14">
        {avatarUrl ? (
            <Image
            src={avatarUrl}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover h-8 w-8"
            />
        ) : (
            <CircleUserRoundIcon className="text-white h-8 w-8" strokeWidth={1.5} />
        )}
        </div>
    )
}
