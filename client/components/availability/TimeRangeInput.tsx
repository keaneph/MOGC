import React, { useState } from "react"
import { CirclePlus, X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const generateTimeOptions = () => {
  const times: string[] = []
  const minutes = ["00", "15", "30", "45"]

  for (let h = 7; h <= 11; h++) {
    const hour = h.toString().padStart(2, "0")
    minutes.forEach((m) => times.push(`${hour}:${m} AM`))
  }

  minutes.forEach((m) => times.push(`12:${m} PM`))

  for (let h = 1; h <= 7; h++) {
    const hour = h.toString().padStart(2, "0")
    minutes.forEach((m) => times.push(`${hour}:${m} PM`))
  }
  return times
}
const TIME_OPTIONS = generateTimeOptions()
const isValidTimeFormat = (time: string): boolean =>
  /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i.test(time.trim())

interface TimeSlot {
  id: string
  start: string
  end: string
}

const parseTime = (timeStr: string): number => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
  if (!match) return -1
  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const period = match[3].toUpperCase()
  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0
  return hours * 60 + minutes
}

interface TimeRangeInputProps {
  slot: TimeSlot
  onRemove: (id: string) => void
  onAdd?: () => void
  onCopy?: () => void
  onUpdate: (id: string, field: "start" | "end", value: string) => void
  showAddButton?: boolean
  showCopyButton?: boolean
}

const TimeRangeInput: React.FC<TimeRangeInputProps> = ({
  slot,
  onRemove,
  onAdd,
  onCopy,
  onUpdate,
  showAddButton = false,
  showCopyButton = false,
}) => {
  const [showStartDropdown, setShowStartDropdown] = useState(false)
  const [showEndDropdown, setShowEndDropdown] = useState(false)
  const [startValid, setStartValid] = useState(true)
  const [endValid, setEndValid] = useState(true)

  const startMinutes = parseTime(slot.start)
  const endMinutes = parseTime(slot.end)

  const isRangeInvalid =
    startMinutes !== -1 && endMinutes !== -1 && endMinutes <= startMinutes

  const handleTimeChange = (field: "start" | "end", value: string) => {
    onUpdate(slot.id, field, value)
    const isValid = isValidTimeFormat(value)
    if (field === "start") {
      setStartValid(isValid || value === "")
    } else {
      setEndValid(isValid || value === "")
    }
  }

  const handleTimeSelect = (field: "start" | "end", value: string) => {
    onUpdate(slot.id, field, value)
    if (field === "start") {
      setShowStartDropdown(false)
      setStartValid(true)
    } else {
      setShowEndDropdown(false)
      setEndValid(true)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {/* Start Time */}
        <div className="relative">
          <Input
            type="text"
            value={slot.start}
            className={`w-28 text-center ${!startValid || isRangeInvalid ? "border-red-500" : ""}`}
            placeholder="09:00 AM"
            onChange={(e) => handleTimeChange("start", e.target.value)}
            onFocus={() => setShowStartDropdown(true)}
            onBlur={() => setTimeout(() => setShowStartDropdown(false), 200)}
          />
          {showStartDropdown && (
            <div className="absolute z-10 mt-1 max-h-48 w-28 overflow-y-auto rounded-md border bg-white shadow-lg">
              {TIME_OPTIONS.map((time) => (
                <div
                  key={time}
                  className="cursor-pointer px-3 py-2 text-center text-sm hover:bg-gray-100"
                  onMouseDown={() => handleTimeSelect("start", time)}
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="text-muted-foreground">-</span>

        {/* End Time */}
        <div className="relative">
          <Input
            type="text"
            value={slot.end}
            className={`w-28 text-center ${!endValid || isRangeInvalid ? "border-red-500" : ""}`}
            placeholder="05:00 PM"
            onChange={(e) => handleTimeChange("end", e.target.value)}
            onFocus={() => setShowEndDropdown(true)}
            onBlur={() => setTimeout(() => setShowEndDropdown(false), 200)}
          />
          {showEndDropdown && (
            <div className="absolute z-10 mt-1 max-h-48 w-28 overflow-y-auto rounded-md border bg-white shadow-lg">
              {TIME_OPTIONS.map((time) => (
                <div
                  key={time}
                  className="cursor-pointer px-3 py-2 text-center text-sm hover:bg-gray-100"
                  onMouseDown={() => handleTimeSelect("end", time)}
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-0">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-red-500/10"
            onClick={() => onRemove(slot.id)}
          >
            <X className="text-muted-foreground h-4 w-4 hover:text-red-600" />
          </Button>
          {showAddButton && onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={onAdd}
            >
              <CirclePlus className="text-muted-foreground h-4 w-4" />
            </Button>
          )}
          {showCopyButton && onCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={onCopy}
            >
              <Copy className="text-muted-foreground h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {isRangeInvalid && (
        <span className="mt-1 text-xs text-red-600">
          End time must be after start time.
        </span>
      )}
      {!startValid && startMinutes === -1 && (
        <span className="mt-1 text-xs text-red-600">
          Invalid start time format (e.g., 09:00 AM)
        </span>
      )}
      {!endValid && endMinutes === -1 && (
        <span className="mt-1 text-xs text-red-600">
          Invalid end time format (e.g., 05:00 PM)
        </span>
      )}
    </div>
  )
}

export default TimeRangeInput
