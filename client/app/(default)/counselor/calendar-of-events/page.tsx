"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PrimaryButton } from "@/components/common/primary-button"
import {
  getCalendarStatus,
  initiateCalendarOAuth,
  disconnectCalendar,
  syncCalendarNow,
} from "@/lib/api/calendar"
import {
  getCounselorAppointments,
  type Appointment,
} from "@/lib/api/appointments"
import { AppointmentsCalendar } from "@/components/calendar/appointments-calendar"
import { AppointmentDetailsPanel } from "@/components/calendar/appointment-details-panel"
import { toast } from "sonner"
import Link from "next/link"
import type { CalendarStatus } from "@/lib/api/calendar"

export default function CalendarOfEventsPage() {
  const [status, setStatus] = useState<CalendarStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  useEffect(() => {
    loadStatus()
    loadAppointments()

    // Check for OAuth callback success/error
    const params = new URLSearchParams(window.location.search)
    if (params.get("connected") === "true") {
      toast.success("Google Calendar connected successfully!")
      window.history.replaceState({}, "", window.location.pathname)
      loadStatus()
    } else if (params.get("error") === "oauth_failed") {
      toast.error("Failed to connect Google Calendar. Please try again.")
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const loadAppointments = async () => {
    try {
      setIsLoadingAppointments(true)
      const apts = await getCounselorAppointments()
      setAppointments(apts)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const loadStatus = async () => {
    try {
      setIsLoading(true)
      const calendarStatus = await getCalendarStatus()
      setStatus(calendarStatus)
    } catch (error) {
      console.error("Error loading calendar status:", error)
      toast.error("Failed to load calendar status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const { authorization_url } = await initiateCalendarOAuth()
      window.location.href = authorization_url
    } catch (error) {
      console.error("Error initiating OAuth:", error)
      toast.error("Failed to initiate Google Calendar connection")
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Calendar? Your appointments will no longer sync."
      )
    ) {
      return
    }

    try {
      setIsDisconnecting(true)
      const result = await disconnectCalendar()

      if (result.success) {
        toast.success("Google Calendar disconnected")
        await loadStatus()
      } else {
        toast.error(result.error || "Failed to disconnect")
      }
    } catch (error) {
      console.error("Error disconnecting:", error)
      toast.error("Failed to disconnect Google Calendar")
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true)
      const result = await syncCalendarNow()

      if (result.success) {
        toast.success("Calendar sync completed")
        await loadStatus()
      } else {
        toast.error(result.error || "Failed to sync")
      }
    } catch (error) {
      console.error("Error syncing:", error)
      toast.error("Failed to sync calendar")
    } finally {
      setIsSyncing(false)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never"
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <main
        id="main-container"
        className="mt-12 flex w-full justify-center px-6"
      >
        <div className="w-full max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-wide">
              Calendar of Events
            </h1>
          </div>
          <Skeleton className="mb-6 h-[200px] w-full rounded-md" />
          <Skeleton className="h-[600px] w-full rounded-md" />
        </div>
      </main>
    )
  }

  return (
    <main id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">
            Calendar of Events
          </h1>
          <p className="text-muted-foreground mt-1">
            Sync your appointments with Google Calendar
          </p>
        </div>

        {/* Google Calendar Sync Accordion */}
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem
            value="google-calendar-sync"
            className="border-border rounded-md border"
          >
            <AccordionTrigger className="cursor-pointer items-center px-4 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-main h-5 w-5 flex-shrink-0" />
                  <div className="text-left">
                    <CardTitle className="text-base">
                      Google Calendar Sync
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Automatically sync your appointments to your Google
                      Calendar
                    </CardDescription>
                  </div>
                </div>
                {status?.connected ? (
                  <Badge
                    variant="default"
                    className="flex-shrink-0 bg-green-500"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex-shrink-0">
                    <XCircle className="mr-1 h-3 w-3" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {!status?.connected ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Connect your Google Calendar to automatically sync
                    appointments. When students book appointments with you, they
                    will appear in your Google Calendar.
                  </p>
                  {isConnecting ? (
                    <Button disabled={true} className="w-full sm:w-auto">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </Button>
                  ) : (
                    <PrimaryButton
                      content="Connect Google Calendar"
                      onClick={handleConnect}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sync Status</p>
                      <p className="text-muted-foreground text-sm">
                        {status.sync_enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Synced</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(status.last_sync_at)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Connected Since</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(status.connected_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                      variant="outline"
                      size="sm"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        "Sync Now"
                      )}
                    </Button>
                    {isDisconnecting ? (
                      <Button disabled={true} variant="destructive" size="sm">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </Button>
                    ) : (
                      <PrimaryButton
                        content="Disconnect"
                        onClick={handleDisconnect}
                      />
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm">
                      <strong>How it works:</strong> When students book
                      appointments with you, they automatically appear in your
                      Google Calendar. When you confirm, cancel, or complete
                      appointments, your calendar updates automatically.
                    </p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Appointments Section */}
        <Card className="border-border rounded-md p-6">
          {isLoadingAppointments ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Skeleton className="h-[500px] w-full rounded-md" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-[500px] w-full rounded-md" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AppointmentsCalendar
                  appointments={appointments}
                  selectedDate={selectedDate || undefined}
                  onDateSelect={setSelectedDate}
                />
              </div>
              <div className="lg:col-span-1">
                <AppointmentDetailsPanel
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onClose={() => setSelectedDate(null)}
                  userRole="counselor"
                />
              </div>
            </div>
          )}
        </Card>
        <div className="h-20"></div>
      </div>
    </main>
  )
}
