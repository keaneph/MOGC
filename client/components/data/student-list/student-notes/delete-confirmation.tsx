"use client"

import { TrashIcon } from "lucide-react"
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
import { useState } from "react"

type DeleteConfirmationDialogProps = {
  onConfirm: () => void
  triggerClassName?: string
}

export function DeleteConfirmationDialog({
  onConfirm,
  triggerClassName,
}: DeleteConfirmationDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`cursor-pointer border-none text-sm ${triggerClassName}`}
        >
          <TrashIcon className="text-main2 !h-4 !w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <div className="absolute -top-[11.2rem] left-1/2 -translate-x-1/2">
          <Image
            src="/confirmation-dialog.png"
            alt="Delete confirmation illustration"
            width={200}
            height={200}
            className="drop-shadow-lg"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="tracking-wide">Delete Note</DialogTitle>
          <DialogDescription className="tracking-wide">
            Are you sure you want to delete this note? This action cannot be
            undone.
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
            onClick={handleDelete}
            className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
