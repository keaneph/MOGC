/**
 * API client for counselor routes
 */

import { StatusType } from "@/components/data/student-list/status-badge"
import { StudentRecord } from "./students"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type CounselorStudentListItem = {
  idNumber: string
  studentName: string
  course: string
  yearLevel: string
  assessment: StatusType
  initialInterview: StatusType
  counselingStatus: StatusType
  studentAuthId: string
  exitInterview: StatusType
}

export type StudentNote = {
  id: string
  student_id: string
  note_type: string
  content: string
  created_at: string
  note_title: string
}

export type AssignedCounselor = {
  counselorId: string
  counselorName: string | null
  studentCourse: string
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
 * Get the assigned counselor for the current student based on their course
 */
export async function getAssignedCounselor(): Promise<AssignedCounselor | null> {
  try {
    const data = await apiRequest<AssignedCounselor>("/api/counselors/assigned")
    return data
  } catch (error) {
    console.error("Error fetching assigned counselor:", error)
    return null
  }
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

export async function updateStudentCounseling(
  studentAuthId: string,
  newStatus: "no record" | "ongoing" | "closed"
): Promise<void> {
  try {
    console.log(
      "Calling:",
      `${API_BASE_URL}/api/counselors/student/${studentAuthId}/counseling_status`
    )

    await apiRequest(
      `/api/counselors/student/${studentAuthId}/counseling_status`,
      {
        method: "PUT",
        body: JSON.stringify({ counseling_status: newStatus }),
      }
    )
  } catch (error) {
    console.error("Failed to update counseling status:", error)
  }
}

export async function getStudentNotes(
  idNumber: string
): Promise<StudentNote[]> {
  try {
    const data = await apiRequest<{ notes: StudentNote[] }>(
      `/api/counselors/student/${idNumber}/notes`
    )
    return data.notes
  } catch (error) {
    console.error("Error fetching student notes:", error)
    return []
  }
}

export async function saveStudentNote(
  idNumber: string,
  note: Omit<StudentNote, "id" | "created_at">
): Promise<StudentNote | null> {
  try {
    const data = await apiRequest<{ note: StudentNote }>(
      `/api/counselors/student/${idNumber}/notes`,
      {
        method: "POST",
        body: JSON.stringify(note),
      }
    )
    return data.note
  } catch (error) {
    console.error("Error saving student note:", error)
    return null
  }
}

export async function updateStudentNote(
  idNumber: string,
  noteId: string,
  updates: { note_title: string; note_type: string; content: string }
): Promise<StudentNote | null> {
  try {
    const data = await apiRequest<{ note: StudentNote }>(
      `/api/counselors/student/${idNumber}/notes/${noteId}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    )
    return data.note
  } catch (error) {
    console.error("Error updating student note:", error)
    return null
  }
}

export async function deleteStudentNote(
  idNumber: string,
  noteId: string
): Promise<boolean> {
  try {
    await apiRequest<{ success: boolean }>(
      `/api/counselors/student/${idNumber}/notes/${noteId}`,
      {
        method: "DELETE",
      }
    )
    return true
  } catch (error) {
    console.error("Error deleting student note:", error)
    return false
  }
}

export async function getStudentProfilebyAuthId(
  studentAuthId: string
): Promise<StudentRecord | null> {
  try {
    const data = await apiRequest<{ profile: StudentRecord }>(
      `/api/counselors/student/${studentAuthId}/profile`
    )
    return data.profile
  } catch (error) {
    console.error("Error getting student profile by auth ID:", error)
    return null
  }
}

export async function getStudentEmailbyAuthId(
  studentAuthId: string
): Promise<string | null> {
  try {
    const data = await apiRequest<{ email: string }>(
      `/api/counselors/student/${studentAuthId}/email`
    )
    return data.email
  } catch (error) {
    console.error("Error getting student email by auth ID:", error)
    return null
  }
}

//check if profile exists by auth_user_id
export async function profileExistsByAuthId(
  studentAuthId: string
): Promise<boolean> {
  try {
    const data = await apiRequest<{ exists: boolean }>(
      `/api/counselors/student/${studentAuthId}/exists`
    )
    return data.exists
  } catch (error) {
    console.error("Error checking profile existence:", error)
    return false
  }
}

export async function isStudentProfileCompleteByAuthId(
  studentAuthId: string
): Promise<boolean> {
  try {
    const data = await apiRequest<{ complete: boolean }>(
      `/api/counselors/student/${studentAuthId}/completion-status`
    )
    return data.complete
  } catch (error) {
    console.error("Error checking profile completion:", error)
    return false
  }
}
