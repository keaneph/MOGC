"use client"

import React, { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

interface AvailabilityCalendarProps {
  weeklySchedule: WeeklyAvailability[]
  dateOverrides: DateOverride[]
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAY_NAMES: Day[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  weeklySchedule,
  dateOverrides,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get month info
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDayOfMonth.getDay()
  const totalDays = lastDayOfMonth.getDate()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [year, month, startDayOfWeek, totalDays])

  // Helper to check if a date has an override
  const getOverrideForDate = (date: Date): DateOverride | undefined => {
    return dateOverrides.find((override) => {
      const overrideDate = new Date(override.date)
      return (
        overrideDate.getFullYear() === date.getFullYear() &&
        overrideDate.getMonth() === date.getMonth() &&
        overrideDate.getDate() === date.getDate()
      )
    })
  }

  // Get availability info for a date
  const getAvailabilityForDate = (
    date: Date
  ): {
    isAvailable: boolean
    slots: TimeSlot[]
    isOverride: boolean
    isUnavailable: boolean
  } => {
    const dayOfWeek = date.getDay()
    const dayName = DAY_NAMES[dayOfWeek]

    // Check for date override first
    const override = getOverrideForDate(date)
    if (override) {
      return {
        isAvailable: !override.isUnavailable && override.slots.length > 0,
        slots: override.slots,
        isOverride: true,
        isUnavailable: override.isUnavailable || false,
      }
    }

    // Fall back to weekly schedule
    const weeklyDay = weeklySchedule.find((w) => w.day === dayName)
    return {
      isAvailable: weeklyDay?.available || false,
      slots: weeklyDay?.slots || [],
      isOverride: false,
      isUnavailable: !weeklyDay?.available,
    }
  }

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  // Check if date is in the past
  const isPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="cursor-pointer text-sm hover:bg-red-50 hover:text-red-800"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-9 w-9 cursor-pointer hover:bg-red-50 hover:text-red-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-9 w-9 cursor-pointer hover:bg-red-50 hover:text-red-800"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="bg-main h-3.5 w-3.5 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-gray-300"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-amber-100"></div>
          <span>Date Override</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          <TooltipProvider>
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[100px] border-r border-b border-gray-100 bg-gray-50/30 p-2"
                  />
                )
              }

              const { isAvailable, slots, isOverride, isUnavailable } =
                getAvailabilityForDate(date)
              const dateIsToday = isToday(date)
              const dateIsPast = isPast(date)

              return (
                <Tooltip key={date.toISOString()}>
                  <TooltipTrigger asChild>
                    <div
                      className={`min-h-[100px] cursor-default border-r border-b border-gray-100 p-2 transition-colors ${
                        dateIsPast ? "bg-gray-50/50 opacity-60" : "bg-white"
                      } ${dateIsToday ? "bg-red-50/50" : ""} ${
                        isOverride && !dateIsPast ? "bg-amber-50/50" : ""
                      }`}
                    >
                      {/* Day Number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold ${
                            dateIsToday
                              ? "bg-main text-white"
                              : isAvailable && !dateIsPast
                                ? "text-gray-800"
                                : "text-gray-400"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {isOverride && (
                          <CalendarDays className="h-4 w-4 text-amber-600" />
                        )}
                      </div>

                      {/* Availability Indicator */}
                      <div className="mt-2">
                        {isUnavailable ? (
                          <span className="text-xs font-medium text-gray-400">
                            Unavailable
                          </span>
                        ) : isAvailable ? (
                          <span className="text-xs font-semibold text-red-700">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">
                            Not set
                          </span>
                        )}
                      </div>

                      {/* Time Preview */}
                      {isAvailable && slots.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {slots.slice(0, 2).map((slot, idx) => (
                            <div
                              key={idx}
                              className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${
                                isOverride
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {slot.start.replace(":00", "")} –{" "}
                              {slot.end.replace(":00", "")}
                            </div>
                          ))}
                          {slots.length > 2 && (
                            <div className="text-muted-foreground px-1.5 text-[11px]">
                              +{slots.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[240px] border !bg-white"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {isOverride && (
                        <p className="flex items-center gap-1.5 text-sm text-amber-700">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Date override active
                        </p>
                      )}
                      {isUnavailable ? (
                        <p className="text-muted-foreground text-sm">
                          Marked as unavailable
                        </p>
                      ) : isAvailable ? (
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">
                            Available times:
                          </p>
                          {slots.map((slot, idx) => (
                            <p
                              key={idx}
                              className="text-main text-xs font-medium"
                            >
                              {slot.start} – {slot.end}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No availability set
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
