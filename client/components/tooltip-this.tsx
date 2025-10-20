import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface TooltipThisProps {
  /** what element triggers the tooltip (e.g., icon, text, etc.) */
  children: React.ReactNode
  /** the tooltip message */
  label: string
}

export function TooltipThis({ children, label }: TooltipThisProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
