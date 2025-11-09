/**
 * API client for Flask backend
 * Replaces Server Actions with HTTP requests
 */

import type { z } from "zod"
import type {
  studentIndividualDataSchema,
  familyDataSchema,
} from "@/lib/schemas"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000"

// type definitions
type PersonalDataFormData = z.infer<typeof studentIndividualDataSchema>
type FamilyDataFormData = z.infer<typeof familyDataSchema>
type SectionIndex = 0 | 1 | 2 | 3 | 4 | 5
type PartIndex = 0 | 1 | 2

// database record type (dapat ni imatch sa Supabase)
type StudentRecord = {
  id?: string
  auth_user_id?: string
  id_number?: string
  course?: string
  msu_sase_score?: number
  academic_year?: string
  family_name?: string
  given_name?: string
  middle_initial?: string
  student_status?: string
  nickname?: string
  age?: number
  sex?: string
  citizenship?: string
  date_of_birth?: string
  place_of_birth?: string
  religious_affiliation?: string
  civil_status?: string
  civil_status_others?: string
  number_of_children?: number
  address_iligan?: string
  contact_number?: string
  home_address?: string
  stays_with?: string
  working_student_status?: string
  talents_skills?: string
  leisure_activities?: string
  medical_condition?: string | null
  medical_condition_others?: string | null
  physical_disability?: string | null
  physical_disability_others?: string | null
  gender_identity?: string
  attraction?: string
  father_name?: string
  father_deceased?: boolean
  father_occupation?: string
  father_contact_number?: string
  mother_name?: string
  mother_deceased?: boolean
  mother_occupation?: string
  mother_contact_number?: string
  parents_marital_status?: string
  family_monthly_income?: string
  guardian_name?: string
  guardian_occupation?: string
  guardian_contact_number?: string
  guardian_relationship?: string
  ordinal_position?: string
  number_of_siblings?: number
  home_environment_description?: string
  is_personal_data_complete?: boolean
  is_family_data_complete?: boolean
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

export async function getOnboardingStatus(): Promise<{ startTour: boolean }> {
  try {
    return await apiRequest<{ startTour: boolean }>(
      "/api/students/profile/onboarding-status"
    )
  } catch (error) {
    console.error("Error getting onboarding status:", error)
    return { startTour: true }
  }
}

export async function profileExists(): Promise<boolean> {
  try {
    const data = await apiRequest<{ exists: boolean }>(
      "/api/students/profile/exists"
    )
    return data.exists
  } catch (error) {
    console.error("Error checking profile existence:", error)
    return false
  }
}

export async function getProfileProgress(): Promise<{
  lastSection: number | null
  lastPart: number | null
  completedSections: number[]
}> {
  try {
    return await apiRequest<{
      lastSection: number | null
      lastPart: number | null
      completedSections: number[]
    }>("/api/students/profile/progress")
  } catch (error) {
    console.error("Error getting profile progress:", error)
    return { lastSection: null, lastPart: null, completedSections: [] }
  }
}

export async function getStudentSection(
  sectionIndex: SectionIndex,
  partIndex: PartIndex
): Promise<Partial<PersonalDataFormData> | Partial<FamilyDataFormData> | null> {
  try {
    const data = await apiRequest<{
      data: Partial<PersonalDataFormData> | Partial<FamilyDataFormData> | null
    }>(`/api/students/section?section=${sectionIndex}&part=${partIndex}`)
    return data.data
  } catch (error) {
    console.error("Error getting student section:", error)
    return null
  }
}

export async function saveStudentSection(
  formData: Partial<PersonalDataFormData> | Partial<FamilyDataFormData>,
  sectionIndex: SectionIndex,
  partIndex: PartIndex
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiRequest<{ success: boolean; error?: string }>(
      "/api/students/section",
      {
        method: "POST",
        body: JSON.stringify({
          formData,
          sectionIndex,
          partIndex,
        }),
      }
    )
    return result
  } catch (error) {
    console.error("Error saving student section:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getStudentProfile(): Promise<StudentRecord | null> {
  try {
    const data = await apiRequest<{ data: StudentRecord | null }>(
      "/api/students/profile"
    )
    return data.data
  } catch (error) {
    console.error("Error getting student profile:", error)
    return null
  }
}
