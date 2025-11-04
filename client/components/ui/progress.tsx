"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const progressValue = value || 0
  const isComplete = progressValue === 100

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-main/5 relative h-2 w-full overflow-hidden rounded-full border-1",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-main h-full w-full flex-1 rounded-full transition-all duration-300 ease-out",
          isComplete && "shadow-main/50 shadow-lg"
        )}
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
