"use client"

import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.png"
import { LanguagesIcon, BellIcon, SearchIcon } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { TooltipThis } from "./tooltip-this"
import { ContactDrawer } from "./drawer"
import { UserDropdown } from "./userprofile-dropdown"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { UserAvatar } from "./user-avatar"

export function AppHeader({ role }: { role: string }) {
  const userName = useSupabaseUser()
  return (
    <header className="bg-main sticky flex h-14 items-center border-b">
      {/* logo section */}
      <div className="flex h-14 w-14 items-center justify-center border-b bg-white">
        <TooltipThis label="Home">
          <Button
            asChild
            variant="default"
            className="hover:bg-primary/10 h-auto cursor-pointer p-1"
          >
            <Link href={`/${role.toLowerCase()}/getting-started`}>
              <Image src={logo} alt="MSU-IIT OGC" className="h-10 w-10" />
            </Link>
          </Button>
        </TooltipThis>
      </div>

      {/* profile section */}
      <div className="flex items-center">
        <UserAvatar />

        <div className="-mt-1.5 flex flex-col">
          <span className="font-medium tracking-wide text-white">
            Welcome {userName ?? "Guest"}!
          </span>
          <Badge
            variant="secondary"
            className="text-main mt-0.5 flex h-4.5 w-28 items-center justify-center rounded-sm text-xs tracking-wide"
          >
            {role}
          </Badge>
        </div>
      </div>

      {/* right section */}
      <div className="mr-6 ml-auto flex items-center gap-8 text-sm tracking-wide text-white">
        <TooltipThis label="Search the application">
          <div className="flex cursor-pointer items-center gap-1 decoration-white decoration-2 underline-offset-4 hover:underline">
            <SearchIcon className="h-4 w-4" />
            <div>Search</div>
          </div>
        </TooltipThis>

        <TooltipThis label="Contact our support team for assistance">
          <div>
            <ContactDrawer
              trigger={
                <div className="cursor-pointer decoration-white decoration-2 underline-offset-4 hover:underline">
                  Discuss your needs
                </div>
              }
            />
          </div>
        </TooltipThis>

        <TooltipThis label="View the documentation">
          <div className="cursor-pointer decoration-white decoration-2 underline-offset-4 hover:underline">
            <Link href="/documentation">Documentation</Link>
          </div>
        </TooltipThis>

        <TooltipThis label="Change Language">
          <Button
            asChild
            variant="default"
            className="hover:bg-primary/10 h-auto w-auto cursor-pointer !p-1"
          >
            <Link href="/student/getting-started">
              <LanguagesIcon className="!h-5 !w-5" />
            </Link>
          </Button>
        </TooltipThis>

        <TooltipThis label="View your notifications">
          <Button
            asChild
            variant="default"
            className="hover:bg-primary/10 h-auto w-auto cursor-pointer !p-1"
          >
            <Link href="/student/getting-started">
              <BellIcon className="!h-5 !w-5" />
            </Link>
          </Button>
        </TooltipThis>

        <UserDropdown role={role} />
      </div>
    </header>
  )
}
