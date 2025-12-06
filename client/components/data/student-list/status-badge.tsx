import { Badge } from "@/components/ui/badge"

export type StatusType =
  | "pending"
  | "high risk"
  | "low risk"
  | "scheduled"
  | "rescheduled"
  | "done"
  | "no record"
  | "ongoing"
  | "closed"

interface Props {
  value: StatusType
}

const StatusBadge: React.FC<Props> = ({ value }) => {
  const getBgColor = (val: string) => {
    switch (val) {
      case "high risk":
        return "bg-[var(--status-red)]"
      case "low risk":
        return "bg-[var(--status-green)]"
      case "scheduled":
        return "bg-[var(--status-peach)]"
      case "rescheduled":
        return "bg-[var(--status-blue)]"
      case "done":
        return "bg-[var(--status-green)]"
      case "ongoing":
        return "bg-[var(--status-blue)]"
      case "closed":
        return "bg-[var(--status-green)]"
      case "pending":
        return "bg-[var(--status-yellow)]"
      case "no record":
      default:
        return "bg-[var(--status-yellow)]"
    }
  }

  const getTextColor = (val: string) => {
    switch (val) {
      case "high risk":
      case "low risk":
      case "scheduled":
      case "rescheduled":
      case "done":
      case "ongoing":
      case "closed":
        return "text-white"
      default:
        return "text-main2"
    }
  }

  return (
    <Badge
      variant="default"
      className={`!h-5 cursor-pointer rounded-full text-[10px] font-semibold ring-0 shadow-none ${getBgColor(value)} ${getTextColor(value)}`}
    >
      {value.toUpperCase()}
    </Badge>
  )
}

export default StatusBadge
