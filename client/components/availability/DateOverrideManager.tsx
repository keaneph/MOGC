// components/availability/DateOverrideManager.tsx

import React, { Dispatch, SetStateAction } from "react"
import { CalendarClock, Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
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
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold">Date-specific hours</h2>
      </div>
      <p className="text-muted-foreground text-sm">
        Adjust hours for specific days, holidays, or vacations.
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full cursor-pointer text-green-600 hover:text-green-700"
          >
            <Plus className="mr-2 h-4 w-4 text-green-600" /> Add Date Override
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
              />
            </div>

            {selectedDate && (
              <div className="space-y-4">
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
                      <TimeRangeInput
                        key={slot.id}
                        slot={slot}
                        onRemove={handleDialogSlotRemove}
                        onAdd={handleDialogSlotAdd}
                        onUpdate={handleDialogSlotUpdate}
                        showAddButton={index === 0}
                      />
                    ))}
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
              disabled={!selectedDate}
            >
              Save Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Date Overrides List */}
      <div className="space-y-2">
        {dateOverrides.length === 0 ? (
          <Card className="border-2 border-dashed p-6 text-center text-gray-500 italic">
            No date-specific hours set.
          </Card>
        ) : (
          dateOverrides.map((override) => (
            <Card key={override.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{formatDate(override.date)}</p>
                  {override.isUnavailable ? (
                    <p className="text-sm text-red-600">Unavailable</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {override.slots.map((slot) => (
                        <p key={slot.id} className="text-sm text-gray-600">
                          {slot.start} - {slot.end}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDateOverride(override.id)}
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default DateOverrideManager
