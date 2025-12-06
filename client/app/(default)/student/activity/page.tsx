"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserX,
  MapPin,
  Video,
  Phone,
  CalendarCheck,
  Filter,
  RefreshCcw,
  CalendarX,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getStudentAppointments,
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusDisplay,
  getCategoryDisplay,
  type Appointment,
} from "@/lib/api/appointments"

// Status filter options
type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled"

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

// Time filter options
type TimeFilter = "upcoming" | "today" | "week" | "past" | "all"

const TIME_FILTERS: { label: string; value: TimeFilter }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "Past", value: "past" },
  { label: "All Time", value: "all" },
]

// Get location icon
const getLocationIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />
    case "phone":
      return <Phone className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

// Get location label
const getLocationLabel = (type: string) => {
  switch (type) {
    case "video":
      return "Video Call"
    case "phone":
      return "Phone Call"
    default:
      return "In Person"
  }
}

// Stats Card Component
function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-muted-foreground text-sm">{label}</div>
        </div>
      </div>
    </Card>
  )
}

// Activity Card Component
function ActivityCard({
  appointment,
  onViewDetails,
}: {
  appointment: Appointment
  onViewDetails: (apt: Appointment) => void
}) {
  const statusDisplay = getStatusDisplay(appointment.status)
  const categoryDisplay = appointment.eventType?.category
    ? getCategoryDisplay(appointment.eventType.category)
    : null

  return (
    <Card className="relative overflow-hidden py-0 transition-shadow hover:shadow-md">
      {/* Color bar from event type */}
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{ backgroundColor: appointment.eventType?.color || "#991b1b" }}
      />

      <CardContent className="px-4 py-3 pl-4">
        <div className="flex items-center justify-between gap-4">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Single Row Layout */}
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${statusDisplay.bgColor}`}
              >
                {appointment.status === "completed" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                )}
                {appointment.status === "confirmed" && (
                  <Clock className="h-3.5 w-3.5 text-blue-700" />
                )}
                {appointment.status === "pending" && (
                  <AlertCircle className="h-3.5 w-3.5 text-yellow-700" />
                )}
                {appointment.status === "cancelled" && (
                  <XCircle className="h-3.5 w-3.5 text-red-700" />
                )}
                {appointment.status === "no_show" && (
                  <UserX className="h-3.5 w-3.5 text-gray-700" />
                )}
              </div>

              {/* Event Type with color dot */}
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: appointment.eventType?.color }}
                />
                <span className="text-sm">
                  {appointment.eventType?.name || "Appointment"}
                </span>
                {categoryDisplay && (
                  <Badge variant="outline" className="h-5 px-1.5 text-xs">
                    {categoryDisplay.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Date, Time, Location Row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatAppointmentDate(appointment.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {formatAppointmentTime(appointment.startTime)} -{" "}
                  {formatAppointmentTime(appointment.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {getLocationIcon(appointment.locationType)}
                <span>{getLocationLabel(appointment.locationType)}</span>
              </div>
            </div>
          </div>

          {/* Status Badge + Actions */}
          <div className="flex items-center gap-3">
            <Badge
              className={`border-0 ${statusDisplay.bgColor} ${statusDisplay.color}`}
            >
              {statusDisplay.label}
            </Badge>

            <Button
              size="sm"
              variant="ghost"
              className="h-7 cursor-pointer px-2 text-xs"
              onClick={() => onViewDetails(appointment)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ActivityPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  // Load appointments data
  const loadData = async () => {
    setLoading(true)
    try {
      const appointmentsData = await getStudentAppointments()
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate stats from appointments
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get start of current week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    return {
      pending: appointments.filter((apt) => apt.status === "pending").length,
      today: appointments.filter((apt) => {
        const aptDate = new Date(apt.scheduledDate)
        aptDate.setHours(0, 0, 0, 0)
        return (
          apt.status === "confirmed" && aptDate.getTime() === today.getTime()
        )
      }).length,
      thisWeek: appointments.filter((apt) => {
        const aptDate = new Date(apt.scheduledDate)
        return (
          apt.status === "confirmed" &&
          aptDate >= startOfWeek &&
          aptDate < endOfWeek
        )
      }).length,
      completed: appointments.filter((apt) => apt.status === "completed")
        .length,
    }
  }, [appointments])

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get start of current week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    let filtered = appointments

    // Apply status filter first if not "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Apply time filter
    if (timeFilter !== "all") {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.scheduledDate)
        aptDate.setHours(0, 0, 0, 0)

        if (timeFilter === "upcoming") {
          // Upcoming = pending appointments
          return apt.status === "pending"
        } else if (timeFilter === "today") {
          // Today = pending appointments scheduled for today
          return (
            apt.status === "pending" && aptDate.getTime() === today.getTime()
          )
        } else if (timeFilter === "week") {
          // This Week = pending appointments scheduled this week
          return (
            apt.status === "pending" &&
            aptDate >= startOfWeek &&
            aptDate < endOfWeek
          )
        } else if (timeFilter === "past") {
          // Past = completed appointments
          return apt.status === "completed"
        }
        return true
      })
    }

    // Sort by most recent first (descending order)
    return filtered.sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime()
    )
  }, [appointments, timeFilter, statusFilter])

  return (
    <div className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">Activity</h1>
          <p className="text-muted-foreground mt-1">
            Track your counseling sessions, appointments, and progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatsCard
            icon={AlertCircle}
            label="Pending"
            value={stats.pending}
            color="bg-yellow-100 text-yellow-700"
          />
          <StatsCard
            icon={CalendarCheck}
            label="Today"
            value={stats.today}
            color="bg-blue-100 text-blue-700"
          />
          <StatsCard
            icon={Calendar}
            label="This Week"
            value={stats.thisWeek}
            color="bg-purple-100 text-purple-700"
          />
          <StatsCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
            color="bg-green-100 text-green-700"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* Time Filter Tabs */}
          <Tabs
            value={timeFilter}
            onValueChange={(v) => setTimeFilter(v as TimeFilter)}
          >
            <TabsList>
              {TIME_FILTERS.map((filter) => (
                <TabsTrigger
                  key={filter.value}
                  value={filter.value}
                  className="cursor-pointer"
                >
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="ml-auto flex items-center gap-2">
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={loadData}
              disabled={loading}
              className="cursor-pointer"
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Activity Timeline */}
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            {filteredAppointments.slice(0, 20).map((appointment) => (
              <ActivityCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={setSelectedAppointment}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CalendarX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              No appointments found
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Try adjusting your filters or book a new appointment
            </p>
          </Card>
        )}

        {/* Appointment Details Dialog */}
        {selectedAppointment && (
          <Dialog
            open={!!selectedAppointment}
            onOpenChange={() => setSelectedAppointment(null)}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Event Type */}
                <div>
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    Event Type
                  </h4>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: selectedAppointment.eventType?.color,
                      }}
                    />
                    <span className="font-medium">
                      {selectedAppointment.eventType?.name || "Appointment"}
                    </span>
                    {selectedAppointment.eventType?.category && (
                      <Badge variant="outline" className="text-xs">
                        {
                          getCategoryDisplay(
                            selectedAppointment.eventType.category
                          ).label
                        }
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Schedule Details */}
                <div>
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    Schedule Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span>
                        {formatAppointmentDate(
                          selectedAppointment.scheduledDate
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span>
                        {formatAppointmentTime(selectedAppointment.startTime)} -{" "}
                        {formatAppointmentTime(selectedAppointment.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getLocationIcon(selectedAppointment.locationType)}
                      <span>
                        {getLocationLabel(selectedAppointment.locationType)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Notes */}
                {selectedAppointment.eventType?.description && (
                  <div>
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Event Description
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedAppointment.eventType.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="border-t pt-2 text-xs text-gray-400">
                  <div>
                    Created:{" "}
                    {new Date(selectedAppointment.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )}
                  </div>
                  {selectedAppointment.confirmedAt && (
                    <div>
                      Confirmed:{" "}
                      {new Date(selectedAppointment.confirmedAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                  )}
                  {selectedAppointment.completedAt && (
                    <div>
                      Completed:{" "}
                      {new Date(selectedAppointment.completedAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                  )}
                  {selectedAppointment.cancelledAt && (
                    <div>
                      Cancelled:{" "}
                      {new Date(selectedAppointment.cancelledAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
