'use client'

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

export function UserDropdown({ role }: { role: string }) {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant="default"
            className="cursor-pointer !p-1 h-auto w-auto hover:bg-primary/10"
            >
            <UserAvatar />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
            {role === "Student" && (
                <>
            <DropdownMenuItem asChild>
                <Link
                    href="/student/getting-started"
                    className="text-sm px-3 py-2 rounded-sm w-full hover:bg-primary hover:text-accent-foreground cursor-pointer"
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
