// components/availability/DateOverrideManager.tsx

import React, { useMemo } from "react"
import { CalendarClock, Plus, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import TimeRangeInput from "./TimeRangeInput"
interface TimeSlot {
  id: string
  start: string
  end: string
}
interface DateOverride {
  id: string
  date: Date
  slots: TimeSlot[]
  isUnavailable?: boolean
}

interface DateOverrideManagerProps {
  dateOverrides: DateOverride[]
  handleRemoveDateOverride: (id: string) => void
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedDate: Date | undefined
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  markAsUnavailable: boolean
  setMarkAsUnavailable: React.Dispatch<React.SetStateAction<boolean>>
  dialogSlots: TimeSlot[]
  setDialogSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>
  handleAddDateOverride: () => void
  handleDialogSlotUpdate: (
    id: string,
    field: "start" | "end",
    value: string
  ) => void
  handleDialogSlotRemove: (id: string) => void
  handleDialogSlotAdd: () => void
  formatDate: (date: Date) => string
  dialogHasOverlap?: boolean
}

const DateOverrideManager: React.FC<DateOverrideManagerProps> = ({
  dateOverrides,
  handleRemoveDateOverride,
  isDialogOpen,
  setIsDialogOpen,
  selectedDate,
  setSelectedDate,
  markAsUnavailable,
  setMarkAsUnavailable,
  dialogSlots,
  handleAddDateOverride,
  handleDialogSlotUpdate,
  handleDialogSlotRemove,
  handleDialogSlotAdd,
  formatDate,
  dialogHasOverlap = false,
}) => {
  // Check if selected date already has an override (conflict detection)
  const existingOverride = useMemo(() => {
    if (!selectedDate) return null
    return dateOverrides.find((override) => {
      const overrideDate = new Date(override.date)
      return (
        overrideDate.getFullYear() === selectedDate.getFullYear() &&
        overrideDate.getMonth() === selectedDate.getMonth() &&
        overrideDate.getDate() === selectedDate.getDate()
      )
    })
  }, [selectedDate, dateOverrides])

  // Get dates that already have overrides for calendar highlighting
  const overrideDates = useMemo(() => {
    return dateOverrides.map((override) => new Date(override.date))
  }, [dateOverrides])

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="text-muted-foreground h-4 w-4" />
            <h2 className="text-sm font-semibold">Date-specific hours</h2>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Adjust hours for specific days
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Plus className="mr-1 h-4 w-4" /> Hours
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Date Override</DialogTitle>
              <DialogDescription>
                Select a date and set custom availability hours
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasOverride: overrideDates,
                  }}
                  modifiersStyles={{
                    hasOverride: {
                      backgroundColor: "rgb(254 226 226)",
                      color: "rgb(153 27 27)",
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  {/* Conflict Warning */}
                  {existingOverride && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">
                          Override already exists
                        </p>
                        <p className="text-amber-700">
                          This date already has an override. Adding a new one
                          will replace the existing settings.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="font-medium">{formatDate(selectedDate)}</p>
                    <Button
                      variant={markAsUnavailable ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMarkAsUnavailable(!markAsUnavailable)}
                      className="cursor-pointer text-red-800 hover:text-red-900"
                    >
                      {markAsUnavailable
                        ? "Mark as Available"
                        : "Mark as Unavailable"}
                    </Button>
                  </div>

                  {!markAsUnavailable && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Time Slots</p>
                      {dialogSlots.map((slot, index) => (
                        <div key={slot.id} className="flex items-center gap-2">
                          <TimeRangeInput
                            slot={slot}
                            onRemove={handleDialogSlotRemove}
                            onAdd={handleDialogSlotAdd}
                            onUpdate={handleDialogSlotUpdate}
                            showAddButton={false}
                          />
                          {index === 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer p-1"
                              onClick={handleDialogSlotAdd}
                              aria-label="Add time slot"
                            >
                              <Plus className="text-muted-foreground h-4 w-4" />
                            </Button>
                          )}
                          {index > 0 && <div className="w-7" />}
                        </div>
                      ))}
                      {dialogHasOverlap && (
                        <span className="text-xs text-red-600">
                          Time overlap with another set of times
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer text-red-800 hover:text-red-900"
                onClick={handleAddDateOverride}
                disabled={
                  !selectedDate || (!markAsUnavailable && dialogHasOverlap)
                }
              >
                {existingOverride ? "Replace Override" : "Save Override"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Overrides List */}
      <div className="mt-4 space-y-3">
        {dateOverrides.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm italic">
            No date-specific hours set.
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-xs font-medium">2025</p>
            <div className="space-y-2">
              {dateOverrides.map((override) => (
                <div
                  key={override.id}
                  className="flex items-start justify-between rounded-md border bg-white p-3"
                >
                  <div className="min-w-[80px]">
                    <p className="text-sm font-medium">
                      {new Date(override.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    {override.isUnavailable ? (
                      <p className="text-sm text-red-600">Unavailable</p>
                    ) : (
                      <div className="space-y-0.5">
                        {override.slots.map((slot) => (
                          <p key={slot.id} className="text-sm text-gray-600">
                            {slot.start} – {slot.end}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-6 w-6"
                    onClick={() => handleRemoveDateOverride(override.id)}
                  >
                    <X className="text-muted-foreground h-4 w-4 hover:text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DateOverrideManager
