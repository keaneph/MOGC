/**
 * API client for counselor availability routes
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Types matching UI components
export interface TimeSlot {
  id?: string
  startTime: string | null
  endTime: string | null
}

export interface WeeklySlot {
  id?: string
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string | null
  endTime: string | null
}

export interface DateOverride {
  id?: string
  date: string // ISO date string (YYYY-MM-DD)
  startTime: string | null // null = unavailable
  endTime: string | null
}

export interface AvailabilityData {
  scheduleName: string
  weekly: WeeklySlot[]
  overrides: DateOverride[]
}

// Schedule management types
export interface Schedule {
  id: string
  name: string
  isDefault: boolean
  bookingBuffer?: number // hours of minimum advance notice required
  createdAt: string
  updatedAt: string
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
 * Get counselor's availability
 */
export async function getAvailability(
  scheduleName: string = "Working hours"
): Promise<AvailabilityData> {
  try {
    const params = new URLSearchParams({ schedule_name: scheduleName })
    const data = await apiRequest<AvailabilityData>(
      `/api/availability?${params}`
    )
    return data
  } catch (error) {
    console.error("Error fetching availability:", error)
    return {
      scheduleName,
      weekly: [],
      overrides: [],
    }
  }
}

/**
 * Save counselor's complete availability (replaces existing)
 */
export async function saveAvailability(
  data: AvailabilityData
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await apiRequest<{ message: string; count: number }>(
      "/api/availability",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
    return { success: true, message: result.message }
  } catch (error) {
    console.error("Error saving availability:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save",
    }
  }
}

/**
 * Add a single weekly time slot
 */
export async function addWeeklySlot(
  slot: Omit<WeeklySlot, "id">,
  scheduleName: string = "Working hours"
): Promise<WeeklySlot | null> {
  try {
    const result = await apiRequest<{ slot: WeeklySlot }>(
      "/api/availability/weekly",
      {
        method: "POST",
        body: JSON.stringify({
          scheduleName,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      }
    )
    return result.slot
  } catch (error) {
    console.error("Error adding weekly slot:", error)
    return null
  }
}

/**
 * Add a date override
 */
export async function addDateOverride(
  override: Omit<DateOverride, "id">,
  scheduleName: string = "Working hours"
): Promise<DateOverride | null> {
  try {
    const result = await apiRequest<{ override: DateOverride }>(
      "/api/availability/override",
      {
        method: "POST",
        body: JSON.stringify({
          scheduleName,
          date: override.date,
          startTime: override.startTime,
          endTime: override.endTime,
        }),
      }
    )
    return result.override
  } catch (error) {
    console.error("Error adding date override:", error)
    return null
  }
}

/**
 * Delete a specific availability slot
 */
export async function deleteAvailabilitySlot(slotId: string): Promise<boolean> {
  try {
    await apiRequest(`/api/availability/${slotId}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error("Error deleting slot:", error)
    return false
  }
}

/**
 * Get public availability for a counselor (for student booking)
 */
export async function getPublicAvailability(
  counselorId: string,
  scheduleName: string = "Working hours"
): Promise<{ weekly: WeeklySlot[]; overrides: DateOverride[] }> {
  try {
    const params = new URLSearchParams({ schedule_name: scheduleName })
    const response = await fetch(
      `${API_BASE_URL}/api/availability/public/${counselorId}?${params}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch availability")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching public availability:", error)
    return { weekly: [], overrides: [] }
  }
}

// ============================================
// Helper functions to convert between UI and API formats
// ============================================

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"

const DAYS_OF_WEEK: Day[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

interface UITimeSlot {
  id: string
  start: string
  end: string
}

interface UIWeeklyAvailability {
  day: Day
  available: boolean
  slots: UITimeSlot[]
}

interface UIDateOverride {
  id: string
  date: Date
  slots: UITimeSlot[]
  isUnavailable?: boolean
}

/**
 * Convert 12-hour format (09:00 AM) to 24-hour format (09:00)
 */
export function to24Hour(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
  if (!match) return time12

  let hours = parseInt(match[1])
  const minutes = match[2]
  const period = match[3].toUpperCase()

  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0

  return `${hours.toString().padStart(2, "0")}:${minutes}`
}

/**
 * Convert 24-hour format (09:00) to 12-hour format (09:00 AM)
 */
export function to12Hour(time24: string): string {
  if (!time24) return ""

  const [hoursStr, minutes] = time24.split(":")
  let hours = parseInt(hoursStr)
  const period = hours >= 12 ? "PM" : "AM"

  if (hours > 12) hours -= 12
  if (hours === 0) hours = 12

  return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`
}

/**
 * Convert UI weekly schedule to API format
 */
export function weeklyToAPI(uiSchedule: UIWeeklyAvailability[]): WeeklySlot[] {
  const slots: WeeklySlot[] = []

  uiSchedule.forEach((day, dayIndex) => {
    if (!day.available) {
      // Day is unavailable - add one row with null times
      slots.push({
        dayOfWeek: dayIndex,
        startTime: null,
        endTime: null,
      })
    } else {
      // Day is available - add each time slot
      day.slots.forEach((slot) => {
        slots.push({
          dayOfWeek: dayIndex,
          startTime: to24Hour(slot.start),
          endTime: to24Hour(slot.end),
        })
      })
    }
  })

  return slots
}

/**
 * Convert API weekly slots to UI format
 */
export function weeklyFromAPI(apiSlots: WeeklySlot[]): UIWeeklyAvailability[] {
  // Initialize all days as unavailable
  const schedule: UIWeeklyAvailability[] = DAYS_OF_WEEK.map((day) => ({
    day,
    available: false,
    slots: [],
  }))

  // Group slots by day
  apiSlots.forEach((slot) => {
    const daySchedule = schedule[slot.dayOfWeek]

    if (slot.startTime && slot.endTime) {
      // Has time = available with this slot
      daySchedule.available = true
      daySchedule.slots.push({
        id: slot.id || String(Date.now() + Math.random()),
        start: to12Hour(slot.startTime),
        end: to12Hour(slot.endTime),
      })
    }
    // If startTime is null, day stays unavailable (default)
  })

  return schedule
}

/**
 * Convert UI date overrides to API format
 */
export function overridesToAPI(uiOverrides: UIDateOverride[]): DateOverride[] {
  const overrides: DateOverride[] = []

  uiOverrides.forEach((override) => {
    // Use local date components to avoid timezone issues
    const year = override.date.getFullYear()
    const month = String(override.date.getMonth() + 1).padStart(2, "0")
    const day = String(override.date.getDate()).padStart(2, "0")
    const dateStr = `${year}-${month}-${day}`

    if (override.isUnavailable) {
      // Unavailable - null times
      overrides.push({
        date: dateStr,
        startTime: null,
        endTime: null,
      })
    } else {
      // Has custom slots
      override.slots.forEach((slot) => {
        overrides.push({
          date: dateStr,
          startTime: to24Hour(slot.start),
          endTime: to24Hour(slot.end),
        })
      })
    }
  })

  return overrides
}

/**
 * Convert API date overrides to UI format
 */
export function overridesFromAPI(
  apiOverrides: DateOverride[]
): UIDateOverride[] {
  // Group by date
  const byDate: Record<string, DateOverride[]> = {}

  apiOverrides.forEach((override) => {
    if (!byDate[override.date]) {
      byDate[override.date] = []
    }
    byDate[override.date].push(override)
  })

  // Convert each date group
  return Object.entries(byDate).map(([dateStr, slots]) => {
    const isUnavailable = slots.length === 1 && !slots[0].startTime

    // Parse date string as local date (YYYY-MM-DD)
    const [year, month, day] = dateStr.split("-").map(Number)
    const localDate = new Date(year, month - 1, day)

    return {
      id: slots[0].id || String(Date.now() + Math.random()),
      date: localDate,
      isUnavailable,
      slots: isUnavailable
        ? []
        : slots.map((slot) => ({
            id: slot.id || String(Date.now() + Math.random()),
            start: to12Hour(slot.startTime || ""),
            end: to12Hour(slot.endTime || ""),
          })),
    }
  })
}

// ============================================
// Schedule Management API Functions
// ============================================

/**
 * Get all schedules for the current counselor
 */
export async function getSchedules(): Promise<Schedule[]> {
  try {
    const data = await apiRequest<{ schedules: Schedule[] }>("/api/schedules")
    return data.schedules
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return []
  }
}

/**
 * Create a new schedule
 */
export async function createSchedule(
  name: string,
  options?: { isDefault?: boolean; duplicateFrom?: string }
): Promise<{ success: boolean; schedule?: Schedule; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; schedule: Schedule }>(
      "/api/schedules",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          isDefault: options?.isDefault || false,
          duplicateFrom: options?.duplicateFrom,
        }),
      }
    )
    return { success: true, schedule: result.schedule }
  } catch (error) {
    console.error("Error creating schedule:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create schedule",
    }
  }
}

/**
 * Rename a schedule
 */
export async function renameSchedule(
  scheduleId: string,
  newName: string
): Promise<{ success: boolean; schedule?: Schedule; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; schedule: Schedule }>(
      `/api/schedules/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
      }
    )
    return { success: true, schedule: result.schedule }
  } catch (error) {
    console.error("Error renaming schedule:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to rename schedule",
    }
  }
}

/**
 * Update schedule settings (booking buffer, etc.)
 */
export async function updateScheduleSettings(
  scheduleId: string,
  settings: { bookingBuffer?: number }
): Promise<{ success: boolean; schedule?: Schedule; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; schedule: Schedule }>(
      `/api/schedules/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify({ bookingBuffer: settings.bookingBuffer }),
      }
    )
    return { success: true, schedule: result.schedule }
  } catch (error) {
    console.error("Error updating schedule settings:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update schedule settings",
    }
  }
}

/**
 * Set a schedule as default
 */
export async function setDefaultSchedule(
  scheduleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest<{ message: string; schedule: Schedule }>(
      `/api/schedules/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify({ isDefault: true }),
      }
    )
    return { success: true }
  } catch (error) {
    console.error("Error setting default schedule:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to set default schedule",
    }
  }
}

/**
 * Duplicate a schedule
 */
export async function duplicateSchedule(
  scheduleId: string,
  newName: string
): Promise<{ success: boolean; schedule?: Schedule; error?: string }> {
  try {
    const result = await apiRequest<{ message: string; schedule: Schedule }>(
      `/api/schedules/${scheduleId}/duplicate`,
      {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      }
    )
    return { success: true, schedule: result.schedule }
  } catch (error) {
    console.error("Error duplicating schedule:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to duplicate schedule",
    }
  }
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(
  scheduleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/api/schedules/${scheduleId}`, {
      method: "DELETE",
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting schedule:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete schedule",
    }
  }
}
