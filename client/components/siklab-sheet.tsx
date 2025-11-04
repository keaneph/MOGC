"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "./ui/separator"
import Image from "next/image"
import curious from "@/public/curious.png"
import peeking from "@/public/peeking.jpeg"
import { TooltipThis } from "./tooltip-this"
import { Progress } from "@/components/ui/progress"
import { ChevronsRightIcon } from "lucide-react"
import { SiklabAccordion } from "./siklab-accordion"

type SiklabSheetProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  accordionValue?: string | string[]
  onAccordionValueChange?: (value: string | string[]) => void
  showTrigger?: boolean
}

export function SiklabSheet({
  open,
  onOpenChange,
  accordionValue,
  onAccordionValueChange,
  showTrigger = true,
}: SiklabSheetProps) {
  const [localOpen, setLocalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const openState = isControlled ? (open as boolean) : localOpen
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    if (!isControlled) setLocalOpen(v)
  }

  return (
    <Sheet open={openState} onOpenChange={setOpen}>
      {showTrigger && (
        <TooltipThis label="Open Siklab Guide">
          <SheetTrigger asChild>
            <Image
              src={curious}
              alt="Siklab Curious Logo"
              className="h-auto w-12 cursor-pointer transition-transform hover:scale-110"
            />
          </SheetTrigger>
        </TooltipThis>
      )}

      <SheetContent className="flex w-90 flex-col overflow-visible">
        <SheetHeader className="bg-main relative h-48">
          <SheetTitle />
          <Image
            src={peeking}
            alt="Siklab Peeking Logo"
            className="absolute -top-5 left-1/2 z-11 h-55 w-37 -translate-x-1/2"
          />

          <div
            id="main-container"
            className="bg-background absolute top-40 left-1/2 z-10 flex w-5/6 -translate-x-1/2 flex-col items-center rounded-sm border-1"
          >
            <Progress value={77} className="mt-6 mb-6 h-3 w-11/12" />

            <div className="mb-2 w-11/12">
              <SiklabAccordion
                value={accordionValue}
                onValueChange={onAccordionValueChange}
              />
            </div>
          </div>
        </SheetHeader>
        <SheetFooter className="gap-0 p-0">
          <Separator className="" />
          <button
            onClick={() => setOpen(!open && !localOpen)}
            className="justify-begin hover:bg-muted flex w-full cursor-pointer items-center p-0 py-4 pr-4 pl-4 transition-colors"
          >
            <ChevronsRightIcon className="h-5 w-5" />
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
