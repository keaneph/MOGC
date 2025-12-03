"use client"

import { useState } from "react"
import {
  Plus,
  Clock,
  Calendar,
  List,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Copy,
  Trash,
  PencilLine,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import DateOverrideManager from "@/components/availability/DateOverrideManager"
import WeeklyScheduleManager from "@/components/availability/WeeklyScheduleManager"

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"

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

interface DateOverride {
  id: string
  date: Date
  slots: TimeSlot[]
  isUnavailable?: boolean
}

const initialWeeklySchedule: WeeklyAvailability[] = [
  { day: "Sunday", available: false, slots: [] },
  {
    day: "Monday",
    available: true,
    slots: [{ id: "m1", start: "09:00 AM", end: "05:00 PM" }],
  },
  {
    day: "Tuesday",
    available: true,
    slots: [
      { id: "t1", start: "09:00 AM", end: "05:00 PM" },
      { id: "t2", start: "07:00 PM", end: "09:00 PM" },
    ],
  },
  {
    day: "Wednesday",
    available: true,
    slots: [{ id: "w1", start: "09:00 AM", end: "05:00 PM" }],
  },
  {
    day: "Thursday",
    available: true,
    slots: [{ id: "th1", start: "09:00 AM", end: "05:00 PM" }],
  },
  {
    day: "Friday",
    available: true,
    slots: [{ id: "f1", start: "09:00 AM", end: "05:00 PM" }],
  },
  {
    day: "Saturday",
    available: true,
    slots: [{ id: "sa1", start: "09:00 AM", end: "05:00 PM" }],
  },
]

export default function AvailabilityPage() {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyAvailability[]>(
    initialWeeklySchedule
  )
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([])
  const [activeView, setActiveView] = useState<"list" | "calendar">("list")
  const [isScheduleMenuOpen, setIsScheduleMenuOpen] = useState(false)
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [dialogSlots, setDialogSlots] = useState<TimeSlot[]>([
    { id: String(Date.now()), start: "09:00 AM", end: "05:00 PM" },
  ])
  const [markAsUnavailable, setMarkAsUnavailable] = useState(false)

  const handleToggleDay = (day: Day, isAvailable: boolean) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              available: isAvailable,
              slots:
                isAvailable && item.slots.length === 0
                  ? [
                      {
                        id: String(Date.now()),
                        start: "09:00 AM",
                        end: "05:00 PM",
                      },
                    ]
                  : item.slots,
            }
          : item
      )
    )
  }

  const handleRemoveSlot = (day: Day, id: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? { ...item, slots: item.slots.filter((slot) => slot.id !== id) }
          : item
      )
    )
  }

  const handleAddSlot = (day: Day) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              slots: [
                ...item.slots,
                { id: String(Date.now()), start: "08:00 AM", end: "09:00 AM" },
              ],
            }
          : item
      )
    )
  }

  const handleUpdateSlot = (
    day: Day,
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              slots: item.slots.map((slot) =>
                slot.id === id ? { ...slot, [field]: value } : slot
              ),
            }
          : item
      )
    )
  }

  const handleCopySlot = (sourceDay: Day, targetDay: Day) => {
    if (sourceDay === targetDay) return

    const sourceItem = weeklySchedule.find((item) => item.day === sourceDay)
    if (!sourceItem || !sourceItem.available) return

    const slotsToCopy: TimeSlot[] = sourceItem.slots.map((slot) => ({
      id: String(Date.now() + Math.random()), // Ensure unique ID
      start: slot.start,
      end: slot.end,
    }))

    setWeeklySchedule((prev) => {
      return prev.map((item) => {
        if (item.day === targetDay) {
          return {
            ...item,
            available: true,
            slots: slotsToCopy,
          }
        }
        return item
      })
    })
  }

  const handleAddDateOverride = () => {
    if (!selectedDate) return

    const newOverride: DateOverride = {
      id: String(Date.now()),
      date: selectedDate,
      slots: markAsUnavailable ? [] : dialogSlots,
      isUnavailable: markAsUnavailable,
    }

    setDateOverrides((prev) => [...prev, newOverride])
    setIsDialogOpen(false)
    setSelectedDate(undefined)
    setDialogSlots([
      { id: String(Date.now()), start: "09:00 AM", end: "05:00 PM" },
    ])
    setMarkAsUnavailable(false)
  }

  const handleRemoveDateOverride = (id: string) => {
    setDateOverrides((prev) => prev.filter((override) => override.id !== id))
  }

  const handleDialogSlotUpdate = (
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    setDialogSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    )
  }

  const handleDialogSlotRemove = (id: string) => {
    setDialogSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  const handleDialogSlotAdd = () => {
    setDialogSlots((prev) => [
      ...prev,
      { id: String(Date.now()), start: "08:00 AM", end: "09:00 AM" },
    ])
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <main id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <h1 className="mb-10 text-3xl font-semibold tracking-wide">
          Availability
        </h1>
        <Card className="gap-5 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Schedule</p>
              {/* Working hours (default) */}
              <div className="flex items-center">
                <DropdownMenu onOpenChange={setIsScheduleMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="option"
                      className="-ml-3 flex h-auto cursor-pointer items-center gap-2 p-0 px-0 text-xl font-bold text-red-800 hover:bg-transparent hover:text-red-700"
                    >
                      Working hours (default)
                      {isScheduleMenuOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer">
                      Default
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                      <Plus className="h-4 w-4" /> Create Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid w-48 grid-cols-[auto_1fr] gap-0">
                <p className="text-sm">Active on:</p>
                <DropdownMenu onOpenChange={setIsEventMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-6 cursor-pointer items-center px-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      1 event type
                      {isEventMenuOpen ? (
                        <ChevronUp className="ml-1 h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="ml-1 h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer">
                      Default
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                      <Plus className="h-4 w-4" /> Create Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ToggleGroup
                type="single"
                value={activeView}
                onValueChange={(value: "list" | "calendar") =>
                  value && setActiveView(value)
                }
                className="bg-red-50 p-1"
              >
                <ToggleGroupItem
                  value="list"
                  aria-label="Toggle list view"
                  className="h-auto cursor-pointer p-2 pr-4 text-sm data-[state=on]:bg-white data-[state=on]:text-red-800 data-[state=on]:shadow-sm"
                >
                  <List className="mr-1 h-4 w-4" /> List
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="calendar"
                  aria-label="Toggle calendar view"
                  className="h-auto cursor-pointer p-2 text-sm data-[state=on]:bg-white data-[state=on]:text-red-800 data-[state=on]:shadow-sm"
                >
                  <Calendar className="mr-1 h-4 w-5" /> Calendar
                </ToggleGroupItem>
              </ToggleGroup>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="option"
                    size="icon"
                    className="h-9 w-9 cursor-pointer"
                  >
                    <EllipsisVertical className="ml-1 h-9 w-9" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer">
                    <PencilLine className="ml-1 h-5 w-5 text-gray-500" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Copy className="ml-1 h-5 w-5 text-gray-500" /> Duplicate
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Trash className="ml-1 h-5 w-5 text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Column 1: Weekly Hours */}
              <WeeklyScheduleManager
                weeklySchedule={weeklySchedule}
                handleToggleDay={handleToggleDay}
                handleRemoveSlot={handleRemoveSlot}
                handleAddSlot={handleAddSlot}
                handleCopySlot={handleCopySlot}
                handleUpdateSlot={handleUpdateSlot}
              />

              {/* Column 2: Date-Specific Hours */}
              <DateOverrideManager
                dateOverrides={dateOverrides}
                handleRemoveDateOverride={handleRemoveDateOverride}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                markAsUnavailable={markAsUnavailable}
                setMarkAsUnavailable={setMarkAsUnavailable}
                dialogSlots={dialogSlots}
                setDialogSlots={setDialogSlots}
                handleAddDateOverride={handleAddDateOverride}
                handleDialogSlotUpdate={handleDialogSlotUpdate}
                handleDialogSlotRemove={handleDialogSlotRemove}
                handleDialogSlotAdd={handleDialogSlotAdd}
                formatDate={formatDate}
              />
            </div>
          </CardContent>

          <Separator className="my-4" />

          {/* Timezone Footer */}
          <div className="text-muted-foreground p-6 pt-0 text-sm">
            <p className="flex cursor-pointer items-center gap-1 hover:underline">
              <Clock className="h-4 w-4" /> Singapore Standard Time
              <ChevronDown className="ml-1 h-3 w-3" />
            </p>
          </div>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button variant="default">Save Availability</Button>
        </div>
      </div>
    </main>
  )
}
