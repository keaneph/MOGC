"use client"

import {
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  X,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Appointment } from "@/lib/api/appointments"
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusDisplay,
  getCategoryDisplay,
} from "@/lib/api/appointments"
import { StudentAvatar } from "@/components/common/student-avatar"

interface AppointmentDetailsPanelProps {
  appointments: Appointment[]
  selectedDate: Date | null
  onClose?: () => void
  onCancel?: (appointmentId: string) => void
  userRole?: "student" | "counselor"
}

export function AppointmentDetailsPanel({
  appointments,
  selectedDate,
  onClose,
  onCancel,
  userRole = "student",
}: AppointmentDetailsPanelProps) {
  // Filter out cancelled appointments
  const activeAppointments = appointments.filter(
    (apt) => apt.status !== "cancelled"
  )

  // If no date selected, show all active appointments
  const dayAppointments = selectedDate
    ? activeAppointments.filter((apt) => {
        // Format date in local timezone to avoid UTC conversion issues
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
        const day = String(selectedDate.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${day}`
        return apt.scheduledDate === dateStr
      })
    : activeAppointments

  // Filter to show only Pending or Confirmed
  const filteredAppointments = dayAppointments.filter(
    (apt) => apt.status === "pending" || apt.status === "confirmed"
  )

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate)
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })

  // Determine title based on appointments shown
  const getTitle = () => {
    if (selectedDate) {
      return formatAppointmentDate(selectedDate.toISOString().split("T")[0])
    }
    const hasPending = sortedAppointments.some(
      (apt) => apt.status === "pending"
    )
    const hasConfirmed = sortedAppointments.some(
      (apt) => apt.status === "confirmed"
    )
    if (hasPending && hasConfirmed) {
      return "Pending & Confirmed"
    } else if (hasPending) {
      return "Pending"
    } else if (hasConfirmed) {
      return "Confirmed"
    }
    return "Appointments"
  }

  const formattedDate = getTitle()

  // Get day of week and date parts
  const getDateParts = () => {
    if (!selectedDate) return null
    // Use the selectedDate directly to avoid timezone conversion issues
    const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    })
    const formattedDatePart = selectedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    return { dayOfWeek, formattedDatePart }
  }

  const dateParts = getDateParts()

  if (sortedAppointments.length === 0) {
    return (
      <Card>
        <CardHeader className="relative pb-3">
          {onClose && selectedDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3 right-3 h-8 w-8 flex-shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div
            className={cn(
              "flex items-center justify-between gap-3",
              selectedDate && "pr-10"
            )}
          >
            <div className="min-w-0 flex-1">
              {dateParts ? (
                <>
                  <CardTitle className="text-lg font-semibold tracking-wide">
                    {dateParts.dayOfWeek}
                  </CardTitle>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {dateParts.formattedDatePart}
                  </p>
                </>
              ) : (
                <>
                  <CardTitle className="text-lg font-semibold tracking-wide">
                    {formattedDate}
                  </CardTitle>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    0 appointments
                  </p>
                </>
              )}
            </div>
            {!selectedDate && userRole === "counselor" && (
              <Link href="/counselor/appointments">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border h-8 flex-shrink-0 cursor-pointer rounded-sm text-xs"
                >
                  View All
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">
              {selectedDate
                ? "No appointments scheduled for this date."
                : "No appointments found."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border flex h-full flex-col rounded-md">
      <CardHeader className="border-border relative border-b pb-3">
        {/* Close button - positioned top right (only when date is selected) */}
        {onClose && selectedDate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 flex-shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {/* Date and View All button - on same row (View All only when no date selected) */}
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            selectedDate && "pr-10"
          )}
        >
          <div className="min-w-0 flex-1">
            {dateParts ? (
              <>
                <CardTitle className="text-lg font-semibold tracking-wide">
                  {dateParts.dayOfWeek}
                </CardTitle>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {dateParts.formattedDatePart}
                </p>
              </>
            ) : (
              <>
                <CardTitle className="text-lg font-semibold tracking-wide">
                  {formattedDate}
                </CardTitle>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {sortedAppointments.length}{" "}
                  {sortedAppointments.length === 1
                    ? "appointment"
                    : "appointments"}
                </p>
              </>
            )}
          </div>
          {!selectedDate && userRole === "counselor" && (
            <Link href="/counselor/appointments">
              <Button
                variant="outline"
                size="sm"
                className="border-border h-8 flex-shrink-0 cursor-pointer rounded-sm text-xs"
              >
                View All
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="divide-border divide-y">
            {sortedAppointments.map((apt) => {
              const statusInfo = getStatusDisplay(apt.status)
              const categoryInfo = apt.eventType?.category
                ? getCategoryDisplay(apt.eventType.category)
                : null

              return (
                <div
                  key={apt.id}
                  className="relative px-4 py-2.5 transition-colors hover:bg-gray-50/50"
                >
                  {/* Left color indicator */}
                  <div
                    className="absolute top-0 left-0 h-full w-1"
                    style={{
                      backgroundColor: apt.eventType?.color || "#991b1b",
                    }}
                  />

                  <div className="pl-3">
                    {/* Title row with status */}
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold tracking-wide">
                          {apt.eventType?.name || "Appointment"}
                        </h3>
                        {categoryInfo && (
                          <Badge
                            variant="outline"
                            className="border-border h-5 flex-shrink-0 rounded-sm px-1.5 text-[10px] font-medium"
                          >
                            {categoryInfo.label}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-5 flex-shrink-0 rounded-sm border-0 px-2 text-[10px] font-medium",
                          statusInfo.bgColor,
                          statusInfo.color
                        )}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="text-muted-foreground h-3.5 w-3.5" />
                        <span className="font-medium">
                          {formatAppointmentTime(apt.startTime)} -{" "}
                          {formatAppointmentTime(apt.endTime)}
                        </span>
                      </div>

                      {/* Location */}
                      {apt.locationDetails && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="max-w-[150px] truncate">
                            {apt.locationDetails}
                          </span>
                        </div>
                      )}

                      {/* Participant - with avatar */}
                      {userRole === "student" && apt.counselorInfo && (
                        <div className="flex items-center gap-1.5">
                          <User className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="max-w-[120px] truncate">
                            {apt.counselorInfo.name}
                          </span>
                        </div>
                      )}
                      {userRole === "counselor" && apt.studentInfo && (
                        <div className="flex items-center gap-1.5">
                          <StudentAvatar
                            name={apt.studentInfo.name}
                            avatarUrl={apt.studentInfo.avatarUrl}
                            size="xs"
                          />
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate">
                              {apt.studentInfo.name}
                            </span>
                            {apt.studentInfo.idNumber && (
                              <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                                ({apt.studentInfo.idNumber})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cancel button for students */}
                    {userRole === "student" &&
                      apt.status !== "cancelled" &&
                      apt.status !== "completed" && (
                        <div className="border-border mt-1.5 border-t pt-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 cursor-pointer rounded-sm border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onCancel?.(apt.id)}
                          >
                            Cancel Appointment
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
