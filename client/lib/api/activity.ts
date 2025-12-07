/**
 * API client for student activity history routes
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Activity Statistics
export interface ActivityStats {
  counselingSessions: number
  pendingAppointments: number
  upcomingAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  totalActivities: number
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
  } catch {
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
  if (!token) throw new Error("Not authenticated")

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Request failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get activity statistics
 */
export async function getActivityStats(options?: {
  from?: string
  to?: string
}): Promise<ActivityStats> {
  try {
    const params = new URLSearchParams()
    if (options?.from) params.append("from", options.from)
    if (options?.to) params.append("to", options.to)

    const queryString = params.toString()
    const data = await apiRequest<ActivityStats>(
      `/api/activity/stats${queryString ? `?${queryString}` : ""}`
    )
    return data
  } catch (error) {
    console.error("Error fetching activity stats:", error)
    throw error
  }
}
