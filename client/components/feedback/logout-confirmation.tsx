"use client"

import { LogOutIcon } from "lucide-react"

import Image from "next/image"

import { Button } from "@/components/ui/button"
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useLogout } from "@/hooks/use-logout"

export function LogoutConfirmationDialog() {
  const logout = useLogout()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="hover:bg-primary hover:text-accent-foreground w-full cursor-pointer rounded-sm px-3 py-2 text-[13px]"
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
          <DialogTitle className="tracking-wide">Confirmation</DialogTitle>
          <DialogDescription className="tracking-wide">
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer rounded-sm tracking-wide"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={logout}
            className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
