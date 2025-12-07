import { Badge } from "@/components/ui/badge"

export type StatusType =
  | "pending"
  | "high risk"
  | "low risk"
  | "scheduled"
  | "not started"
  | "completed"
  | "no record"
  | "ongoing"
  | "closed"

interface Props {
  value: StatusType
}

const STATUS_COLORS: Record<
  StatusType,
  { bg: string; text: string; dot?: string }
> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-600" },
  completed: { bg: "bg-green-100", text: "text-green-600" },
  scheduled: { bg: "bg-blue-100", text: "text-blue-600" },
  "not started": { bg: "bg-purple-100", text: "text-purple-600" },
  "high risk": { bg: "bg-red-100", text: "text-red-600" },
  "low risk": { bg: "bg-green-200", text: "text-green-700" },
  "no record": { bg: "bg-purple-100", text: "text-purple-600" },
  ongoing: { bg: "bg-blue-200", text: "text-blue-700" },
  closed: { bg: "bg-yellow-200", text: "text-yellow-700" },
}

const StatusBadge: React.FC<Props> = ({ value }) => {
  const safeValue: StatusType = value ?? "not started"
  const colors = STATUS_COLORS[safeValue] ?? {
    bg: "bg-purple-100",
    text: "text-purple-600",
  }

  return (
    <Badge
      variant="default"
      className={`flex !h-5 cursor-pointer items-center gap-1 rounded-full text-[10px] font-semibold ring-0 shadow-none ${colors.bg} ${colors.text}`}
    >
      {safeValue.toUpperCase()}
    </Badge>
  )
}

export default StatusBadge
