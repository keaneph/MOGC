"use client"

import { useState, useMemo } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/lib/api/appointments"
import { formatAppointmentTime, getStatusDisplay } from "@/lib/api/appointments"

interface AppointmentsCalendarProps {
  appointments: Appointment[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function AppointmentsCalendar({
  appointments,
  onDateSelect,
  selectedDate,
}: AppointmentsCalendarProps) {
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

  // Filter out cancelled appointments
  const activeAppointments = appointments.filter(
    (apt) => apt.status !== "cancelled"
  )

  // Get appointments for a specific date (only pending or confirmed)
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    // Format date in local timezone to avoid UTC conversion issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateStr = `${year}-${month}-${day}`
    return activeAppointments.filter(
      (apt) =>
        apt.scheduledDate === dateStr &&
        (apt.status === "pending" || apt.status === "confirmed")
    )
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
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
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

  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    )
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-main h-5 w-5" />
          <h2 className="text-lg font-semibold tracking-wide">{monthName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="cursor-pointer text-xs tracking-wide"
          >
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-sm border border-gray-200">
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
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[100px] border-r border-b border-gray-100 bg-gray-50/30 p-2"
                />
              )
            }

            const dateAppointments = getAppointmentsForDate(date)
            const dateIsToday = isToday(date)
            const dateIsPast = isPast(date)
            const dateIsSelected = isSelected(date)

            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateSelect?.(date)}
                className={cn(
                  "group relative min-h-[100px] border-r border-b border-gray-100 p-2 text-left transition-colors",
                  "hover:bg-accent/50 focus:ring-ring focus:ring-2 focus:ring-offset-1 focus:outline-none",
                  dateIsToday && "bg-accent/30",
                  dateIsSelected && "bg-primary/10 ring-primary ring-2",
                  dateIsPast && "opacity-60"
                )}
              >
                {/* Date Number */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold",
                      dateIsToday ? "bg-main text-white" : "text-gray-800"
                    )}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Appointments */}
                <div className="space-y-1">
                  {dateAppointments.slice(0, 2).map((apt) => {
                    const statusInfo = getStatusDisplay(apt.status)
                    return (
                      <div
                        key={apt.id}
                        className={cn(
                          "truncate rounded-sm border px-1.5 py-1 text-xs",
                          "bg-primary/10 text-primary border-primary/20",
                          apt.status === "cancelled" &&
                            "border-red-200 bg-red-50 text-red-700",
                          apt.status === "completed" &&
                            "border-green-200 bg-green-50 text-green-700",
                          apt.status === "confirmed" &&
                            "border-blue-200 bg-blue-50 text-blue-700",
                          apt.status === "pending" &&
                            "border-yellow-200 bg-yellow-50 text-yellow-700"
                        )}
                        title={`${apt.eventType?.name || "Appointment"} - ${formatAppointmentTime(apt.startTime)}`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="truncate font-medium">
                            {formatAppointmentTime(apt.startTime)}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-[10px]">
                          {apt.eventType?.name || "Appointment"}
                        </div>
                      </div>
                    )
                  })}
                  {dateAppointments.length > 2 && (
                    <div className="text-muted-foreground px-1.5 py-0.5 text-[10px]">
                      +{dateAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm border border-yellow-200 bg-yellow-50" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm border border-blue-200 bg-blue-50" />
          <span>Confirmed</span>
        </div>
      </div>
    </div>
  )
}
