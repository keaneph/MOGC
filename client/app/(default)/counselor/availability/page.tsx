"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Plus,
  Calendar,
  List,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Copy,
  Trash,
  PencilLine,
  Loader2,
  Check,
  Clock,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import DateOverrideManager from "@/components/availability/DateOverrideManager"
import WeeklyScheduleManager from "@/components/availability/WeeklyScheduleManager"
import AvailabilityCalendar from "@/components/availability/AvailabilityCalendar"
import {
  getAvailability,
  saveAvailability,
  weeklyToAPI,
  weeklyFromAPI,
  overridesToAPI,
  overridesFromAPI,
  getSchedules,
  createSchedule,
  renameSchedule,
  duplicateSchedule,
  deleteSchedule,
  updateScheduleSettings,
  type Schedule,
} from "@/lib/api/availability"
import {
  getEventTypesBySchedule,
  getEventTypes,
  updateEventType,
  type LinkedEventType,
  type EventType,
} from "@/lib/api/event-types"

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
    slots: [{ id: "t1", start: "09:00 AM", end: "05:00 PM" }],
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
  { day: "Saturday", available: false, slots: [] },
]

// Deep comparison for schedules
const isScheduleEqual = (
  a: WeeklyAvailability[],
  b: WeeklyAvailability[]
): boolean => {
  if (a.length !== b.length) return false
  return a.every((itemA, index) => {
    const itemB = b[index]
    if (itemA.day !== itemB.day || itemA.available !== itemB.available)
      return false
    if (itemA.slots.length !== itemB.slots.length) return false
    return itemA.slots.every((slotA, slotIndex) => {
      const slotB = itemB.slots[slotIndex]
      return slotA.start === slotB.start && slotA.end === slotB.end
    })
  })
}

const isOverridesEqual = (a: DateOverride[], b: DateOverride[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((itemA, index) => {
    const itemB = b[index]
    if (itemA.date.getTime() !== itemB.date.getTime()) return false
    if (itemA.isUnavailable !== itemB.isUnavailable) return false
    if (itemA.slots.length !== itemB.slots.length) return false
    return itemA.slots.every((slotA, slotIndex) => {
      const slotB = itemB.slots[slotIndex]
      return slotA.start === slotB.start && slotA.end === slotB.end
    })
  })
}

// Convert 12-hour time to minutes from midnight for comparison
const timeToMinutes = (time: string): number => {
  const [timePart, period] = time.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let totalMinutes = hours * 60 + minutes
  if (period === "PM" && hours !== 12) totalMinutes += 12 * 60
  if (period === "AM" && hours === 12) totalMinutes -= 12 * 60
  return totalMinutes
}

// Convert minutes from midnight back to 12-hour format (no wrap, continues past midnight)
const minutesToTime = (minutes: number): string => {
  const hours24 = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours24 % 24 >= 12 ? "PM" : "AM"
  const hours12Raw = hours24 % 12
  const hours12 = hours12Raw === 0 ? 12 : hours12Raw
  return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`
}

// Check if two time slots overlap
const slotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  const start1 = timeToMinutes(slot1.start)
  const end1 = timeToMinutes(slot1.end)
  const start2 = timeToMinutes(slot2.start)
  const end2 = timeToMinutes(slot2.end)
  return start1 < end2 && start2 < end1
}

// Check if any slots in an array overlap with each other
const hasOverlappingSlots = (slots: TimeSlot[]): boolean => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slotsOverlap(slots[i], slots[j])) {
        return true
      }
    }
  }
  return false
}

// Get next available time slot based on existing slots
const getNextTimeSlot = (slots: TimeSlot[]): { start: string; end: string } => {
  if (slots.length === 0) {
    return { start: "09:00 AM", end: "05:00 PM" }
  }

  // Use the last slot's end time (most recently added)
  const lastSlot = slots[slots.length - 1]
  const lastEndMinutes = timeToMinutes(lastSlot.end)

  // Check if last slot crosses midnight by comparing start > end
  const lastStartMinutes = timeToMinutes(lastSlot.start)
  const isAfterMidnight =
    lastEndMinutes < lastStartMinutes || lastEndMinutes <= 60

  // If after midnight, add 24 hours worth of minutes to get correct position
  const adjustedEndMinutes = isAfterMidnight
    ? lastEndMinutes + 24 * 60
    : lastEndMinutes

  // New slot starts 1 hour after the last slot's end
  const newStartMinutes = adjustedEndMinutes + 60
  const newEndMinutes = newStartMinutes + 60

  return {
    start: minutesToTime(newStartMinutes),
    end: minutesToTime(newEndMinutes),
  }
}

export default function AvailabilityPage() {
  // Schedule management state
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null)
  const [isScheduleMenuOpen, setIsScheduleMenuOpen] = useState(false)
  const [linkedEventTypes, setLinkedEventTypes] = useState<LinkedEventType[]>(
    []
  )

  // Event type linking popover state
  const [eventTypePopoverOpen, setEventTypePopoverOpen] = useState(false)
  const [allEventTypes, setAllEventTypes] = useState<EventType[]>([])
  const [tempSelectedEventTypeIds, setTempSelectedEventTypeIds] = useState<
    Set<string>
  >(new Set())
  const [eventTypeSearch, setEventTypeSearch] = useState("")
  const [isEventTypeLinking, setIsEventTypeLinking] = useState(false)
  const [isEventTypeLoading, setIsEventTypeLoading] = useState(false)

  // Schedule dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingSettingsDialogOpen, setBookingSettingsDialogOpen] =
    useState(false)
  const [dialogScheduleName, setDialogScheduleName] = useState("")
  const [isDialogLoading, setIsDialogLoading] = useState(false)

  // Availability state
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyAvailability[]>(
    initialWeeklySchedule
  )
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([])
  const [activeView, setActiveView] = useState<"list" | "calendar">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Store original state for comparison
  const [originalWeeklySchedule, setOriginalWeeklySchedule] = useState<
    WeeklyAvailability[]
  >(initialWeeklySchedule)
  const [originalDateOverrides, setOriginalDateOverrides] = useState<
    DateOverride[]
  >([])

  // Date override dialog state
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [dialogSlots, setDialogSlots] = useState<TimeSlot[]>([
    { id: String(Date.now()), start: "09:00 AM", end: "05:00 PM" },
  ])
  const [markAsUnavailable, setMarkAsUnavailable] = useState(false)

  // Booking buffer state (minimum advance notice in hours)
  const [bookingBuffer, setBookingBuffer] = useState<number>(24)
  const [originalBookingBuffer, setOriginalBookingBuffer] = useState<number>(24)

  // Load schedules on mount
  useEffect(() => {
    async function loadSchedules() {
      const loadedSchedules = await getSchedules()

      if (loadedSchedules.length === 0) {
        // No schedules exist, create default one
        const result = await createSchedule("Working hours", {
          isDefault: true,
        })
        if (result.success && result.schedule) {
          setSchedules([result.schedule])
          setActiveSchedule(result.schedule)
          // Set booking buffer from newly created schedule
          const buffer = result.schedule.bookingBuffer ?? 24
          setBookingBuffer(buffer)
          setOriginalBookingBuffer(buffer)
        }
      } else {
        setSchedules(loadedSchedules)
        // Set active to default or first schedule
        const defaultSchedule =
          loadedSchedules.find((s) => s.isDefault) || loadedSchedules[0]
        setActiveSchedule(defaultSchedule)
        // Set booking buffer from active schedule
        const buffer = defaultSchedule.bookingBuffer ?? 24
        setBookingBuffer(buffer)
        setOriginalBookingBuffer(buffer)
      }
    }

    loadSchedules()
  }, [])

  // Load availability when active schedule changes
  useEffect(() => {
    async function loadAvailability() {
      if (!activeSchedule) return

      setIsLoading(true)
      try {
        const data = await getAvailability(activeSchedule.name)

        if (data.weekly.length > 0) {
          const loadedWeekly = weeklyFromAPI(data.weekly)
          setWeeklySchedule(loadedWeekly)
          setOriginalWeeklySchedule(JSON.parse(JSON.stringify(loadedWeekly)))
        } else {
          setWeeklySchedule(initialWeeklySchedule)
          setOriginalWeeklySchedule(
            JSON.parse(JSON.stringify(initialWeeklySchedule))
          )
        }

        if (data.overrides.length > 0) {
          const loadedOverrides = overridesFromAPI(data.overrides)
          setDateOverrides(loadedOverrides)
          setOriginalDateOverrides(
            JSON.parse(
              JSON.stringify(
                loadedOverrides.map((o) => ({
                  ...o,
                  date: o.date.toISOString(),
                }))
              )
            )
          )
        } else {
          setDateOverrides([])
          setOriginalDateOverrides([])
        }
      } catch (error) {
        console.error("Failed to load availability:", error)
        toast.error("Failed to load availability")
      } finally {
        setIsLoading(false)
      }
    }

    loadAvailability()
  }, [activeSchedule])

  // Load linked event types when active schedule changes
  useEffect(() => {
    async function loadLinkedEventTypes() {
      if (!activeSchedule) {
        setLinkedEventTypes([])
        return
      }

      try {
        const eventTypes = await getEventTypesBySchedule(activeSchedule.id)
        setLinkedEventTypes(eventTypes)
      } catch (error) {
        console.error("Failed to load linked event types:", error)
        setLinkedEventTypes([])
      }
    }

    loadLinkedEventTypes()
  }, [activeSchedule])

  // Compute hasChanges by comparing current state to original
  const hasChanges = useMemo(
    () =>
      !isScheduleEqual(weeklySchedule, originalWeeklySchedule) ||
      !isOverridesEqual(
        dateOverrides,
        originalDateOverrides.map((o) => ({ ...o, date: new Date(o.date) }))
      ) ||
      bookingBuffer !== originalBookingBuffer,
    [
      weeklySchedule,
      originalWeeklySchedule,
      dateOverrides,
      originalDateOverrides,
      bookingBuffer,
      originalBookingBuffer,
    ]
  )

  // Check for overlapping time slots across all days
  const daysWithOverlap: Day[] = useMemo(
    () =>
      weeklySchedule
        .filter((item) => item.available && hasOverlappingSlots(item.slots))
        .map((item) => item.day),
    [weeklySchedule]
  )

  const hasOverlap = daysWithOverlap.length > 0

  // Check for overlapping time slots in dialog
  const dialogHasOverlap = useMemo(
    () => hasOverlappingSlots(dialogSlots),
    [dialogSlots]
  )

  // Schedule management handlers
  const handleCreateSchedule = async () => {
    if (!dialogScheduleName.trim()) {
      toast.error("Please enter a schedule name")
      return
    }

    setIsDialogLoading(true)
    const result = await createSchedule(dialogScheduleName.trim())
    setIsDialogLoading(false)

    if (result.success && result.schedule) {
      setSchedules((prev) => [...prev, result.schedule!])
      setActiveSchedule(result.schedule)
      setCreateDialogOpen(false)
      setDialogScheduleName("")
      toast.success("Schedule created successfully")
    } else {
      toast.error(result.error || "Failed to create schedule")
    }
  }

  const handleRenameSchedule = async () => {
    if (!activeSchedule || !dialogScheduleName.trim()) {
      toast.error("Please enter a schedule name")
      return
    }

    setIsDialogLoading(true)
    const result = await renameSchedule(
      activeSchedule.id,
      dialogScheduleName.trim()
    )
    setIsDialogLoading(false)

    if (result.success && result.schedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === activeSchedule.id ? result.schedule! : s))
      )
      setActiveSchedule(result.schedule)
      setRenameDialogOpen(false)
      setDialogScheduleName("")
      toast.success("Schedule renamed successfully")
    } else {
      toast.error(result.error || "Failed to rename schedule")
    }
  }

  const handleDuplicateSchedule = async () => {
    if (!activeSchedule || !dialogScheduleName.trim()) {
      toast.error("Please enter a schedule name")
      return
    }

    setIsDialogLoading(true)
    const result = await duplicateSchedule(
      activeSchedule.id,
      dialogScheduleName.trim()
    )
    setIsDialogLoading(false)

    if (result.success && result.schedule) {
      setSchedules((prev) => [...prev, result.schedule!])
      setActiveSchedule(result.schedule)
      setDuplicateDialogOpen(false)
      setDialogScheduleName("")
      toast.success("Schedule duplicated successfully")
    } else {
      toast.error(result.error || "Failed to duplicate schedule")
    }
  }

  const handleDeleteSchedule = async () => {
    if (!activeSchedule) return

    if (schedules.length <= 1) {
      toast.error("Cannot delete the last schedule")
      setDeleteDialogOpen(false)
      return
    }

    setIsDialogLoading(true)
    const result = await deleteSchedule(activeSchedule.id)
    setIsDialogLoading(false)

    if (result.success) {
      const remainingSchedules = schedules.filter(
        (s) => s.id !== activeSchedule.id
      )
      setSchedules(remainingSchedules)
      // Switch to first remaining schedule (preferably default)
      const nextSchedule =
        remainingSchedules.find((s) => s.isDefault) || remainingSchedules[0]
      setActiveSchedule(nextSchedule)
      setDeleteDialogOpen(false)
      toast.success("Schedule deleted successfully")
    } else {
      toast.error(result.error || "Failed to delete schedule")
    }
  }

  // Event type linking handlers
  const handleOpenEventTypePopover = () => {
    // Open popover immediately
    setEventTypePopoverOpen(true)
    setEventTypeSearch("")
    // Initialize temp selection with currently linked event types
    const linkedIds = new Set(linkedEventTypes.map((et) => et.id))
    setTempSelectedEventTypeIds(linkedIds)

    // Load all event types asynchronously
    setIsEventTypeLoading(true)
    getEventTypes()
      .then((types) => {
        setAllEventTypes(types)
      })
      .finally(() => {
        setIsEventTypeLoading(false)
      })
  }

  const handleEventTypeToggle = (eventTypeId: string, checked: boolean) => {
    setTempSelectedEventTypeIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(eventTypeId)
      } else {
        newSet.delete(eventTypeId)
      }
      return newSet
    })
  }

  const handleSelectAllEventTypes = () => {
    const allIds = new Set(allEventTypes.map((et) => et.id))
    setTempSelectedEventTypeIds(allIds)
  }

  const handleClearAllEventTypes = () => {
    setTempSelectedEventTypeIds(new Set())
  }

  const handleApplyEventTypeChanges = async () => {
    if (!activeSchedule) return

    setIsEventTypeLinking(true)

    // Find what changed
    const currentLinkedIds = new Set(linkedEventTypes.map((et) => et.id))
    const toLink: string[] = []
    const toUnlink: string[] = []

    // Check what needs to be linked (selected but not currently linked)
    for (const id of tempSelectedEventTypeIds) {
      if (!currentLinkedIds.has(id)) {
        toLink.push(id)
      }
    }

    // Check what needs to be unlinked (currently linked but not selected)
    for (const id of currentLinkedIds) {
      if (!tempSelectedEventTypeIds.has(id)) {
        toUnlink.push(id)
      }
    }

    try {
      // Update each event type that needs linking
      for (const eventTypeId of toLink) {
        await updateEventType(eventTypeId, { scheduleId: activeSchedule.id })
      }

      // Update each event type that needs unlinking
      for (const eventTypeId of toUnlink) {
        await updateEventType(eventTypeId, { scheduleId: null })
      }

      // Reload linked event types
      const updatedLinkedTypes = await getEventTypesBySchedule(
        activeSchedule.id
      )
      setLinkedEventTypes(updatedLinkedTypes)

      toast.success("Event type links updated successfully")
      setEventTypePopoverOpen(false)
    } catch (error) {
      console.error("Failed to update event type links:", error)
      toast.error("Failed to update event type links")
    } finally {
      setIsEventTypeLinking(false)
    }
  }

  const handleCancelEventTypeChanges = () => {
    setEventTypePopoverOpen(false)
    setEventTypeSearch("")
  }

  // Filter event types based on search
  const filteredEventTypes = allEventTypes.filter((et) =>
    et.name.toLowerCase().includes(eventTypeSearch.toLowerCase())
  )

  const handleSwitchSchedule = (schedule: Schedule) => {
    if (hasChanges) {
      toast.error("Please save or discard changes before switching schedules")
      return
    }
    setActiveSchedule(schedule)
    // Update booking buffer from the selected schedule
    const buffer = schedule.bookingBuffer ?? 24
    setBookingBuffer(buffer)
    setOriginalBookingBuffer(buffer)
    setIsScheduleMenuOpen(false)
  }

  // Save availability
  const handleSave = async () => {
    if (!activeSchedule) return

    setIsSaving(true)
    try {
      // Save availability data
      const result = await saveAvailability({
        scheduleName: activeSchedule.name,
        weekly: weeklyToAPI(weeklySchedule),
        overrides: overridesToAPI(dateOverrides),
      })

      // Save booking buffer if changed
      if (bookingBuffer !== originalBookingBuffer) {
        const bufferResult = await updateScheduleSettings(activeSchedule.id, {
          bookingBuffer,
        })
        if (!bufferResult.success) {
          toast.error(
            bufferResult.error || "Failed to save booking buffer settings"
          )
          setIsSaving(false)
          return
        }
        // Update local schedule state with new booking buffer
        if (bufferResult.schedule) {
          setSchedules((prev) =>
            prev.map((s) =>
              s.id === activeSchedule.id ? bufferResult.schedule! : s
            )
          )
          setActiveSchedule(bufferResult.schedule)
        }
      }

      if (result.success) {
        toast.success("Availability saved successfully")
        // Update original state to current state after successful save
        setOriginalWeeklySchedule(JSON.parse(JSON.stringify(weeklySchedule)))
        setOriginalDateOverrides(
          JSON.parse(
            JSON.stringify(
              dateOverrides.map((o) => ({ ...o, date: o.date.toISOString() }))
            )
          )
        )
        setOriginalBookingBuffer(bookingBuffer)
      } else {
        toast.error(result.message || "Failed to save availability")
      }
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save availability")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleDay = useCallback((day: Day, isAvailable: boolean) => {
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
  }, [])

  const handleRemoveSlot = useCallback((day: Day, id: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item) => {
        if (item.day !== day) return item
        const newSlots = item.slots.filter((slot) => slot.id !== id)
        // Auto-unavailable when last slot is removed
        return {
          ...item,
          slots: newSlots,
          available: newSlots.length > 0,
        }
      })
    )
  }, [])

  const handleAddSlot = useCallback((day: Day) => {
    setWeeklySchedule((prev) =>
      prev.map((item) => {
        if (item.day !== day) return item
        const nextSlot = getNextTimeSlot(item.slots)
        return {
          ...item,
          available: true, // Automatically make available when adding a slot
          slots: [...item.slots, { id: String(Date.now()), ...nextSlot }],
        }
      })
    )
  }, [])

  const handleUpdateSlot = useCallback(
    (day: Day, id: string, field: "start" | "end", value: string) => {
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
    },
    []
  )

  const handleCopySlot = useCallback(
    (sourceDay: Day, targetDay: Day) => {
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
    },
    [weeklySchedule]
  )

  const handleAddDateOverride = useCallback(() => {
    if (!selectedDate) return

    const newOverride: DateOverride = {
      id: String(Date.now()),
      date: selectedDate,
      slots: markAsUnavailable ? [] : dialogSlots,
      isUnavailable: markAsUnavailable,
    }

    // Remove existing override for this date if it exists (replace behavior)
    setDateOverrides((prev) => {
      const filtered = prev.filter((override) => {
        const overrideDate = new Date(override.date)
        return !(
          overrideDate.getFullYear() === selectedDate.getFullYear() &&
          overrideDate.getMonth() === selectedDate.getMonth() &&
          overrideDate.getDate() === selectedDate.getDate()
        )
      })
      return [...filtered, newOverride]
    })
    setIsDateDialogOpen(false)
    setSelectedDate(undefined)
    setDialogSlots([
      { id: String(Date.now()), start: "09:00 AM", end: "05:00 PM" },
    ])
    setMarkAsUnavailable(false)
  }, [selectedDate, markAsUnavailable, dialogSlots])

  const handleRemoveDateOverride = useCallback((id: string) => {
    setDateOverrides((prev) => prev.filter((override) => override.id !== id))
  }, [])

  const handleDialogSlotUpdate = useCallback(
    (id: string, field: "start" | "end", value: string) => {
      setDialogSlots((prev) =>
        prev.map((slot) =>
          slot.id === id ? { ...slot, [field]: value } : slot
        )
      )
    },
    []
  )

  const handleDialogSlotRemove = useCallback((id: string) => {
    setDialogSlots((prev) => prev.filter((slot) => slot.id !== id))
  }, [])

  const handleDialogSlotAdd = useCallback(() => {
    setDialogSlots((prev) => {
      const nextSlot = getNextTimeSlot(prev)
      return [...prev, { id: String(Date.now()), ...nextSlot }]
    })
  }, [])

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

        {isLoading ? (
          <Skeleton className="h-[510px] w-full rounded-md" />
        ) : (
          <Card className="scroll flex h-[560px] flex-col pb-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between px-8">
              <div>
                <p className="text-muted-foreground text-sm">Schedule</p>
                {/* Schedule Selector Dropdown */}
                <div className="flex items-center">
                  <DropdownMenu onOpenChange={setIsScheduleMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="option"
                        className="text-main hover:text-main/90 -ml-3 flex h-auto cursor-pointer items-center gap-2 p-0 px-0 text-xl font-bold hover:bg-transparent"
                      >
                        {activeSchedule?.name || "Loading..."}
                        {activeSchedule?.isDefault && (
                          <span className="text-muted-foreground text-sm font-normal">
                            (default)
                          </span>
                        )}
                        {isScheduleMenuOpen ? (
                          <ChevronUp className="text-muted-foreground h-5 w-5" />
                        ) : (
                          <ChevronDown className="text-muted-foreground h-5 w-5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {schedules.map((schedule) => (
                        <DropdownMenuItem
                          key={schedule.id}
                          className="cursor-pointer justify-between"
                          onClick={() => handleSwitchSchedule(schedule)}
                        >
                          <span className="flex items-center gap-2">
                            {schedule.name}
                            {schedule.isDefault && (
                              <span className="text-muted-foreground text-xs">
                                (default)
                              </span>
                            )}
                          </span>
                          {activeSchedule?.id === schedule.id && (
                            <Check className="text-main h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                      <Separator />
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => {
                          setDialogScheduleName("")
                          setCreateDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4" /> Create Schedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active on Event Types indicator */}
                <Popover
                  open={eventTypePopoverOpen}
                  onOpenChange={(open) => {
                    if (open) {
                      handleOpenEventTypePopover()
                    } else {
                      handleCancelEventTypeChanges()
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <button className="mt-2 flex cursor-pointer items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Active on:</span>
                      <span className="text-link cursor-pointer font-medium decoration-2 underline-offset-4 hover:underline">
                        {linkedEventTypes.length === 0
                          ? "0 event types"
                          : linkedEventTypes.length === 1
                            ? "1 event type"
                            : `${linkedEventTypes.length} event types`}
                      </span>
                      <ChevronDown className="text-link h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-72 p-0"
                    sideOffset={8}
                  >
                    {/* Search Input */}
                    <div className="border-b p-3">
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          placeholder="Search..."
                          value={eventTypeSearch}
                          onChange={(e) => setEventTypeSearch(e.target.value)}
                          className="h-9 pl-9"
                        />
                      </div>
                    </div>

                    {/* Select All / Clear */}
                    <div className="flex items-center gap-2 border-b px-3 py-2 text-sm">
                      <button
                        onClick={handleSelectAllEventTypes}
                        className="text-link cursor-pointer decoration-2 underline-offset-4 hover:underline"
                      >
                        select all
                      </button>
                      <span className="text-muted-foreground">/</span>
                      <button
                        onClick={handleClearAllEventTypes}
                        className="text-link cursor-pointer decoration-2 underline-offset-4 hover:underline"
                      >
                        clear
                      </button>
                    </div>

                    {/* Event Types List */}
                    <ScrollArea className="max-h-64">
                      <div className="p-2">
                        {activeSchedule && (
                          <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wide uppercase">
                            Using {activeSchedule.name}
                          </div>
                        )}
                        {isEventTypeLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="text-main h-5 w-5 animate-spin" />
                          </div>
                        ) : filteredEventTypes.length === 0 ? (
                          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                            {eventTypeSearch
                              ? "No event types match your search"
                              : "No event types created yet"}
                          </div>
                        ) : (
                          filteredEventTypes.map((et) => (
                            <label
                              key={et.id}
                              className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2"
                            >
                              <Checkbox
                                checked={tempSelectedEventTypeIds.has(et.id)}
                                onCheckedChange={(checked) =>
                                  handleEventTypeToggle(et.id, checked === true)
                                }
                                className="data-[state=checked]:bg-main data-[state=checked]:border-main mt-0.5"
                              />
                              <div
                                className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: et.color }}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium">
                                  {et.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {et.duration} mins
                                </div>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-2 border-t p-3">
                      <Button
                        size="sm"
                        onClick={handleApplyEventTypeChanges}
                        disabled={isEventTypeLinking}
                        className="bg-main hover:bg-main/90 cursor-pointer"
                      >
                        {isEventTypeLinking ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : null}
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        className="cursor-pointer border"
                        variant="ghost"
                        onClick={handleCancelEventTypeChanges}
                      >
                        Cancel
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <ToggleGroup
                  type="single"
                  value={activeView}
                  onValueChange={(value: "list" | "calendar") =>
                    value && setActiveView(value)
                  }
                  className="bg-main/10 p-1"
                >
                  <ToggleGroupItem
                    value="list"
                    aria-label="Toggle list view"
                    className="data-[state=on]:text-main h-auto cursor-pointer p-2 pr-4 text-sm data-[state=on]:bg-white data-[state=on]:shadow-sm"
                  >
                    <List className="mr-1 h-4 w-4" /> List
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="calendar"
                    aria-label="Toggle calendar view"
                    className="data-[state=on]:text-main h-auto cursor-pointer p-2 text-sm data-[state=on]:bg-white data-[state=on]:shadow-sm"
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
                      <EllipsisVertical className="h-9 w-9" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setDialogScheduleName(activeSchedule?.name || "")
                        setRenameDialogOpen(true)
                      }}
                    >
                      <PencilLine className="text-muted-foreground mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-muted-foreground cursor-pointer"
                      onClick={() => {
                        setDialogScheduleName(
                          `${activeSchedule?.name || ""} (copy)`
                        )
                        setDuplicateDialogOpen(true)
                      }}
                    >
                      <Copy className="text-muted-foreground mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-muted-foreground cursor-pointer"
                      onClick={() => setBookingSettingsDialogOpen(true)}
                    >
                      <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                      Booking Settings
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={schedules.length <= 1}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="overflow-y-auto px-8">
              {activeView === "list" ? (
                <>
                  <div className="-pb-4 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
                    {/* Column 1: Weekly Hours */}
                    <WeeklyScheduleManager
                      weeklySchedule={weeklySchedule}
                      handleToggleDay={handleToggleDay}
                      handleRemoveSlot={handleRemoveSlot}
                      handleAddSlot={handleAddSlot}
                      handleCopySlot={handleCopySlot}
                      handleUpdateSlot={handleUpdateSlot}
                      daysWithOverlap={daysWithOverlap}
                    />

                    {/* Column 2: Date-Specific Hours */}
                    <DateOverrideManager
                      dateOverrides={dateOverrides}
                      handleRemoveDateOverride={handleRemoveDateOverride}
                      isDialogOpen={isDateDialogOpen}
                      setIsDialogOpen={setIsDateDialogOpen}
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
                      dialogHasOverlap={dialogHasOverlap}
                    />
                  </div>
                </>
              ) : (
                /* Calendar View */
                <AvailabilityCalendar
                  weeklySchedule={weeklySchedule}
                  dateOverrides={dateOverrides}
                />
              )}
            </CardContent>

            {/* Save Button Footer */}
            <div className="flex-shrink-0 justify-between border-t px-8 py-3">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-3">
                  {hasOverlap && (
                    <span className="text-main text-sm">
                      Time overlap detected on {daysWithOverlap.join(", ")}
                    </span>
                  )}
                  {hasChanges && !hasOverlap && (
                    <span className="text-muted-foreground text-sm">
                      You have unsaved changes
                    </span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || hasOverlap}
                    className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Availability"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        <div className="h-20"></div>
      </div>

      {/* Create Schedule Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Create a new availability schedule. You can have multiple
              schedules for different purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="schedule-name">Schedule Name</Label>
              <Input
                id="schedule-name"
                placeholder="e.g., Office Hours, Extended Hours"
                value={dialogScheduleName}
                onChange={(e) => setDialogScheduleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSchedule()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={isDialogLoading || !dialogScheduleName.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Schedule Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Schedule</DialogTitle>
            <DialogDescription>
              Enter a new name for this schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-schedule">Schedule Name</Label>
              <Input
                id="rename-schedule"
                value={dialogScheduleName}
                onChange={(e) => setDialogScheduleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSchedule()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSchedule}
              disabled={isDialogLoading || !dialogScheduleName.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Schedule Dialog */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Schedule</DialogTitle>
            <DialogDescription>
              Create a copy of &quot;{activeSchedule?.name}&quot; with all its
              availability settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duplicate-schedule">New Schedule Name</Label>
              <Input
                id="duplicate-schedule"
                value={dialogScheduleName}
                onChange={(e) => setDialogScheduleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDuplicateSchedule()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDuplicateDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDuplicateSchedule}
              disabled={isDialogLoading || !dialogScheduleName.trim()}
              className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Duplicating...
                </>
              ) : (
                "Duplicate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Schedule Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{activeSchedule?.name}
              &quot;? This will permanently remove the schedule and all its
              availability settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSchedule}
              disabled={isDialogLoading}
            >
              {isDialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Settings Dialog */}
      <Dialog
        open={bookingSettingsDialogOpen}
        onOpenChange={setBookingSettingsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Settings</DialogTitle>
            <DialogDescription>
              Configure booking rules for this schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="booking-buffer">Minimum advance notice</Label>
              <p className="text-muted-foreground text-xs">
                How far in advance must students book appointments?
              </p>
              <Select
                value={String(bookingBuffer)}
                onValueChange={async (value) => {
                  const newBuffer = Number(value)
                  setBookingBuffer(newBuffer)

                  if (!activeSchedule) return

                  const bufferResult = await updateScheduleSettings(
                    activeSchedule.id,
                    {
                      bookingBuffer: newBuffer,
                    }
                  )

                  if (bufferResult.success) {
                    if (bufferResult.schedule) {
                      setSchedules((prev) =>
                        prev.map((s) =>
                          s.id === activeSchedule.id
                            ? bufferResult.schedule!
                            : s
                        )
                      )
                      setActiveSchedule(bufferResult.schedule)
                    }
                    setOriginalBookingBuffer(newBuffer)
                    toast.success("Booking buffer updated successfully")
                  } else {
                    toast.error(
                      bufferResult.error || "Failed to update booking buffer"
                    )
                    setBookingBuffer(originalBookingBuffer)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select minimum notice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No minimum</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">1 day (24 hours)</SelectItem>
                  <SelectItem value="48">2 days (48 hours)</SelectItem>
                  <SelectItem value="72">3 days (72 hours)</SelectItem>
                  <SelectItem value="168">1 week (168 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookingSettingsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
