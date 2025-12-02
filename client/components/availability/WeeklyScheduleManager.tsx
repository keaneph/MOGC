import React from "react"
import { CirclePlus, RefreshCcw, Copy as CopyIcon } from "lucide-react" // Added CopyIcon import
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu" // Added DropdownMenu imports
import TimeRangeInput from "./TimeRangeInput"

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
const DAYS_OF_WEEK: Day[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const getDayInitial = (day: Day): string => {
  if (day === "Sunday") return "S"
  if (day === "Monday") return "M"
  if (day === "Tuesday") return "T"
  if (day === "Wednesday") return "W"
  if (day === "Thursday") return "Th"
  if (day === "Friday") return "F"
  if (day === "Saturday") return "Sa"
  return ""
}

interface TimeSlot {
  id: string
  start: string
  end: string
}
interface WeeklyAvailability {
  day: Day
  available: boolean
  slots: TimeSlot[]
}

interface WeeklyScheduleManagerProps {
  weeklySchedule: WeeklyAvailability[]
  handleToggleDay: (day: Day, isAvailable: boolean) => void
  handleRemoveSlot: (day: Day, id: string) => void
  handleAddSlot: (day: Day) => void
  handleCopySlot: (sourceDay: Day, targetDay: Day) => void
  handleUpdateSlot: (
    day: Day,
    id: string,
    field: "start" | "end",
    value: string
  ) => void
}

const WeeklyScheduleManager: React.FC<WeeklyScheduleManagerProps> = ({
  weeklySchedule,
  handleToggleDay,
  handleRemoveSlot,
  handleAddSlot,
  handleCopySlot,
  handleUpdateSlot,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <RefreshCcw className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold">Weekly Hours</h2>
      </div>
      <p className="text-muted-foreground text-sm">
        Set when you are typically available for meetings.
      </p>

      <div className="space-y-3">
        {weeklySchedule.map((item) => (
          <div key={item.day} className="flex items-start gap-2">
            {/* Day Toggle */}
            <Button
              variant={item.available ? "default" : "secondary"}
              size="icon"
              className={`h-8 w-8 cursor-pointer rounded-full font-bold ${item.available ? "bg-red-800 hover:bg-red-900" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
              onClick={() => handleToggleDay(item.day, !item.available)}
            >
              {getDayInitial(item.day)}
            </Button>

            {/* Time Slots Container */}
            <div className="flex flex-col gap-2">
              {!item.available ? (
                <span className="mt-1 font-semibold text-red-700">
                  Unavailable
                </span>
              ) : (
                <>
                  {item.slots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-2">
                      <TimeRangeInput
                        slot={slot}
                        onRemove={(id) => handleRemoveSlot(item.day, id)}
                        onAdd={() => handleAddSlot(item.day)}
                        onUpdate={(id, field, value) =>
                          handleUpdateSlot(item.day, id, field, value)
                        }
                        showAddButton={false}
                      />

                      {index === 0 && (
                        <div className="flex gap-0">
                          {/* Add Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer p-1 hover:bg-green-500/10"
                            onClick={() => handleAddSlot(item.day)}
                            aria-label="Add time slot"
                          >
                            <CirclePlus className="h-4 w-4 text-green-600 hover:text-green-700" />
                          </Button>

                          {/* Copy Dropdown Button */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer p-1 hover:bg-gray-500/10"
                                aria-label={`Copy time slots from ${item.day}`}
                              >
                                <CopyIcon className="h-4 w-4 text-gray-600 hover:text-gray-700" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Copy to...</DropdownMenuLabel>
                              {DAYS_OF_WEEK.map((targetDay) => (
                                <DropdownMenuItem
                                  key={targetDay}
                                  disabled={targetDay === item.day}
                                  onSelect={() =>
                                    handleCopySlot(item.day, targetDay)
                                  }
                                  className="cursor-pointer gap-20"
                                >
                                  {targetDay}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyScheduleManager
