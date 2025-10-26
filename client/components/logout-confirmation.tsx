'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { useLogout } from "./logout-button"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import Image from "next/image"

export function LogoutConfirmationDialog() {
    const logout = useLogout()
    return (
        <Dialog>
        <DialogTrigger asChild>
            <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center w-full text-sm px-3 py-2 
                            data-[highlighted]:bg-[oklch(0.32_0.161_26.99_/_0.2)] 
                            data-[highlighted]:text-black 
                            rounded-sm cursor-pointer"
                >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
        </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
            <div className="absolute -top-[11.2rem] left-1/2 -translate-x-1/2">
                <Image
                src="/confirmation-dialog.png"
                alt="Confirmation illustration"
                width={200}
                height={200}
                className="drop-shadow-lg"
                />
            </div>
            <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
                Are you sure you want to log out of your account?
            </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>

            
                <Button
                    onClick={logout}
                    className="bg-[oklch(0.32_0.161_26.99)] hover:bg-[oklch(0.32_0.161_26.99_/_0.8)] text-white"
                    >
                    Logout
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}
