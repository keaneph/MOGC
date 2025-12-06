"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Calendar,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  CalendarCheck,
  CalendarX,
  Filter,
  RefreshCcw,
  MapPin,
  Video,
  Phone,
  ChevronDown,
  AlertCircle,
  UserX,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import {
  getCounselorAppointments,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  markNoShow,
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusDisplay,
  getCategoryDisplay,
  isUpcoming,
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

// Appointment Card Component
function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onNoShow,
  onViewDetails,
}: {
  appointment: Appointment
  onConfirm: (apt: Appointment) => void
  onCancel: (apt: Appointment) => void
  onComplete: (apt: Appointment) => void
  onNoShow: (apt: Appointment) => void
  onViewDetails: (apt: Appointment) => void
}) {
  const statusDisplay = getStatusDisplay(appointment.status)
  const categoryDisplay = appointment.eventType?.category
    ? getCategoryDisplay(appointment.eventType.category)
    : null
  const upcoming = isUpcoming(appointment)
  const isPending = appointment.status === "pending"
  const isConfirmed = appointment.status === "confirmed"

  return (
    <Card
      className={`relative overflow-hidden py-0 transition-shadow hover:shadow-md ${
        !upcoming && appointment.status !== "pending" ? "opacity-70" : ""
      }`}
    >
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
              {/* Student Avatar */}
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <User className="h-3.5 w-3.5 text-gray-600" />
              </div>

              {/* Student Name */}
              <span className="min-w-[80px] font-medium text-gray-800">
                {appointment.studentInfo?.name || "Student"}
              </span>

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

            {isPending && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  className="h-7 cursor-pointer bg-green-600 px-2.5 text-xs hover:bg-green-700"
                  onClick={() => onConfirm(appointment)}
                >
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 cursor-pointer px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onCancel(appointment)}
                >
                  <XCircle className="mr-1 h-3.5 w-3.5" />
                  Decline
                </Button>
              </div>
            )}

            {isConfirmed && upcoming && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 cursor-pointer px-2.5 text-xs"
                  >
                    Actions
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer text-green-600"
                    onClick={() => onComplete(appointment)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-yellow-600"
                    onClick={() => onNoShow(appointment)}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Mark No-Show
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => onCancel(appointment)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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

export default function CounselorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming")

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [counselorNotes, setCounselorNotes] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [isDialogLoading, setIsDialogLoading] = useState(false)

  // Load appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCounselorAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Failed to load appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments]

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Time filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    switch (timeFilter) {
      case "upcoming":
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.scheduledDate)
          return (
            aptDate >= today && ["pending", "confirmed"].includes(apt.status)
          )
        })
        break
      case "today":
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.scheduledDate)
          return aptDate.toDateString() === today.toDateString()
        })
        break
      case "week":
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.scheduledDate)
          return aptDate >= today && aptDate < weekEnd
        })
        break
      case "past":
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.scheduledDate)
          return (
            aptDate < today ||
            ["completed", "cancelled", "no_show"].includes(apt.status)
          )
        })
        break
      // "all" - no time filtering
    }

    // Sort: pending first, then by date (descending - most recent first)
    filtered.sort((a, b) => {
      // Pending appointments first
      if (a.status === "pending" && b.status !== "pending") return -1
      if (b.status === "pending" && a.status !== "pending") return 1

      // Then by date (most recent first - descending order)
      const dateA = new Date(`${a.scheduledDate}T${a.startTime}`)
      const dateB = new Date(`${b.scheduledDate}T${b.startTime}`)
      return dateB.getTime() - dateA.getTime()
    })

    return filtered
  }, [appointments, statusFilter, timeFilter])

  // Stats
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return {
      pending: appointments.filter((a) => a.status === "pending").length,
      todayConfirmed: appointments.filter((a) => {
        const aptDate = new Date(a.scheduledDate)
        return (
          aptDate.toDateString() === today.toDateString() &&
          a.status === "confirmed"
        )
      }).length,
      thisWeek: appointments.filter((a) => {
        const aptDate = new Date(a.scheduledDate)
        const weekEnd = new Date(today)
        weekEnd.setDate(weekEnd.getDate() + 7)
        return (
          aptDate >= today &&
          aptDate < weekEnd &&
          ["pending", "confirmed"].includes(a.status)
        )
      }).length,
      completed: appointments.filter((a) => a.status === "completed").length,
    }
  }, [appointments])

  // Action handlers
  const handleConfirm = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setCounselorNotes("")
    setConfirmDialogOpen(true)
  }

  const handleCancel = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setCancelReason("")
    setCancelDialogOpen(true)
  }

  const handleComplete = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setCounselorNotes("")
    setCompleteDialogOpen(true)
  }

  const handleNoShow = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setCounselorNotes("")
    setNoShowDialogOpen(true)
  }

  const handleViewDetails = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setDetailsDialogOpen(true)
  }

  // Submit handlers
  const submitConfirm = async () => {
    if (!selectedAppointment) return
    setIsDialogLoading(true)
    const result = await confirmAppointment(
      selectedAppointment.id,
      counselorNotes || undefined
    )
    setIsDialogLoading(false)

    if (result.success) {
      toast.success("Appointment confirmed")
      setConfirmDialogOpen(false)
      loadAppointments()
    } else {
      toast.error(result.error || "Failed to confirm appointment")
    }
  }

  const submitCancel = async () => {
    if (!selectedAppointment) return
    setIsDialogLoading(true)
    const result = await cancelAppointment(
      selectedAppointment.id,
      cancelReason || undefined
    )
    setIsDialogLoading(false)

    if (result.success) {
      toast.success("Appointment cancelled")
      setCancelDialogOpen(false)
      loadAppointments()
    } else {
      toast.error(result.error || "Failed to cancel appointment")
    }
  }

  const submitComplete = async () => {
    if (!selectedAppointment) return
    setIsDialogLoading(true)
    const result = await completeAppointment(
      selectedAppointment.id,
      counselorNotes || undefined
    )
    setIsDialogLoading(false)

    if (result.success) {
      toast.success("Appointment marked as completed")
      setCompleteDialogOpen(false)
      loadAppointments()
    } else {
      toast.error(result.error || "Failed to complete appointment")
    }
  }

  const submitNoShow = async () => {
    if (!selectedAppointment) return
    setIsDialogLoading(true)
    const result = await markNoShow(
      selectedAppointment.id,
      counselorNotes || undefined
    )
    setIsDialogLoading(false)

    if (result.success) {
      toast.success("Appointment marked as no-show")
      setNoShowDialogOpen(false)
      loadAppointments()
    } else {
      toast.error(result.error || "Failed to mark no-show")
    }
  }

  return (
    <main id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage student booking requests and scheduled appointments
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
            value={stats.todayConfirmed}
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
              <SelectTrigger className="w-[180px]">
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
              onClick={loadAppointments}
              disabled={loading}
              className="cursor-pointer"
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <Skeleton className="h-[280px] w-full rounded-md" />
        ) : filteredAppointments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CalendarX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              No appointments found
            </h3>
            <p className="text-muted-foreground mt-1">
              {statusFilter !== "all" || timeFilter !== "all"
                ? "Try adjusting your filters"
                : "When students book appointments, they'll appear here"}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onNoShow={handleNoShow}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Confirm this appointment with{" "}
              {selectedAppointment?.studentInfo?.name || "the student"}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-sm bg-gray-50 p-3">
              <div className="font-medium">
                {selectedAppointment?.eventType?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedAppointment &&
                  formatAppointmentDate(selectedAppointment.scheduledDate)}{" "}
                at{" "}
                {selectedAppointment &&
                  formatAppointmentTime(selectedAppointment.startTime)}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add notes for this appointment..."
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitConfirm}
              disabled={isDialogLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDialogLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? The student will
              be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-sm bg-gray-50 p-3">
              <div className="font-medium">
                {selectedAppointment?.studentInfo?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedAppointment?.eventType?.name} -{" "}
                {selectedAppointment &&
                  formatAppointmentDate(selectedAppointment.scheduledDate)}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isDialogLoading}
              className="cursor-pointer tracking-wide"
            >
              Keep Appointment
            </Button>
            <Button
              onClick={submitCancel}
              disabled={isDialogLoading}
              className="bg-main hover:bg-main/90 cursor-pointer tracking-wide"
            >
              {isDialogLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Completed</DialogTitle>
            <DialogDescription>
              Mark this appointment session as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-sm bg-gray-50 p-3">
              <div className="font-medium">
                {selectedAppointment?.studentInfo?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedAppointment?.eventType?.name} -{" "}
                {selectedAppointment &&
                  formatAppointmentDate(selectedAppointment.scheduledDate)}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Session Notes (optional)</Label>
              <Textarea
                placeholder="Add notes about the session..."
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCompleteDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitComplete}
              disabled={isDialogLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDialogLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Mark Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No-Show Dialog */}
      <Dialog open={noShowDialogOpen} onOpenChange={setNoShowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as No-Show</DialogTitle>
            <DialogDescription>
              Mark this appointment as a no-show (student didn&apos;t attend).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 rounded-sm bg-gray-50 p-3">
              <div className="font-medium">
                {selectedAppointment?.studentInfo?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedAppointment?.eventType?.name} -{" "}
                {selectedAppointment &&
                  formatAppointmentDate(selectedAppointment.scheduledDate)}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes..."
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoShowDialogOpen(false)}
              disabled={isDialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitNoShow}
              disabled={isDialogLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isDialogLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserX className="mr-2 h-4 w-4" />
              )}
              Mark No-Show
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="font-semibold">
                    {selectedAppointment.studentInfo?.name || "Student"}
                  </div>
                  {selectedAppointment.studentInfo?.idNumber && (
                    <div className="text-muted-foreground text-sm">
                      ID: {selectedAppointment.studentInfo.idNumber}
                    </div>
                  )}
                </div>
                <Badge
                  className={`ml-auto border-0 ${getStatusDisplay(selectedAppointment.status).bgColor} ${getStatusDisplay(selectedAppointment.status).color}`}
                >
                  {getStatusDisplay(selectedAppointment.status).label}
                </Badge>
              </div>

              {/* Event Type */}
              <div className="rounded-sm border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: selectedAppointment.eventType?.color,
                    }}
                  />
                  <span className="font-medium">
                    {selectedAppointment.eventType?.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedAppointment.eventType?.duration} minutes •{" "}
                  {selectedAppointment.eventType?.category &&
                    getCategoryDisplay(selectedAppointment.eventType.category)
                      .label}
                </div>
              </div>

              {/* Schedule Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>
                    {formatAppointmentDate(selectedAppointment.scheduledDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span>
                    {formatAppointmentTime(selectedAppointment.startTime)} -{" "}
                    {formatAppointmentTime(selectedAppointment.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getLocationIcon(selectedAppointment.locationType)}
                  <span>
                    {getLocationLabel(selectedAppointment.locationType)}
                    {selectedAppointment.locationDetails &&
                      ` - ${selectedAppointment.locationDetails}`}
                  </span>
                </div>
              </div>

              {/* Student Notes */}
              {selectedAppointment.studentNotes && (
                <div className="rounded-sm bg-gray-50 p-3">
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Student Notes
                  </div>
                  <p className="text-sm">{selectedAppointment.studentNotes}</p>
                </div>
              )}

              {/* Counselor Notes */}
              {selectedAppointment.counselorNotes && (
                <div className="rounded-sm bg-blue-50 p-3">
                  <div className="mb-1 text-xs font-medium text-blue-700">
                    Your Notes
                  </div>
                  <p className="text-sm">
                    {selectedAppointment.counselorNotes}
                  </p>
                </div>
              )}

              {/* Cancellation Reason */}
              {selectedAppointment.status === "cancelled" &&
                selectedAppointment.cancellationReason && (
                  <div className="rounded-sm bg-red-50 p-3">
                    <div className="mb-1 text-xs font-medium text-red-700">
                      Cancellation Reason
                    </div>
                    <p className="text-sm">
                      {selectedAppointment.cancellationReason}
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
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
