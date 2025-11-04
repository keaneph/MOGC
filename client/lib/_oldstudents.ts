"use server"

import { createClient } from "@/lib/server"
import { studentIndividualDataSchema, familyDataSchema } from "@/lib/schemas"
import * as z from "zod"

// type definitions gikan sa zod schemas
type PersonalDataFormData = z.infer<typeof studentIndividualDataSchema>
type FamilyDataFormData = z.infer<typeof familyDataSchema>

type SectionIndex = 0 | 1 | 2 | 3 | 4 | 5 // 6 sections total
type PartIndex = 0 | 1 | 2 // max 3 parts per section, pero pwede ra ni ma change.

// database record type (subset of public.students), lista directly from Supabase
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

// here, idefine nato helper functions to convert between form data and database format

/**
 * convert form status to database boolean
 * form: "Living" | "Deceased"
 * database: boolean (true = deceased)
 */
function convertStatusToBoolean(status: "Living" | "Deceased"): boolean {
  return status === "Deceased"
}

// and pabali when calling gikan sa database

/**
 * convert database boolean to form status
 */
function convertBooleanToStatus(
  deceased: boolean | null | undefined
): "Living" | "Deceased" {
  return deceased === true ? "Deceased" : "Living"
}

/**
 * convert form medical condition to database format
 * form: "None" | "Existing"
 * database: "Existing" | null
 */
function convertMedicalCondition(
  condition: "None" | "Existing"
): string | null {
  return condition === "Existing" ? "Existing" : null
}

// and pabali napud when calling gikan sa database

/**
 * convert database medical condition to form format
 */
function convertMedicalConditionFromDB(
  condition: string | null | undefined
): "None" | "Existing" {
  return condition === "Existing" ? "Existing" : "None"
}

// form data to database data

/**
 * convert Personal Data Part A form data to database format
 */
function transformPersonalDataA(
  formData: Partial<PersonalDataFormData>
): Partial<StudentRecord> {
  return {
    id_number: formData.idNo,
    course: formData.course,
    msu_sase_score: formData.saseScore,
    academic_year: formData.academicYear,
    family_name: formData.familyName,
    given_name: formData.givenName,
    middle_initial: formData.middleInitial,
    student_status: formData.studentStatus,
    nickname: formData.nickname,
    age: formData.age,
    sex: formData.sex,
    citizenship: formData.citizenship,
    date_of_birth: formData.dateOfBirth,
    place_of_birth: formData.placeOfBirth,
  }
}

/**
 * same
 */
function transformPersonalDataB(
  formData: Partial<PersonalDataFormData>
): Partial<StudentRecord> {
  return {
    religious_affiliation: formData.religiousAffiliation,
    civil_status: formData.civilStatus,
    civil_status_others: formData.otherCivilStatus,
    number_of_children: formData.noOfChildren,
    address_iligan: formData.addressInIligan,
    contact_number: formData.contactNo,
    home_address: formData.homeAddress,
    stays_with: formData.staysWith,
    working_student_status: formData.workingStudent,
    talents_skills: formData.talentsAndSkills,
  }
}

/**
 * same
 */
function transformPersonalDataC(
  formData: Partial<PersonalDataFormData>
): Partial<StudentRecord> {
  const seriousMedicalCondition = formData.seriousMedicalCondition || "None"
  const physicalDisability = formData.physicalDisability || "None"

  return {
    leisure_activities: formData.leisureAndRecreationalActivities,
    medical_condition: convertMedicalCondition(seriousMedicalCondition),
    // set to null if "None" is selected, otherwise use the value
    medical_condition_others:
      seriousMedicalCondition === "None"
        ? null
        : formData.otherSeriousMedicalCondition || null,
    physical_disability: convertMedicalCondition(physicalDisability),
    // set to null if "None" is selected, otherwise use the value
    physical_disability_others:
      physicalDisability === "None"
        ? null
        : formData.otherPhysicalDisability || null,
    gender_identity: formData.genderIdentity,
    attraction: formData.sexualAttraction,
  }
}

function transformFamilyDataA(
  formData: Partial<FamilyDataFormData>
): Partial<StudentRecord> {
  return {
    father_name: formData.fathersName,
    father_deceased: convertStatusToBoolean(formData.fathersStatus || "Living"),
    father_occupation: formData.fathersOccupation,
    father_contact_number: formData.fathersContactNo,
    mother_name: formData.mothersName,
    mother_deceased: convertStatusToBoolean(formData.mothersStatus || "Living"),
    mother_occupation: formData.mothersOccupation,
    mother_contact_number: formData.mothersContactNo,
    parents_marital_status: formData.parentsMaritalStatus,
    family_monthly_income: formData.familyMonthlyIncome,
  }
}

function transformFamilyDataB(
  formData: Partial<FamilyDataFormData>
): Partial<StudentRecord> {
  return {
    guardian_name: formData.guardianName,
    guardian_occupation: formData.guardianOccupation,
    guardian_contact_number: formData.guardianContactNo,
    guardian_relationship: formData.relationshipWithGuardian,
    ordinal_position: formData.ordinalPosition,
    number_of_siblings: formData.noOfSiblings,
    home_environment_description: formData.describeEnvironment,
  }
}

// database data to form data

/**
 * convert database record to Personal Data Part A form format
 */
function transformFromPersonalDataA(
  dbRecord: StudentRecord
): Partial<PersonalDataFormData> {
  return {
    idNo: dbRecord.id_number,
    course: dbRecord.course,
    saseScore: dbRecord.msu_sase_score,
    academicYear: dbRecord.academic_year,
    familyName: dbRecord.family_name,
    givenName: dbRecord.given_name,
    middleInitial: dbRecord.middle_initial,
    studentStatus: dbRecord.student_status as
      | "New"
      | "Transferee"
      | "Returnee"
      | "Shiftee"
      | undefined,
    nickname: dbRecord.nickname,
    age: dbRecord.age,
    sex: dbRecord.sex as "Male" | "Female" | undefined,
    citizenship: dbRecord.citizenship,
    dateOfBirth: dbRecord.date_of_birth,
    placeOfBirth: dbRecord.place_of_birth,
  }
}

function transformFromPersonalDataB(
  dbRecord: StudentRecord
): Partial<PersonalDataFormData> {
  return {
    religiousAffiliation: dbRecord.religious_affiliation,
    civilStatus: dbRecord.civil_status as
      | "Single"
      | "Married"
      | "Not legally married"
      | "Separated"
      | "Widowed"
      | "Others"
      | undefined,
    otherCivilStatus: dbRecord.civil_status_others,
    noOfChildren: dbRecord.number_of_children,
    addressInIligan: dbRecord.address_iligan,
    contactNo: dbRecord.contact_number,
    homeAddress: dbRecord.home_address,
    staysWith: dbRecord.stays_with as
      | "Parents/Guardians"
      | "Board/Room mates"
      | "Relatives"
      | "Friends"
      | "Employer"
      | "Living on my own"
      | undefined,
    workingStudent: dbRecord.working_student_status as
      | "Yes, full time"
      | "Yes, part time"
      | "No, but planning to work"
      | "No, and have no plan to work"
      | undefined,
    talentsAndSkills: dbRecord.talents_skills,
  }
}

function transformFromPersonalDataC(
  dbRecord: StudentRecord
): Partial<PersonalDataFormData> {
  const seriousMedicalCondition = convertMedicalConditionFromDB(
    dbRecord.medical_condition
  )
  const physicalDisability = convertMedicalConditionFromDB(
    dbRecord.physical_disability
  )

  return {
    leisureAndRecreationalActivities: dbRecord.leisure_activities,
    seriousMedicalCondition,
    // if "None" is selected, set to empty string (will be cleared by useEffect in component)
    // otherwise, use the database value
    otherSeriousMedicalCondition:
      seriousMedicalCondition === "None"
        ? ""
        : dbRecord.medical_condition_others || "",
    physicalDisability,
    // if "None" is selected, set to empty string (will be cleared by useEffect in component)
    // otherwise, use the database value
    otherPhysicalDisability:
      physicalDisability === "None"
        ? ""
        : dbRecord.physical_disability_others || "",
    genderIdentity: dbRecord.gender_identity as
      | "Male/Man"
      | "Female/Woman"
      | "Transgender Male/Man"
      | "Transgender Female/Woman"
      | "Gender Variant/Nonconforming"
      | "Not listed"
      | "Prefer not to answer"
      | undefined,
    sexualAttraction: dbRecord.attraction as
      | "My same gender"
      | "Opposite my gender"
      | "Both men and women"
      | "All genders"
      | "Neither gender"
      | "Prefer not to answer"
      | undefined,
  }
}

function transformFromFamilyDataA(
  dbRecord: StudentRecord
): Partial<FamilyDataFormData> {
  return {
    fathersName: dbRecord.father_name,
    fathersStatus: convertBooleanToStatus(dbRecord.father_deceased),
    fathersOccupation: dbRecord.father_occupation,
    fathersContactNo: dbRecord.father_contact_number,
    mothersName: dbRecord.mother_name,
    mothersStatus: convertBooleanToStatus(dbRecord.mother_deceased),
    mothersOccupation: dbRecord.mother_occupation,
    mothersContactNo: dbRecord.mother_contact_number,
    parentsMaritalStatus: dbRecord.parents_marital_status as
      | "Married"
      | "Not Legally Married"
      | "Separated"
      | "Both parents remarried"
      | "One parent remarried"
      | undefined,
    familyMonthlyIncome: dbRecord.family_monthly_income as
      | "Below 3,000"
      | "3,001-5,000"
      | "5,001-8,000"
      | "8,001-10,000"
      | "10,001-15,000"
      | "15,001-20,000"
      | "Above 20,001"
      | undefined,
  }
}

function transformFromFamilyDataB(
  dbRecord: StudentRecord
): Partial<FamilyDataFormData> {
  return {
    guardianName: dbRecord.guardian_name,
    guardianOccupation: dbRecord.guardian_occupation,
    guardianContactNo: dbRecord.guardian_contact_number,
    relationshipWithGuardian: dbRecord.guardian_relationship,
    ordinalPosition: dbRecord.ordinal_position as
      | "Only Child"
      | "Eldest"
      | "Middle"
      | "Youngest"
      | undefined,
    noOfSiblings: dbRecord.number_of_siblings,
    describeEnvironment: dbRecord.home_environment_description,
  }
}

// section completion checkers, treat it as 2nd na validation pero for the db

function checkPersonalDataComplete(dbRecord: StudentRecord): boolean {
  const partAComplete =
    !!dbRecord.id_number &&
    !!dbRecord.course &&
    dbRecord.msu_sase_score !== undefined &&
    dbRecord.msu_sase_score !== null &&
    !!dbRecord.academic_year &&
    !!dbRecord.family_name &&
    !!dbRecord.given_name &&
    !!dbRecord.middle_initial &&
    !!dbRecord.student_status &&
    !!dbRecord.nickname &&
    dbRecord.age !== undefined &&
    dbRecord.age !== null &&
    !!dbRecord.sex &&
    !!dbRecord.citizenship &&
    !!dbRecord.date_of_birth &&
    !!dbRecord.place_of_birth

  const partBComplete =
    !!dbRecord.religious_affiliation &&
    !!dbRecord.civil_status &&
    // otherCivilStatus is conditional (only if civilStatus === "Others")
    (dbRecord.civil_status !== "Others" || !!dbRecord.civil_status_others) &&
    dbRecord.number_of_children !== undefined &&
    dbRecord.number_of_children !== null &&
    !!dbRecord.address_iligan &&
    !!dbRecord.contact_number &&
    !!dbRecord.home_address &&
    !!dbRecord.stays_with &&
    !!dbRecord.working_student_status &&
    !!dbRecord.talents_skills

  const partCComplete =
    !!dbRecord.leisure_activities &&
    // seriousMedicalCondition is optional, but if "Existing", must have description
    (dbRecord.medical_condition !== "Existing" ||
      !!dbRecord.medical_condition_others) &&
    // physicalDisability is optional, but if "Existing", must have description
    (dbRecord.physical_disability !== "Existing" ||
      !!dbRecord.physical_disability_others) &&
    !!dbRecord.gender_identity &&
    !!dbRecord.attraction

  return partAComplete && partBComplete && partCComplete
}

function checkFamilyDataComplete(dbRecord: StudentRecord): boolean {
  const partAComplete =
    !!dbRecord.father_name &&
    dbRecord.father_deceased !== undefined &&
    dbRecord.father_deceased !== null &&
    !!dbRecord.father_occupation &&
    !!dbRecord.father_contact_number &&
    !!dbRecord.mother_name &&
    dbRecord.mother_deceased !== undefined &&
    dbRecord.mother_deceased !== null &&
    !!dbRecord.mother_occupation &&
    !!dbRecord.mother_contact_number &&
    !!dbRecord.parents_marital_status &&
    !!dbRecord.family_monthly_income

  const partBComplete =
    !!dbRecord.guardian_name &&
    !!dbRecord.guardian_occupation &&
    !!dbRecord.guardian_contact_number &&
    !!dbRecord.guardian_relationship &&
    !!dbRecord.ordinal_position &&
    dbRecord.number_of_siblings !== undefined &&
    dbRecord.number_of_siblings !== null &&
    !!dbRecord.home_environment_description

  return partAComplete && partBComplete
}

// public api funcs

/**
 * get current authenticated users ID
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id || null
}

/**
 * check if student profile exists for current user
 */
export async function profileExists(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return false

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", userId)
      .single()

    return !error && !!data
  } catch (error) {
    console.error("Error checking profile existence:", error)
    return false
  }
}

/**
 * get student profile progress/completion status
 */
export async function getProfileProgress(): Promise<{
  lastSection: number | null
  lastPart: number | null
  completedSections: number[]
}> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { lastSection: null, lastPart: null, completedSections: [] }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("students")
      .select(
        "is_personal_data_complete, is_family_data_complete, id_number, religious_affiliation, gender_identity, father_name, guardian_name"
      )
      .eq("auth_user_id", userId)
      .single()

    if (error || !data) {
      return { lastSection: null, lastPart: null, completedSections: [] }
    }

    const completedSections: number[] = []
    if (data.is_personal_data_complete) completedSections.push(0)
    if (data.is_family_data_complete) completedSections.push(1)

    // determine last section/part based on what's filled
    // check from MOST RECENT (latest part) to LEAST RECENT (earliest part)
    // this ensures we find the actual latest position
    let lastSection: number | null = null
    let lastPart: number | null = null

    // check Family Data Part B first (most advanced)
    if (data.guardian_name) {
      lastSection = 2
      lastPart = 0
    }
    // check Family Data Part A
    else if (data.father_name) {
      lastSection = 1
      lastPart = 1
    }
    // check Personal Data Part C
    else if (data.gender_identity) {
      lastSection = 1
      lastPart = 0
    }
    // check Personal Data Part B
    else if (data.religious_affiliation) {
      lastSection = 0
      lastPart = 2
    }
    // check Personal Data Part A
    else if (data.id_number) {
      lastSection = 0
      lastPart = 1
    }
    // no data at all
    else {
      lastSection = 0
      lastPart = 0
    }

    return { lastSection, lastPart, completedSections }
  } catch (error) {
    console.error("Error getting profile progress:", error)
    return { lastSection: null, lastPart: null, completedSections: [] }
  }
}

/**
 * get student section data and convert to form format
 */
export async function getStudentSection(
  sectionIndex: SectionIndex,
  partIndex: PartIndex
): Promise<Partial<PersonalDataFormData> | Partial<FamilyDataFormData> | null> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("auth_user_id", userId)
      .single()

    if (error || !data) {
      return null
    }

    // transform based on section and part
    if (sectionIndex === 0) {
      // Personal Data
      if (partIndex === 0) return transformFromPersonalDataA(data)
      if (partIndex === 1) return transformFromPersonalDataB(data)
      if (partIndex === 2) return transformFromPersonalDataC(data)
    }

    if (sectionIndex === 1) {
      // Family Data
      if (partIndex === 0) return transformFromFamilyDataA(data)
      if (partIndex === 1) return transformFromFamilyDataB(data)
    }

    return null
  } catch (error) {
    console.error("Error getting student section:", error)
    return null
  }
}

/**
 * save student section data to database
 * uses UPSERT to handle both insert and update
 */
export async function saveStudentSection(
  formData: Partial<PersonalDataFormData> | Partial<FamilyDataFormData>,
  sectionIndex: SectionIndex,
  partIndex: PartIndex
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const supabase = await createClient()

    // transform form data to database format based on section/part
    let dbData: Partial<StudentRecord> = {}

    if (sectionIndex === 0) {
      // Personal Data
      if (partIndex === 0) {
        dbData = transformPersonalDataA(
          formData as Partial<PersonalDataFormData>
        )
      } else if (partIndex === 1) {
        dbData = transformPersonalDataB(
          formData as Partial<PersonalDataFormData>
        )
      } else if (partIndex === 2) {
        dbData = transformPersonalDataC(
          formData as Partial<PersonalDataFormData>
        )
      }
    } else if (sectionIndex === 1) {
      // Family Data
      if (partIndex === 0) {
        dbData = transformFamilyDataA(formData as Partial<FamilyDataFormData>)
      } else if (partIndex === 1) {
        dbData = transformFamilyDataB(formData as Partial<FamilyDataFormData>)
      }
    }

    // always include auth_user_id
    dbData.auth_user_id = userId

    // check if record exists
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", userId)
      .single()

    let result

    if (existing) {
      // update existing record
      const { error } = await supabase
        .from("students")
        .update(dbData)
        .eq("auth_user_id", userId)

      if (error) {
        console.error("Error updating student record:", error)
        return { success: false, error: error.message }
      }

      result = existing
    } else {
      // insert new record
      const { data, error } = await supabase
        .from("students")
        .insert(dbData)
        .select("id")
        .single()

      if (error) {
        console.error("Error inserting student record:", error)
        return { success: false, error: error.message }
      }

      result = data

      // update profiles.student_profile_id after creating student record
      if (result?.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ student_profile_id: result.id })
          .eq("id", userId)

        if (profileError) {
          console.error("Error updating profile:", profileError)
          // dont fail the whole operation if this fails
        }
      }
    }

    // check and update completion flags
    if (result) {
      const { data: fullRecord } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", userId)
        .single()

      if (fullRecord) {
        const updateFlags: Partial<StudentRecord> = {}

        if (sectionIndex === 0 && checkPersonalDataComplete(fullRecord)) {
          updateFlags.is_personal_data_complete = true
        }

        if (sectionIndex === 1 && checkFamilyDataComplete(fullRecord)) {
          updateFlags.is_family_data_complete = true
        }

        if (Object.keys(updateFlags).length > 0) {
          await supabase
            .from("students")
            .update(updateFlags)
            .eq("auth_user_id", userId)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving student section:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * get full student profile (all sections)
 * useful for initial load
 */
export async function getStudentProfile(): Promise<StudentRecord | null> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return null
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("auth_user_id", userId)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting student profile:", error)
    return null
  }
}
