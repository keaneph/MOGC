"use client"

import {
  CheckCircle2,
  MessageSquare,
  ClipboardList,
  UserCheck,
  LogOut,
  Calendar,
  BookOpen,
  CircleAlertIcon,
  LucideIcon,
  Loader2,
  Clock,
  MapPin,
  Video,
  Phone,
} from "lucide-react"

import Image from "next/image"
import Mochi from "@/public/mochi_peek.png"
import Siklab from "@/public/siklab_peek.png"

import { useState, useMemo, useEffect, useCallback } from "react"

import { PrimaryButton } from "@/components/common/primary-button"

import { TooltipThis } from "@/components/feedback/tooltip-this"

import { Card } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Empty,
  EmptyHeader,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"

import {
  getStudentAppointments,
  getAvailableSlots,
  createBooking,
  cancelAppointment,
  formatAppointmentTime,
  type Appointment,
  type TimeSlot,
  type EventTypeCategory,
} from "@/lib/api/appointments"
import { getPublicEventTypes, type EventType } from "@/lib/api/event-types"
import { getAssignedCounselor } from "@/lib/api/counselors"

export type BookingStatus = "not-booked" | "pending" | "confirmed" | "completed"

export interface BookingState {
  status: BookingStatus
  bookedDate?: string
  time?: string
  appointmentId?: string
  eventType?: EventType
}

// Category to booking key mapping
type CategoryKey = "interview" | "counseling" | "assessment" | "exit"

type BookingStatuses = Record<CategoryKey, BookingState>

interface SessionConfig {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: LucideIcon
  duration: string
  format: string
  expectations: string[]
  category: EventTypeCategory
  bookingKey: CategoryKey
  buttonText: string
  tooltipLabel: string
}

const SESSION_CONFIGS: SessionConfig[] = [
  {
    id: "initial-interview",
    title: "Counselor Initial Interview",
    shortTitle: "Interview",
    description:
      "Your first step in the guidance journey. Meet with your assigned counselor to introduce yourself, share your background, and establish a supportive relationship.",
    icon: UserCheck,
    duration: "30 minutes",
    format: "One-on-One",
    expectations: [
      "Introduce yourself and share your academic background",
      "Discuss your goals, strengths, and areas for improvement",
      "Complete a personal profile questionnaire for your records",
      "Establish a personalized guidance plan tailored to your needs",
    ],
    category: "interview",
    bookingKey: "interview",
    buttonText: "Book Interview",
    tooltipLabel: "Schedule your initial interview now!",
  },
  {
    id: "counseling",
    title: "Counseling",
    shortTitle: "Counseling",
    description:
      "Engage in supportive sessions to navigate academic, personal, and social challenges. Our counselors provide a safe, confidential space to develop effective strategies.",
    icon: MessageSquare,
    duration: "30 - 60 minutes",
    format: "One-on-One, One-to-Many",
    expectations: [
      "Address academic challenges such as study habits and time management",
      "Discuss personal or social concerns in a confidential setting",
      "Develop coping strategies and problem-solving skills",
      "Explore career interests and receive guidance on future planning",
    ],
    category: "counseling",
    bookingKey: "counseling",
    buttonText: "Book Session",
    tooltipLabel: "Schedule your counseling session!",
  },
  {
    id: "test-interpretation",
    title: "Tests and Interpretation",
    shortTitle: "Tests",
    description:
      "Discover your strengths, interests, and personality traits through standardized assessments. Receive an in-depth interpretation to guide your academic and career decisions.",
    icon: ClipboardList,
    duration: "60 minutes",
    format: "One-on-One",
    expectations: [
      "Complete standardized psychological and aptitude assessments",
      "Receive a comprehensive interpretation of your test results",
      "Identify your strengths, interests, and areas for development",
      "Get personalized career path recommendations based on your profile",
    ],
    category: "assessment",
    bookingKey: "assessment",
    buttonText: "Book Assessment",
    tooltipLabel: "Schedule your assessment!",
  },
  {
    id: "exit-interview",
    title: "Exit Interview",
    shortTitle: "Exit",
    description:
      "Conclude your guidance journey with a reflective session. Review your progress, celebrate achievements, and discuss actionable next steps for the future.",
    icon: LogOut,
    duration: "30-45 minutes",
    format: "One-on-One",
    expectations: [
      "Review your complete counseling journey and milestones achieved",
      "Reflect on personal growth and skills developed during sessions",
      "Discuss future goals and create an actionable plan",
      "Receive final recommendations, resources, and referrals if needed",
    ],
    category: "exit",
    bookingKey: "exit",
    buttonText: "Book Interview",
    tooltipLabel: "Schedule your exit interview!",
  },
]

const STATUS_COLORS = {
  completed: {
    bg: "bg-green-100",
    text: "text-green-600",
    dot: "bg-green-500",
  },
  confirmed: { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
  },
  "not-booked": {
    bg: "bg-purple-100",
    text: "text-purple-600",
    dot: "bg-purple-500",
  },
} as const

const STATUS_LABELS: Record<BookingStatus, string> = {
  completed: "Completed",
  confirmed: "Confirmed",
  pending: "Pending",
  "not-booked": "Not Booked",
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not scheduled"
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function SessionContent({
  config,
  bookingState,
  onBookClick,
  onCancelClick,
}: {
  config: SessionConfig
  bookingState: BookingState
  onBookClick: () => void
  onCancelClick?: () => void
}) {
  const colors = STATUS_COLORS[bookingState.status]
  const isCompleted = bookingState.status === "completed"
  const isScheduled =
    bookingState.status === "pending" || bookingState.status === "confirmed"

  // Get location icon based on event type
  const LocationIcon =
    bookingState.eventType?.locationType === "video"
      ? Video
      : bookingState.eventType?.locationType === "phone"
        ? Phone
        : MapPin

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-main/5 flex h-12 w-12 items-center justify-center rounded-sm">
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-[var(--status-green)]" />
            ) : (
              <config.icon className="text-main h-6 w-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              {config.title}
            </h2>
            <p className="text-main2 text-sm">
              {bookingState.eventType
                ? `${bookingState.eventType.duration} minutes`
                : config.duration}{" "}
              • {config.format}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-2 rounded-sm px-3 py-1.5 ${colors.bg}`}
        >
          <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
          <span className={`text-xs font-medium tracking-wide ${colors.text}`}>
            {STATUS_LABELS[bookingState.status]}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-1 gap-10">
        {/* Left Column - Description & Expectations */}
        <div className="flex flex-1 flex-col">
          {/* Description */}
          <p className="text-main2 mb-8 text-sm leading-relaxed font-medium tracking-wide">
            {bookingState.eventType?.description || config.description}
          </p>

          {/* Expectations */}
          <div>
            <div className="mb-4 text-sm font-semibold tracking-wide">
              What to Expect
            </div>
            <ul className="space-y-4">
              {config.expectations.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-main bg-main/10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-main2 leading-relaxed font-medium tracking-wide">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Schedule Card & Actions */}
        <div className="flex w-72 flex-shrink-0 flex-col gap-3">
          {/* Scheduled Date Card */}
          <div className="flex flex-col rounded-sm border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="text-main h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">
                Schedule
              </span>
            </div>

            {isScheduled && bookingState.bookedDate ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tracking-wide">
                    {bookingState.status === "confirmed"
                      ? "Confirmed"
                      : "Pending Approval"}
                  </span>
                </div>
                <div className="text-main2 flex items-center gap-1.5 text-xs">
                  <span>{formatDate(bookingState.bookedDate)}</span>
                  {bookingState.time && (
                    <>
                      <span>•</span>
                      <span className="text-main font-medium">
                        {bookingState.time}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--status-green)]" />
                <span className="text-sm font-medium tracking-wide">
                  Completed
                </span>
              </div>
            ) : (
              <div className="text-main2 text-sm">Not scheduled</div>
            )}
          </div>

          {/* Format/Location Card */}
          <div className="flex flex-col rounded-sm border p-4">
            <div className="mb-3 flex items-center gap-2">
              <LocationIcon className="text-main h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">
                {bookingState.eventType?.locationType === "video"
                  ? "Video Call"
                  : bookingState.eventType?.locationType === "phone"
                    ? "Phone Call"
                    : "In Person"}
              </span>
            </div>

            {isScheduled && bookingState.bookedDate ? (
              <div className="space-y-1">
                <span className="text-sm font-medium tracking-wide">
                  {bookingState.eventType?.name || config.format.includes(",")
                    ? config.format.split(",")[0].trim()
                    : config.format}
                </span>
                <div className="text-main2 text-xs">
                  {bookingState.eventType?.locationDetails ||
                    "Details to be provided"}
                </div>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--status-green)]" />
                <span className="text-sm font-medium tracking-wide">
                  Completed
                </span>
              </div>
            ) : (
              <div className="text-main2 text-sm">Not scheduled</div>
            )}
          </div>

          {/* Action Buttons - Bottom Right */}
          <div className="mt-auto flex flex-col gap-2 pt-8">
            {!isCompleted ? (
              <>
                <div className="flex items-center justify-end gap-4">
                  <TooltipThis label="Learn more about this session">
                    <button className="text-link cursor-pointer text-sm decoration-2 underline-offset-4 hover:underline">
                      Learn more
                    </button>
                  </TooltipThis>
                  {!isScheduled ? (
                    <TooltipThis label={config.tooltipLabel}>
                      <PrimaryButton
                        content={config.buttonText}
                        onClick={onBookClick}
                      />
                    </TooltipThis>
                  ) : (
                    <TooltipThis label="Cancel this appointment">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={onCancelClick}
                      >
                        Cancel Booking
                      </Button>
                    </TooltipThis>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--status-green)]" />
                <span className="text-sm font-medium tracking-wide">
                  Session completed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverContent({
  bookingStatuses,
  setActiveTab,
}: {
  bookingStatuses: BookingStatuses
  setActiveTab: (tab: string) => void
}) {
  return (
    <div className="relative h-full">
      {/* Siklab Peek - Left */}
      <Image
        src={Siklab}
        alt="Siklab peeking"
        width={300}
        height={300}
        className="pointer-events-none absolute bottom-30 -left-33.5 z-10 translate-y-[35%]"
      />

      {/* Mochi Peek - Right */}
      <Image
        src={Mochi}
        alt="Mochi peeking"
        width={350}
        height={350}
        className="pointer-events-none absolute -right-34 bottom-30 z-10 translate-y-[35%]"
      />

      <Empty className="!justify-start rounded-sm pt-6 !pb-0">
        <EmptyHeader>
          <EmptyTitle className="text-3xl font-semibold tracking-wide">
            Student Guidance
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent className="text-md text-main4 gap-8 text-base tracking-wide">
          <div>Manage your counseling journey</div>

          {/* Session Cards - 2x2 Grid */}
          <div className="grid w-full max-w-xl grid-cols-2 gap-3">
            {SESSION_CONFIGS.map((config, index) => {
              const state = bookingStatuses[config.bookingKey]
              const colors = STATUS_COLORS[state.status]
              const isCompleted = state.status === "completed"

              return (
                <button
                  key={config.id}
                  onClick={() => setActiveTab(config.id)}
                  className="hover:bg-muted/50 cursor-pointer rounded-sm border p-3 text-left transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border-2 ${
                        isCompleted
                          ? "border-green-500 bg-green-50"
                          : "border-border bg-background"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-green)]" />
                      ) : (
                        <span className="text-main2 text-xs font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-medium tracking-wide">
                          {config.shortTitle}
                        </span>
                        <div
                          className={`flex items-center gap-1.5 text-xs ${colors.text}`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span
                              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors.dot}`}
                            />
                            <span
                              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colors.dot}`}
                            />
                          </span>
                          {STATUS_LABELS[state.status]}
                        </div>
                      </div>

                      {/* Date info */}
                      <div className="text-main2 mt-1 flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {state.bookedDate ? (
                          <span>
                            {formatDate(state.bookedDate)}
                            {state.time && ` • ${state.time}`}
                          </span>
                        ) : (
                          <span>Not scheduled</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}

// Booking Dialog Component
function BookingDialog({
  isOpen,
  onClose,
  config,
  counselorId,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  config: SessionConfig
  counselorId: string
  onSuccess: () => void
}) {
  const [step, setStep] = useState<"event-type" | "date" | "time" | "confirm">(
    "event-type"
  )
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load event types for this category
  useEffect(() => {
    if (isOpen && counselorId) {
      setLoading(true)
      getPublicEventTypes(counselorId, config.category)
        .then((types) => {
          setEventTypes(types)
          // Auto-select if only one
          if (types.length === 1) {
            setSelectedEventType(types[0])
            setStep("date")
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, counselorId, config.category])

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate && selectedEventType) {
      setSlotsLoading(true)
      const dateStr = selectedDate.toISOString().split("T")[0]
      getAvailableSlots(counselorId, selectedEventType.id, dateStr)
        .then((result) => {
          setAvailableSlots(result.slots)
          if (result.message && result.slots.length === 0) {
            setError(result.message)
          } else {
            setError(null)
          }
        })
        .finally(() => setSlotsLoading(false))
    }
  }, [selectedDate, selectedEventType, counselorId])

  const handleConfirm = async () => {
    if (!selectedEventType || !selectedDate || !selectedSlot) return

    setLoading(true)
    setError(null)

    const result = await createBooking({
      eventTypeId: selectedEventType.id,
      counselorId,
      scheduledDate: selectedDate.toISOString().split("T")[0],
      startTime: selectedSlot.startTime,
      studentNotes: notes || undefined,
    })

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
      // Reset state
      setStep("event-type")
      setSelectedEventType(null)
      setSelectedDate(undefined)
      setSelectedSlot(null)
      setNotes("")
    } else {
      setError(result.error || "Failed to book appointment")
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state
    setStep("event-type")
    setSelectedEventType(null)
    setSelectedDate(undefined)
    setSelectedSlot(null)
    setNotes("")
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <config.icon className="text-main h-5 w-5" />
            Book {config.shortTitle}
          </DialogTitle>
          <DialogDescription>
            {step === "event-type" && "Select an appointment type"}
            {step === "date" && "Choose a date for your appointment"}
            {step === "time" && "Select an available time slot"}
            {step === "confirm" && "Review and confirm your booking"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-main h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Step 1: Event Type Selection */}
              {step === "event-type" && (
                <div className="space-y-3">
                  {eventTypes.length === 0 ? (
                    <p className="text-main2 py-4 text-center text-sm">
                      No appointment types available for this category. Please
                      contact your counselor.
                    </p>
                  ) : (
                    eventTypes.map((et) => (
                      <button
                        key={et.id}
                        onClick={() => {
                          setSelectedEventType(et)
                          setStep("date")
                        }}
                        className="hover:border-main/50 hover:bg-muted/50 w-full rounded-sm border p-4 text-left transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="mt-1.5 h-3 w-3 rounded-full"
                            style={{ backgroundColor: et.color }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{et.name}</div>
                            <div className="text-main2 mt-1 text-sm">
                              {et.duration} minutes •{" "}
                              {et.locationType === "video"
                                ? "Video Call"
                                : et.locationType === "phone"
                                  ? "Phone"
                                  : "In Person"}
                            </div>
                            {et.description && (
                              <div className="text-main2 mt-2 text-xs">
                                {et.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Step 2: Date Selection */}
              {step === "date" && (
                <div className="space-y-4">
                  <div className="text-main2 mb-4 flex items-center gap-2 text-sm">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: selectedEventType?.color }}
                    />
                    <span>{selectedEventType?.name}</span>
                    <span>•</span>
                    <span>{selectedEventType?.duration} min</span>
                  </div>

                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setSelectedSlot(null)
                      if (date) setStep("time")
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />

                  <Button
                    variant="outline"
                    onClick={() => setStep("event-type")}
                  >
                    Back
                  </Button>
                </div>
              )}

              {/* Step 3: Time Selection */}
              {step === "time" && (
                <div className="space-y-4">
                  <div className="text-main2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="text-main h-6 w-6 animate-spin" />
                    </div>
                  ) : error ? (
                    <p className="py-4 text-center text-sm text-red-600">
                      {error}
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-main2 py-4 text-center text-sm">
                      No available slots on this date. Please select another
                      date.
                    </p>
                  ) : (
                    <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.startTime}
                          onClick={() => {
                            setSelectedSlot(slot)
                            setStep("confirm")
                          }}
                          className={`rounded-sm border px-3 py-2 text-sm transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? "border-main bg-main/10 text-main"
                              : "hover:border-main/50 hover:bg-muted/50"
                          }`}
                        >
                          {slot.displayTime}
                        </button>
                      ))}
                    </div>
                  )}

                  <Button variant="outline" onClick={() => setStep("date")}>
                    Back
                  </Button>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-sm border p-4">
                    <div className="mb-3 font-medium">
                      {selectedEventType?.name}
                    </div>
                    <div className="text-main2 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedSlot?.displayTime}</span>
                        <span>({selectedEventType?.duration} minutes)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedEventType?.locationType === "video" ? (
                          <Video className="h-4 w-4" />
                        ) : selectedEventType?.locationType === "phone" ? (
                          <Phone className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>
                          {selectedEventType?.locationType === "video"
                            ? "Video Call"
                            : selectedEventType?.locationType === "phone"
                              ? "Phone Call"
                              : "In Person"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Notes (optional)
                    </label>
                    <Textarea
                      placeholder="Add any notes for your counselor..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep("time")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={loading}
                      className="bg-main hover:bg-main/90 flex-1 cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<string>("cover")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [bookingCategory, setBookingCategory] = useState<SessionConfig | null>(
    null
  )
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  )

  // Counselor assignment based on student's course
  const [counselorId, setCounselorId] = useState<string | null>(null)
  const [counselorName, setCounselorName] = useState<string | null>(null)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)

  // Fetch assigned counselor based on student's course
  useEffect(() => {
    async function fetchCounselor() {
      const result = await getAssignedCounselor()
      if (result) {
        setCounselorId(result.counselorId)
        setCounselorName(result.counselorName)
      } else {
        setAssignmentError(
          "No counselor assigned for your course. Please contact the guidance office."
        )
      }
    }
    fetchCounselor()
  }, [])

  // Fetch student appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getStudentAppointments()
      setAppointments(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Derive booking statuses from appointments
  const bookingStatuses = useMemo<BookingStatuses>(() => {
    const statuses: BookingStatuses = {
      interview: { status: "not-booked" },
      counseling: { status: "not-booked" },
      assessment: { status: "not-booked" },
      exit: { status: "not-booked" },
    }

    // Map appointments to categories
    for (const apt of appointments) {
      const category = apt.eventType?.category as CategoryKey | undefined
      if (!category || !(category in statuses)) continue

      // Map API status to UI status
      let uiStatus: BookingStatus = "not-booked"
      if (apt.status === "completed") uiStatus = "completed"
      else if (apt.status === "confirmed") uiStatus = "confirmed"
      else if (apt.status === "pending") uiStatus = "pending"
      else continue // Skip cancelled/no-show

      // Only update if this is a more relevant status
      const current = statuses[category]
      const statusPriority = {
        "not-booked": 0,
        pending: 1,
        confirmed: 2,
        completed: 3,
      }

      if (statusPriority[uiStatus] > statusPriority[current.status]) {
        statuses[category] = {
          status: uiStatus,
          bookedDate: apt.scheduledDate,
          time: formatAppointmentTime(apt.startTime),
          appointmentId: apt.id,
          eventType: apt.eventType as unknown as EventType,
        }
      }
    }

    return statuses
  }, [appointments])

  const nextAction = useMemo(() => {
    const statusPriority: BookingStatus[] = [
      "pending",
      "not-booked",
      "confirmed",
    ]
    const typeMap: Record<string, string> = {
      pending: "prepare",
      "not-booked": "schedule",
      confirmed: "upcoming",
    }

    for (const targetStatus of statusPriority) {
      for (const config of SESSION_CONFIGS) {
        const state = bookingStatuses[config.bookingKey]
        if (state.status === targetStatus) {
          return {
            type: typeMap[targetStatus],
            title: config.title,
            date: state.bookedDate,
            time: state.time,
            sessionId: config.id,
          }
        }
      }
    }

    return { type: "completed", title: "All Complete" }
  }, [bookingStatuses])

  const activeSession = SESSION_CONFIGS.find((c) => c.id === activeTab)

  const handleBookClick = (config: SessionConfig) => {
    setBookingCategory(config)
    setBookingDialogOpen(true)
  }

  const handleCancelClick = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return

    const result = await cancelAppointment(appointmentToCancel)
    if (result.success) {
      loadAppointments()
    }
    setCancelDialogOpen(false)
    setAppointmentToCancel(null)
  }

  if (loading) {
    return (
      <div className="mt-12 flex w-full justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Booking
          </div>
          <Skeleton className="h-[510px] w-full rounded-md" />
        </div>
      </div>
    )
  }

  // Show error if no counselor assigned
  if (assignmentError) {
    return (
      <div className="mt-12 flex w-full justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Booking
          </div>
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-yellow-100 p-3">
                <CircleAlertIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                No Counselor Assigned
              </h3>
              <p className="text-main2 max-w-md">{assignmentError}</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div className="text-3xl font-semibold tracking-wide">Booking</div>
          {counselorName && (
            <div className="text-main2 text-sm">
              <span className="text-foreground font-medium">
                {counselorName}
              </span>
              <span className="ml-1.5">• Your Counselor</span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col">
          {/* Top Tabs */}
          <div className="relative flex">
            <button
              onClick={() => setActiveTab("cover")}
              className={`relative flex h-10 cursor-pointer items-center justify-center gap-2 rounded-t-sm border-t border-r border-l px-5 transition-all ${
                activeTab === "cover"
                  ? "bg-background border-border z-20 -mb-px pb-[calc(0.25rem+1px)]"
                  : "bg-muted/50 border-border/50 hover:bg-muted z-10"
              }`}
            >
              <BookOpen
                className={`h-4 w-4 ${activeTab === "cover" ? "text-main" : "text-main2"}`}
              />
              <span
                className={`text-sm font-medium tracking-wide ${
                  activeTab === "cover" ? "text-foreground" : "text-main2"
                }`}
              >
                Overview
              </span>
            </button>

            {SESSION_CONFIGS.map((config) => {
              const status = bookingStatuses[config.bookingKey].status
              const colors = STATUS_COLORS[status]
              const isActive = activeTab === config.id

              return (
                <button
                  key={config.id}
                  onClick={() => setActiveTab(config.id)}
                  className={`relative ml-1 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-t-sm border-t border-r border-l px-4 transition-all ${
                    isActive
                      ? "bg-background border-border z-20 -mb-px pb-[calc(0.25rem+1px)]"
                      : "bg-muted/50 border-border/50 hover:bg-muted z-10"
                  }`}
                >
                  <div className="relative">
                    <config.icon
                      className={`h-4 w-4 ${isActive ? "text-main" : "text-main2"}`}
                    />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors.dot}`}
                      />
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${colors.dot}`}
                      />
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium tracking-wide ${
                      isActive ? "text-foreground" : "text-main2"
                    }`}
                  >
                    {config.shortTitle}
                  </span>
                </button>
              )
            })}

            {/* Horizontal border line */}
            <div className="border-border absolute right-0 bottom-0 left-0 z-10 border-b" />

            {/* Next Step Indicator */}
            {nextAction.type !== "completed" && (
              <div className="ml-auto flex items-center">
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button className="relative flex cursor-pointer items-center justify-center">
                      <span className="bg-main absolute inline-flex h-4 w-4 animate-[ping_2s_ease-in-out_infinite] rounded-full opacity-50" />
                      <CircleAlertIcon className="text-main relative h-4 w-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="end"
                    side="bottom"
                    sideOffset={4}
                    className="z-[99] w-64 rounded-sm border bg-white p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-main bg-main/10 flex h-7 w-7 items-center justify-center rounded-full">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold tracking-wide">
                          Next Up
                        </span>
                        <div className="text-main2 text-xs">Your next step</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm font-medium tracking-wide">
                      {nextAction.title}
                    </div>

                    {nextAction.date && (
                      <div className="text-main2 mt-1.5 flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(nextAction.date)}</span>
                        {nextAction.time && (
                          <>
                            <span className="mx-0.5">•</span>
                            <span className="text-main">{nextAction.time}</span>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (nextAction.sessionId) {
                          setActiveTab(nextAction.sessionId)
                        }
                      }}
                      className="bg-main hover:bg-main/90 mt-3 w-full cursor-pointer rounded-sm py-2 text-sm font-medium tracking-wide text-white transition-colors"
                    >
                      {nextAction.type === "schedule"
                        ? "Book Now"
                        : "View Details"}
                    </button>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>

          {/* Content Card */}
          <Card className="bg-background h-[480px] overflow-visible rounded-sm rounded-t-none border-t-0 p-8">
            <div
              className={`h-full ${activeSession ? "overflow-y-auto" : "overflow-visible"}`}
            >
              {activeSession ? (
                <SessionContent
                  config={activeSession}
                  bookingState={bookingStatuses[activeSession.bookingKey]}
                  onBookClick={() => handleBookClick(activeSession)}
                  onCancelClick={() => {
                    const state = bookingStatuses[activeSession.bookingKey]
                    if (state.appointmentId) {
                      handleCancelClick(state.appointmentId)
                    }
                  }}
                />
              ) : (
                <CoverContent
                  bookingStatuses={bookingStatuses}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      {bookingCategory && counselorId && (
        <BookingDialog
          isOpen={bookingDialogOpen}
          onClose={() => {
            setBookingDialogOpen(false)
            setBookingCategory(null)
          }}
          config={bookingCategory}
          counselorId={counselorId}
          onSuccess={loadAppointments}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="flex-1"
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              className="flex-1"
            >
              Cancel Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
