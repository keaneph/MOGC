/**
 * API client for counselor routes
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000"

type CounselorStudentListItem = {
  idNumber: string
  studentName: string
  course: string
  yearLevel: string
  assessment: "pending" | "high risk" | "low risk"
  initialInterview: "pending" | "scheduled" | "rescheduled" | "done"
  counselingStatus: "no record" | "ongoing" | "closed"
}

/**
 * get auth token from Supabase session
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
 * make authenticated API request
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
 * Fetch student list for counselor
 */
export async function getCounselorStudentList(): Promise<
  CounselorStudentListItem[]
> {
  try {
    const data = await apiRequest<{ students: CounselorStudentListItem[] }>(
      "/api/counselors/student-list"
    )
    return data.students
  } catch (error) {
    console.error("Error fetching counselor student list:", error)
    return []
  }
}

export async function updateStudentAssessment(
  idNumber: string,
  newAssessment: "pending" | "high risk" | "low risk"
): Promise<void> {
  try {
    console.log(
      "Calling:",
      `${API_BASE_URL}/api/counselors/student/${idNumber}/assessment`
    )

    await apiRequest(`/api/counselors/student/${idNumber}/assessment`, {
      method: "PUT",
      body: JSON.stringify({ assessment: newAssessment }),
    })
  } catch (error) {
    console.error("Failed to update assessment:", error)
  }
}

export async function updateStudentInterview(
  idNumber: string,
  newInterview: "pending" | "scheduled" | "rescheduled" | "done"
): Promise<void> {
  try {
    console.log(
      "Calling:",
      `${API_BASE_URL}/api/counselors/student/${idNumber}/initial_interview`
    )

    await apiRequest(`/api/counselors/student/${idNumber}/initial_interview`, {
      method: "PUT",
      body: JSON.stringify({ initial_interview: newInterview }),
    })
  } catch (error) {
    console.error("Failed to update interview:", error)
  }
}

export async function updateStudentCounseling(
  idNumber: string,
  newStatus: "no record" | "ongoing" | "closed"
): Promise<void> {
  try {
    console.log(
      "Calling:",
      `${API_BASE_URL}/api/counselors/student/${idNumber}/counseling_status`
    )

    await apiRequest(`/api/counselors/student/${idNumber}/counseling_status`, {
      method: "PUT",
      body: JSON.stringify({ counseling_status: newStatus }),
    })
  } catch (error) {
    console.error("Failed to update interview:", error)
  }
}
