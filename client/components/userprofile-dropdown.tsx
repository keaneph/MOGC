"use client"

import Link from "next/link"
import { CircleUserRoundIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { LogoutConfirmationDialog } from "./logout-confirmation"
import { UserAvatar } from "./user-avatar"
import { TooltipThis } from "@/components/tooltip-this"

export function UserDropdown({ role }: { role: string }) {
  return (
    <DropdownMenu>
      <TooltipThis label="User Profile">
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="hover:bg-primary/10 h-10 w-10 cursor-pointer rounded-full !p-1"
          >
            <UserAvatar />
          </Button>
        </DropdownMenuTrigger>
      </TooltipThis>

      <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
        {role === "Student" && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/student/getting-started"
                className="hover:bg-primary hover:text-accent-foreground w-full cursor-pointer rounded-sm px-3 py-2 text-[13px]"
              >
                <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                View Student Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <LogoutConfirmationDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
