"use client"

import Image from "next/image"
import { CircleUserRoundIcon } from "lucide-react"
import { useSupabaseAvatar } from "@/hooks/use-supabase-avatar"

export function UserAvatar() {
  const avatarUrl = useSupabaseAvatar()

  return (
    <div className="flex w-14 items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <CircleUserRoundIcon className="h-8 w-8 text-white" strokeWidth={1.5} />
      )}
    </div>
  )
}
