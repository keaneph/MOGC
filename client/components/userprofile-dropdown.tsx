'use client'

import Link from "next/link"
import { CircleUserRoundIcon, UsersIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { LogoutConfirmationDialog } from "./logout-confirmation"

export function UserDropdown({ role }: { role: string }) {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant="default"
            className="cursor-pointer !p-1 h-auto w-auto hover:bg-primary/10"
            >
            <CircleUserRoundIcon className="!h-5.5 !w-5.5" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
            {role === "Student" && (
            <DropdownMenuItem asChild>
                <Link
                href="/student/getting-started"
                className="text-sm px-3 py-2 rounded-sm w-full 
                            hover:bg-[color:var(--main-dark)/0.2] 
                            hover:text-accent-foreground"
                >
                <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                View Student Profile
                </Link>
            </DropdownMenuItem>
            )}

            {role === "Counselor" && (
            <DropdownMenuItem asChild>
                <Link
                href="/counselor/students"
                className="text-sm px-3 py-2 rounded-sm w-full 
                            hover:bg-[color:var(--main-dark)/0.2] 
                            hover:text-accent-foreground"
                >
                <UsersIcon className="mr-2 h-4 w-4" />
                View Student List
                </Link>
            </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <LogoutConfirmationDialog />
        </DropdownMenuContent>
        </DropdownMenu>
    )
}
