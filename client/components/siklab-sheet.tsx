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

export function SiklabSheet() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <TooltipThis label="Open Siklab Guide">
            <SheetTrigger asChild>
                <Image 
                  src={curious} 
                  alt="Siklab Curious Logo" 
                  className="cursor-pointer w-12 h-auto transition-transform hover:scale-110" />
            </SheetTrigger>
        </TooltipThis>
        
      <SheetContent className="w-90 flex flex-col overflow-visible">
        <SheetHeader className="bg-main h-48 relative">
            <SheetTitle/>
            <Image 
              src={peeking} 
              alt="Siklab Peeking Logo" 
              className="absolute left-1/2 -translate-x-1/2 -top-5 z-11 h-55 w-37" />
              
            <div id="main-container" className="flex flex-col items-center bg-background absolute left-1/2 -translate-x-1/2 top-40 z-10 w-5/6 border-1 rounded-sm">
              <Progress value={77} className="mb-6 mt-6 h-3 w-11/12" />

                <div className="w-11/12 mb-2">
                  <SiklabAccordion />
                </div>
                
              </div>
        </SheetHeader>
        <SheetFooter className="p-0 gap-0">
          <Separator className=""/>
            <button
              onClick={() => setOpen(!open)}
              className="p-0 flex w-full items-center justify-begin pl-4 pr-4 py-4 hover:bg-muted transition-colors cursor-pointer">
            <ChevronsRightIcon className="w-5 h-5"/>
        </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
