"use client"

import { User } from "lucide-react"
import Image from "next/image"

interface StudentAvatarProps {
  avatarUrl?: string | null
  name?: string
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  xs: {
    container: "h-5 w-5",
    icon: "h-2.5 w-2.5",
    image: { width: 20, height: 20 },
  },
  sm: {
    container: "h-7 w-7",
    icon: "h-3.5 w-3.5",
    image: { width: 28, height: 28 },
  },
  md: {
    container: "h-8 w-8",
    icon: "h-4 w-4",
    image: { width: 32, height: 32 },
  },
  lg: {
    container: "h-10 w-10",
    icon: "h-5 w-5",
    image: { width: 40, height: 40 },
  },
}

export function StudentAvatar({
  avatarUrl,
  name = "Student",
  size = "sm",
  className,
}: StudentAvatarProps) {
  const { container, icon, image } = sizeClasses[size]

  return (
    <div
      className={`${container} flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${className || ""}`}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={image.width}
          height={image.height}
          className="rounded-full object-cover"
        />
      ) : (
        <User className={`${icon} text-gray-600`} />
      )}
    </div>
  )
}
