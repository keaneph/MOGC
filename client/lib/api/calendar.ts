/**
 * API client for Google Calendar integration
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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
 * Calendar sync status
 */
export interface CalendarStatus {
  connected: boolean
  sync_enabled: boolean
  last_sync_at?: string | null
  connected_at?: string | null
}

/**
 * Get Google Calendar sync status
 */
export async function getCalendarStatus(): Promise<CalendarStatus> {
  try {
    const data = await apiRequest<CalendarStatus>("/api/calendar/status")
    return data
  } catch (error) {
    console.error("Error fetching calendar status:", error)
    return {
      connected: false,
      sync_enabled: false,
    }
  }
}

/**
 * Initiate Google Calendar OAuth flow
 * Returns the authorization URL to redirect to
 */
export async function initiateCalendarOAuth(): Promise<{
  authorization_url: string
  state: string
}> {
  try {
    const data = await apiRequest<{
      authorization_url: string
      state: string
    }>("/api/calendar/oauth/authorize")
    return data
  } catch (error) {
    console.error("Error initiating OAuth:", error)
    throw error
  }
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectCalendar(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await apiRequest("/api/calendar/disconnect", {
      method: "POST",
    })
    return { success: true }
  } catch (error) {
    console.error("Error disconnecting calendar:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to disconnect calendar",
    }
  }
}

/**
 * Manually trigger calendar sync
 */
export async function syncCalendarNow(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await apiRequest("/api/calendar/sync-now", {
      method: "POST",
    })
    return { success: true }
  } catch (error) {
    console.error("Error syncing calendar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync calendar",
    }
  }
}
