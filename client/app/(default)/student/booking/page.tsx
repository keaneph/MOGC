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
} from "lucide-react"

import Link from "next/link"

import { useState, useMemo } from "react"

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

type BookingStatus = "not-booked" | "pending" | "confirmed" | "completed"

interface BookingState {
  status: BookingStatus
  bookedDate?: string
  time?: string
}

type BookingStatuses = Record<
  "initialInterview" | "counseling" | "testInterpretation" | "exitInterview",
  BookingState
>

interface SessionConfig {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: LucideIcon
  duration: string
  format: string
  expectations: string[]
  bookingKey: keyof BookingStatuses
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
    duration: "30-45 minutes",
    format: "One-on-One",
    expectations: [
      "Introduce yourself and share your academic background",
      "Discuss your goals, strengths, and areas for improvement",
      "Complete a personal profile questionnaire for your records",
      "Establish a personalized guidance plan tailored to your needs",
    ],
    bookingKey: "initialInterview",
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
    duration: "45-60 minutes",
    format: "One-on-One, One-to-Many",
    expectations: [
      "Address academic challenges such as study habits and time management",
      "Discuss personal or social concerns in a confidential setting",
      "Develop coping strategies and problem-solving skills",
      "Explore career interests and receive guidance on future planning",
    ],
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
    duration: "60-90 minutes",
    format: "One-on-One",
    expectations: [
      "Complete standardized psychological and aptitude assessments",
      "Receive a comprehensive interpretation of your test results",
      "Identify your strengths, interests, and areas for development",
      "Get personalized career path recommendations based on your profile",
    ],
    bookingKey: "testInterpretation",
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
    bookingKey: "exitInterview",
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
}: {
  config: SessionConfig
  bookingState: BookingState
}) {
  const colors = STATUS_COLORS[bookingState.status]
  const isCompleted = bookingState.status === "completed"
  const isScheduled =
    bookingState.status === "pending" || bookingState.status === "confirmed"

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-main/5 flex h-12 w-12 items-center justify-center rounded-sm">
            {isCompleted ? (
              <CheckCircle2
                className="h-6 w-6"
                style={{ color: "var(--status-green)" }}
              />
            ) : (
              <config.icon
                className="h-6 w-6"
                style={{ color: "var(--main)" }}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              {config.title}
            </h2>
            <p className="text-main2 text-sm">
              {config.duration} • {config.format}
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
            {config.description}
          </p>

          {/* Expectations */}
          <div>
            <div className="mb-4 text-sm font-semibold tracking-wide">
              What to Expect
            </div>
            <ul className="space-y-4">
              {config.expectations.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="bg-main/10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm text-xs font-medium"
                    style={{ color: "var(--main)" }}
                  >
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
              <Calendar className="h-4 w-4" style={{ color: "var(--main)" }} />
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
                      : "Pending"}
                  </span>
                </div>
                <div className="text-main2 flex items-center gap-1.5 text-xs">
                  <span>{formatDate(bookingState.bookedDate)}</span>
                  {bookingState.time && (
                    <>
                      <span>•</span>
                      <span
                        style={{ color: "var(--main)" }}
                        className="font-medium"
                      >
                        {bookingState.time}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4"
                  style={{ color: "var(--status-green)" }}
                />
                <span className="text-sm font-medium tracking-wide">
                  Completed
                </span>
              </div>
            ) : (
              <div className="text-main2 text-sm">Not scheduled</div>
            )}
          </div>

          {/* Format Card */}
          <div className="flex flex-col rounded-sm border p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4" style={{ color: "var(--main)" }} />
              <span className="text-sm font-semibold tracking-wide">
                Format
              </span>
            </div>

            {isScheduled && bookingState.bookedDate ? (
              <div className="space-y-1">
                <span className="text-sm font-medium tracking-wide">
                  {config.format.includes(",")
                    ? config.format.split(",")[0].trim()
                    : config.format}
                </span>
                <div className="text-main2 text-xs">
                  {config.format.includes(",")
                    ? "Format confirmed upon booking"
                    : "In-person session"}
                </div>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4"
                  style={{ color: "var(--status-green)" }}
                />
                <span className="text-sm font-medium tracking-wide">
                  Completed
                </span>
              </div>
            ) : (
              <div className="text-main2 text-sm">Not scheduled</div>
            )}
          </div>

          {/* Action Buttons - Bottom Right */}
          <div className="mt-auto flex items-center justify-end gap-4 pt-8">
            {!isCompleted ? (
              <>
                <TooltipThis label="Learn more about this session">
                  <button className="text-link cursor-pointer text-sm decoration-2 underline-offset-4 hover:underline">
                    Learn more
                  </button>
                </TooltipThis>
                <TooltipThis label={config.tooltipLabel}>
                  <Link href="/student/student-profiling">
                    <PrimaryButton content={config.buttonText} />
                  </Link>
                </TooltipThis>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4"
                  style={{ color: "var(--status-green)" }}
                />
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
                      <CheckCircle2
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--status-green)" }}
                      />
                    ) : (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--main2)" }}
                      >
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
  )
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<string>("cover")
  const [bookingStatuses] = useState<BookingStatuses>({
    initialInterview: {
      status: "pending",
      bookedDate: "2025-11-28",
      time: "10:00 AM",
    },
    counseling: { status: "not-booked" },
    testInterpretation: {
      status: "confirmed",
      bookedDate: "2025-12-05",
      time: "2:30 PM",
    },
    exitInterview: { status: "completed" },
  })

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

  return (
    <div className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-3xl font-semibold tracking-wide">
          Booking
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
                className="h-4 w-4"
                style={{
                  color: activeTab === "cover" ? "var(--main)" : "var(--main2)",
                }}
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
                      className="h-4 w-4"
                      style={{
                        color: isActive ? "var(--main)" : "var(--main2)",
                      }}
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
                    <button className="group relative flex cursor-pointer items-center justify-center">
                      <span className="bg-main2/50 group-hover:bg-main absolute inline-flex h-4 w-4 animate-[ping_2s_ease-in-out_infinite] rounded-full opacity-50 transition-colors" />
                      <CircleAlertIcon className="text-main2/50 group-hover:text-main relative h-4 w-4 transition-colors" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="end"
                    side="bottom"
                    sideOffset={4}
                    className="z-[99] w-64 rounded-sm border bg-white p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-main/10 flex h-7 w-7 items-center justify-center rounded-full"
                        style={{ color: "var(--main)" }}
                      >
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
                            <span style={{ color: "var(--main)" }}>
                              {nextAction.time}
                            </span>
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
    </div>
  )
}
