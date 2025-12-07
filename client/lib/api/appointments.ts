/**
 * API client for appointments/booking management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Appointment status type
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"

// Location type
export type LocationType = "in_person" | "video" | "phone"

// Event type category
export type EventTypeCategory =
  | "interview"
  | "counseling"
  | "assessment"
  | "exit"
  | "custom"

// Appointment event type info
export interface AppointmentEventType {
  id: string
  name: string
  duration: number
  color: string
  category: EventTypeCategory
  description?: string
}

// Participant info
export interface ParticipantInfo {
  name: string
  idNumber?: string
}

// Full appointment interface
export interface Appointment {
  id: string
  studentId: string
  counselorId: string
  eventTypeId: string
  eventType: AppointmentEventType | null
  scheduledDate: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // HH:MM
  status: AppointmentStatus
  studentNotes?: string | null
  counselorNotes?: string | null
  locationType: LocationType
  locationDetails?: string | null
  cancellationReason?: string | null
  studentInfo?: ParticipantInfo | null
  counselorInfo?: ParticipantInfo | null
  createdAt: string
  confirmedAt?: string | null
  cancelledAt?: string | null
  completedAt?: string | null
}

// Available time slot
export interface TimeSlot {
  startTime: string // HH:MM (24hr)
  endTime: string // HH:MM (24hr)
  displayTime: string // Formatted 12hr time
}

// Booking input
export interface BookingInput {
  eventTypeId: string
  counselorId: string
  scheduledDate: string // YYYY-MM-DD
  startTime: string // HH:MM
  studentNotes?: string
}

/**
 * Get auth token from Supabase session
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/client")
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `API error: ${response.statusText}`)
  }

  return response.json()
}

// ============================================
// Student Booking Functions
// ============================================

/**
 * Get available time slots for booking
 */
export async function getAvailableSlots(
  counselorId: string,
  eventTypeId: string,
  date: string // YYYY-MM-DD
): Promise<{
  slots: TimeSlot[]
  duration: number
  message?: string
}> {
  try {
    const params = new URLSearchParams({
      counselorId,
      eventTypeId,
      date,
    })

    const data = await apiRequest<{
      availableSlots: TimeSlot[]
      duration: number
      message?: string
    }>(`/api/appointments/available-slots?${params}`)

    return {
      slots: data.availableSlots,
      duration: data.duration,
      message: data.message,
    }
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return { slots: [], duration: 0, message: "Failed to load available slots" }
  }
}

/**
 * Create a new booking/appointment
 */
export async function createBooking(input: BookingInput): Promise<{
  success: boolean
  appointment?: Partial<Appointment>
  error?: string
}> {
  try {
    const result = await apiRequest<{
      message: string
      appointment: Partial<Appointment>
    }>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(input),
    })

    return { success: true, appointment: result.appointment }
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create booking",
    }
  }
}

/**
 * Get student's appointments
 */
export async function getStudentAppointments(options?: {
  status?: AppointmentStatus
  from?: string
  to?: string
}): Promise<Appointment[]> {
  try {
    const params = new URLSearchParams({ role: "student" })

    if (options?.status) params.append("status", options.status)
    if (options?.from) params.append("from", options.from)
    if (options?.to) params.append("to", options.to)

    const data = await apiRequest<{ appointments: Appointment[] }>(
      `/api/appointments?${params}`
    )
    return data.appointments
  } catch (error) {
    console.error("Error fetching student appointments:", error)
    return []
  }
}

/**
 * Cancel an appointment (student)
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled", reason }),
    })
    return { success: true }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel appointment",
    }
  }
}

// ============================================
// Counselor Functions
// ============================================

/**
 * Get counselor's appointments
 */
export async function getCounselorAppointments(options?: {
  status?: AppointmentStatus
  from?: string
  to?: string
}): Promise<Appointment[]> {
  try {
    const params = new URLSearchParams({ role: "counselor" })

    if (options?.status) params.append("status", options.status)
    if (options?.from) params.append("from", options.from)
    if (options?.to) params.append("to", options.to)

    const data = await apiRequest<{ appointments: Appointment[] }>(
      `/api/appointments?${params}`
    )
    return data.appointments
  } catch (error) {
    console.error("Error fetching counselor appointments:", error)
    return []
  }
}

/**
 * Confirm a pending appointment
 */
export async function confirmAppointment(
  appointmentId: string,
  counselorNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "confirmed", counselorNotes }),
    })
    return { success: true }
  } catch (error) {
    console.error("Error confirming appointment:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to confirm appointment",
    }
  }
}

/**
 * Mark appointment as completed
 */
export async function completeAppointment(
  appointmentId: string,
  counselorNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "completed", counselorNotes }),
    })
    return { success: true }
  } catch (error) {
    console.error("Error completing appointment:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete appointment",
    }
  }
}

/**
 * Mark appointment as no-show
 */
export async function markNoShow(
  appointmentId: string,
  counselorNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "no_show", counselorNotes }),
    })
    return { success: true }
  } catch (error) {
    console.error("Error marking no-show:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark no-show",
    }
  }
}

/**
 * Get a single appointment by ID
 */
export async function getAppointment(
  appointmentId: string
): Promise<Appointment | null> {
  try {
    const data = await apiRequest<{ appointment: Appointment }>(
      `/api/appointments/${appointmentId}`
    )
    return data.appointment
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return null
  }
}

/**
 * Get busy dates for a counselor (for calendar display)
 */
export async function getCounselorBusyDates(
  counselorId: string
): Promise<Record<string, number>> {
  try {
    const data = await apiRequest<{ busyDates: Record<string, number> }>(
      `/api/appointments/counselor/${counselorId}/upcoming`
    )
    return data.busyDates
  } catch (error) {
    console.error("Error fetching busy dates:", error)
    return {}
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Format date for display
 */
export function formatAppointmentDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format time for display (convert HH:MM to 12hr format)
 */
export function formatAppointmentTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Get status display info
 */
export function getStatusDisplay(status: AppointmentStatus): {
  label: string
  color: string
  bgColor: string
} {
  const statusMap: Record<
    AppointmentStatus,
    { label: string; color: string; bgColor: string }
  > = {
    pending: {
      label: "Pending",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    confirmed: {
      label: "Confirmed",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
    completed: {
      label: "Completed",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    no_show: {
      label: "No Show",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  }
  return statusMap[status]
}

/**
 * Category display info
 */
export function getCategoryDisplay(category: EventTypeCategory): {
  label: string
  description: string
} {
  const categoryMap: Record<
    EventTypeCategory,
    { label: string; description: string }
  > = {
    interview: {
      label: "Interview",
      description: "Initial interview and assessment",
    },
    counseling: {
      label: "Counseling",
      description: "Regular counseling session",
    },
    assessment: {
      label: "Assessment",
      description: "Psychological tests and assessments",
    },
    exit: {
      label: "Exit Interview",
      description: "Final session and clearance",
    },
    custom: {
      label: "Custom",
      description: "Custom appointment type",
    },
  }
  return categoryMap[category]
}

/**
 * Check if an appointment is upcoming (not past)
 */
export function isUpcoming(appointment: Appointment): boolean {
  const now = new Date()
  const appointmentDate = new Date(
    `${appointment.scheduledDate}T${appointment.endTime}`
  )
  return appointmentDate > now
}

/**
 * Check if an appointment can be cancelled
 */
export function canCancel(appointment: Appointment): boolean {
  return (
    isUpcoming(appointment) &&
    (appointment.status === "pending" || appointment.status === "confirmed")
  )
}
