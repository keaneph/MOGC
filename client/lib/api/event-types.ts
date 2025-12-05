/**
 * API client for event types management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Event Type interface
export interface EventType {
  id: string
  name: string
  description?: string | null
  duration: number
  color: string
  category: "interview" | "counseling" | "assessment" | "exit" | "custom"
  locationType: "in_person" | "video" | "phone"
  locationDetails?: string | null
  isActive: boolean
  requiresApproval: boolean
  maxBookingsPerDay?: number | null
  bufferBefore: number
  bufferAfter: number
  scheduleId?: string | null
  scheduleName?: string | null
  createdAt: string
  updatedAt: string
}

// Input type for creating/updating
export interface EventTypeInput {
  name: string
  description?: string | null
  duration?: number
  color?: string
  category?: "interview" | "counseling" | "assessment" | "exit" | "custom"
  locationType?: "in_person" | "video" | "phone"
  locationDetails?: string | null
  isActive?: boolean
  requiresApproval?: boolean
  maxBookingsPerDay?: number | null
  bufferBefore?: number
  bufferAfter?: number
  scheduleId?: string | null
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

/**
 * Get all event types for the current counselor
 */
export async function getEventTypes(): Promise<EventType[]> {
  try {
    const data = await apiRequest<{ eventTypes: EventType[] }>(
      "/api/event-types"
    )
    return data.eventTypes
  } catch (error) {
    console.error("Error fetching event types:", error)
    return []
  }
}

/**
 * Create a new event type
 */
export async function createEventType(
  input: EventTypeInput
): Promise<{ success: boolean; eventType?: EventType; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; eventType: EventType }>(
      "/api/event-types",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    )
    return { success: true, eventType: result.eventType }
  } catch (error) {
    console.error("Error creating event type:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create event type",
    }
  }
}

/**
 * Update an event type
 */
export async function updateEventType(
  eventTypeId: string,
  input: Partial<EventTypeInput>
): Promise<{ success: boolean; eventType?: EventType; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; eventType: EventType }>(
      `/api/event-types/${eventTypeId}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      }
    )
    return { success: true, eventType: result.eventType }
  } catch (error) {
    console.error("Error updating event type:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update event type",
    }
  }
}

/**
 * Delete an event type
 */
export async function deleteEventType(
  eventTypeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/event-types/${eventTypeId}`, {
      method: "DELETE",
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting event type:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete event type",
    }
  }
}

/**
 * Duplicate an event type
 */
export async function duplicateEventType(
  eventTypeId: string,
  newName: string
): Promise<{ success: boolean; eventType?: EventType; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; eventType: EventType }>(
      `/api/event-types/${eventTypeId}/duplicate`,
      {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      }
    )
    return { success: true, eventType: result.eventType }
  } catch (error) {
    console.error("Error duplicating event type:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to duplicate event type",
    }
  }
}

/**
 * Get public event types for a counselor (for student booking)
 */
export async function getPublicEventTypes(
  counselorId: string,
  category?: "interview" | "counseling" | "assessment" | "exit" | "custom"
): Promise<EventType[]> {
  try {
    let url = `${API_BASE_URL}/api/event-types/public/${counselorId}`
    if (category) {
      url += `?category=${category}`
    }
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch event types")
    }

    const data = await response.json()
    return data.eventTypes
  } catch (error) {
    console.error("Error fetching public event types:", error)
    return []
  }
}

// Simplified event type for schedule linking display
export interface LinkedEventType {
  id: string
  name: string
  color: string
  isActive: boolean
}

/**
 * Get event types linked to a specific schedule
 */
export async function getEventTypesBySchedule(
  scheduleId: string
): Promise<LinkedEventType[]> {
  try {
    const data = await apiRequest<{ eventTypes: LinkedEventType[] }>(
      `/api/event-types/by-schedule/${scheduleId}`
    )
    return data.eventTypes
  } catch (error) {
    console.error("Error fetching event types by schedule:", error)
    return []
  }
}

// Predefined color options for event types
export const EVENT_TYPE_COLORS = [
  { name: "Maroon", value: "#991b1b" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Amber", value: "#d97706" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Lime", value: "#65a30d" },
  { name: "Green", value: "#16a34a" },
  { name: "Emerald", value: "#059669" },
  { name: "Teal", value: "#0d9488" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Sky", value: "#0284c7" },
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Purple", value: "#9333ea" },
  { name: "Fuchsia", value: "#c026d3" },
  { name: "Pink", value: "#db2777" },
  { name: "Rose", value: "#e11d48" },
]

// Duration options in minutes
export const DURATION_OPTIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
]

// Buffer time options in minutes
export const BUFFER_OPTIONS = [
  { label: "No buffer", value: 0 },
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
]

// Location type options
export const LOCATION_TYPE_OPTIONS = [
  { label: "In Person", value: "in_person" as const },
  { label: "Video Call", value: "video" as const },
  { label: "Phone Call", value: "phone" as const },
]

export const CATEGORY_OPTIONS = [
  {
    label: "Interview",
    value: "interview" as const,
    description: "Initial interview and assessment",
  },
  {
    label: "Counseling",
    value: "counseling" as const,
    description: "Regular counseling session",
  },
  {
    label: "Assessment",
    value: "assessment" as const,
    description: "Psychological tests and assessments",
  },
  {
    label: "Exit Interview",
    value: "exit" as const,
    description: "Final session and clearance",
  },
  {
    label: "Custom",
    value: "custom" as const,
    description: "Custom appointment type",
  },
]
