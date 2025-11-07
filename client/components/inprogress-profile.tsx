"use client"

import { useState, useEffect } from "react"
import {
  UserStarIcon,
  HandHeartIcon,
  GraduationCapIcon,
  WifiIcon,
  RibbonIcon,
  RoseIcon,
  CircleAlertIcon,
} from "lucide-react"
import { Progress } from "./ui/progress"
import CatImage from "@/components/happy-toast"
import CatImageSad from "@/components/sad-toast"
import { CircleCheckIcon } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "./ui/button"
import {
  PersonalDataASection,
  PersonalDataASectionRef,
} from "./profiling-sections/personal-data/personal-data-a"
import {
  PersonalDataBSection,
  PersonalDataBSectionRef,
} from "./profiling-sections/personal-data/personal-data-b"
import {
  PersonalDataCSection,
  PersonalDataCSectionRef,
} from "./profiling-sections/personal-data/personal-data-c"
import {
  FamilyDataASection,
  FamilyDataASectionRef,
} from "./profiling-sections/family-data/family-data-a"
import {
  FamilyDataBSection,
  FamilyDataBSectionRef,
} from "./profiling-sections/family-data/family-data-b"

import {
  studentIndividualDataSchema,
  familyDataSchema,
  academicDataSchema,
} from "@/lib/schemas"
import {
  saveStudentSection,
  getStudentSection,
  profileExists,
  getProfileProgress,
  getStudentProfile,
} from "@/lib/api/students"
import { toast } from "sonner"
import Image from "next/image"
import MSULove from "@/public/msu iit love.png"
import * as z from "zod"

import { useRef } from "react"

type PersonalDataFormFields = keyof z.infer<typeof studentIndividualDataSchema>
type FamilyDataFormFields = keyof z.infer<typeof familyDataSchema>
type AcademicDataFormFields = keyof z.infer<typeof academicDataSchema>

type FormFields =
  | PersonalDataFormFields
  | FamilyDataFormFields
  | AcademicDataFormFields

export function InProgressProfile() {
  // 0–5 (6 sections)
  const [currentSection, setCurrentSection] = useState(0)
  const [currentPart, setCurrentPart] = useState(0)
  const [isIconGrabbed, setIsIconGrabbed] = useState(false)
  const [draggedOverStep, setDraggedOverStep] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [loadedProfileData, setLoadedProfileData] =
    useState<Awaited<ReturnType<typeof getStudentProfile>>>(null) // Store full profile data
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const circleRefs = useRef<(HTMLDivElement | null)[]>([])

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current)
      }
    }
  }, [])

  // Helper function to populate current visible form
  const populateCurrentForm = async (
    fullProfile: Awaited<ReturnType<typeof getStudentProfile>>
  ) => {
    if (!fullProfile) return

    // Wait a tick for form to be mounted
    await new Promise((resolve) => setTimeout(resolve, 50))

    if (currentSection === 0) {
      // Personal Data
      if (currentPart === 0) {
        const dataA = transformFromPersonalDataA(fullProfile)
        if (dataA && personalDataARef.current && hasAnyData(dataA)) {
          personalDataARef.current.form.reset(
            dataA as Parameters<typeof personalDataARef.current.form.reset>[0]
          )
        }
      } else if (currentPart === 1) {
        const dataB = transformFromPersonalDataB(fullProfile)
        if (dataB && personalDataBRef.current && hasAnyData(dataB)) {
          personalDataBRef.current.form.reset(
            dataB as Parameters<typeof personalDataBRef.current.form.reset>[0]
          )
        }
      } else if (currentPart === 2) {
        const dataC = transformFromPersonalDataC(fullProfile)
        if (dataC && personalDataCRef.current && hasAnyData(dataC)) {
          personalDataCRef.current.form.reset(
            dataC as Parameters<typeof personalDataCRef.current.form.reset>[0]
          )
        }
      }
    } else if (currentSection === 1) {
      // Family Data
      if (currentPart === 0) {
        const familyA = transformFromFamilyDataA(fullProfile)
        if (familyA && familyDataARef.current && hasAnyData(familyA)) {
          familyDataARef.current.form.reset(
            familyA as Parameters<typeof familyDataARef.current.form.reset>[0]
          )
        }
      } else if (currentPart === 1) {
        const familyB = transformFromFamilyDataB(fullProfile)
        if (familyB && familyDataBRef.current && hasAnyData(familyB)) {
          familyDataBRef.current.form.reset(
            familyB as Parameters<typeof familyDataBRef.current.form.reset>[0]
          )
        }
      }
    }
  }

  // Populate form when section/part changes (if data is already loaded)
  useEffect(() => {
    if (loadedProfileData && !isLoading && !isSaving) {
      populateCurrentForm(loadedProfileData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, currentPart])

  // Helper to check if object has any non-undefined values
  const hasAnyData = (data: Record<string, unknown>): boolean => {
    return Object.values(data).some(
      (value) => value !== undefined && value !== null && value !== ""
    )
  }

  // Helper to transform from database format (matching Flask backend transformations)
  // We need to import these or recreate them here
  const transformFromPersonalDataA = (
    dbRecord: NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>
  ) => {
    return {
      idNo: dbRecord.id_number,
      course: dbRecord.course,
      saseScore: dbRecord.msu_sase_score,
      academicYear: dbRecord.academic_year,
      familyName: dbRecord.family_name,
      givenName: dbRecord.given_name,
      middleInitial: dbRecord.middle_initial,
      studentStatus: dbRecord.student_status,
      nickname: dbRecord.nickname,
      age: dbRecord.age,
      sex: dbRecord.sex,
      citizenship: dbRecord.citizenship,
      dateOfBirth: dbRecord.date_of_birth,
      placeOfBirth: dbRecord.place_of_birth,
    }
  }

  const transformFromPersonalDataB = (
    dbRecord: NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>
  ) => {
    return {
      religiousAffiliation: dbRecord.religious_affiliation,
      civilStatus: dbRecord.civil_status,
      otherCivilStatus: dbRecord.civil_status_others,
      noOfChildren: dbRecord.number_of_children,
      addressInIligan: dbRecord.address_iligan,
      contactNo: dbRecord.contact_number,
      homeAddress: dbRecord.home_address,
      staysWith: dbRecord.stays_with,
      workingStudent: dbRecord.working_student_status,
      talentsAndSkills: dbRecord.talents_skills,
    }
  }

  const transformFromPersonalDataC = (
    dbRecord: NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>
  ) => {
    const seriousMedicalCondition =
      dbRecord.medical_condition === "Existing" ? "Existing" : "None"
    const physicalDisability =
      dbRecord.physical_disability === "Existing" ? "Existing" : "None"

    return {
      leisureAndRecreationalActivities: dbRecord.leisure_activities,
      seriousMedicalCondition,
      // If "None", set to empty string (will be cleared by component's useEffect)
      otherSeriousMedicalCondition:
        seriousMedicalCondition === "None"
          ? ""
          : dbRecord.medical_condition_others || "",
      physicalDisability,
      // If "None", set to empty string (will be cleared by component's useEffect)
      otherPhysicalDisability:
        physicalDisability === "None"
          ? ""
          : dbRecord.physical_disability_others || "",
      genderIdentity: dbRecord.gender_identity,
      sexualAttraction: dbRecord.attraction,
    }
  }

  const transformFromFamilyDataA = (
    dbRecord: NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>
  ) => {
    return {
      fathersName: dbRecord.father_name,
      fathersStatus: dbRecord.father_deceased === true ? "Deceased" : "Living",
      fathersOccupation: dbRecord.father_occupation,
      fathersContactNo: dbRecord.father_contact_number,
      mothersName: dbRecord.mother_name,
      mothersStatus: dbRecord.mother_deceased === true ? "Deceased" : "Living",
      mothersOccupation: dbRecord.mother_occupation,
      mothersContactNo: dbRecord.mother_contact_number,
      parentsMaritalStatus: dbRecord.parents_marital_status,
      familyMonthlyIncome: dbRecord.family_monthly_income,
    }
  }

  const transformFromFamilyDataB = (
    dbRecord: NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>
  ) => {
    return {
      guardianName: dbRecord.guardian_name,
      guardianOccupation: dbRecord.guardian_occupation,
      guardianContactNo: dbRecord.guardian_contact_number,
      relationshipWithGuardian: dbRecord.guardian_relationship,
      ordinalPosition: dbRecord.ordinal_position,
      noOfSiblings: dbRecord.number_of_siblings,
      describeEnvironment: dbRecord.home_environment_description,
    }
  }

  // Initial load: Check if profile exists and load ALL saved data
  useEffect(() => {
    async function loadInitialProfile() {
      if (!isInitialLoad) return

      setIsInitialLoad(false)
      setIsLoading(true)

      try {
        const exists = await profileExists()
        if (!exists) {
          setIsLoading(false)
          return // New user, start with empty forms
        }

        // Get profile progress to restore navigation position
        const progress = await getProfileProgress()

        if (progress.lastSection !== null && progress.lastPart !== null) {
          // Restore navigation position
          setCurrentSection(progress.lastSection)
          setCurrentPart(progress.lastPart)
        }

        // Fetch ALL profile data and store it
        // Forms will be populated when they become visible
        const fullProfile = await getStudentProfile()
        if (fullProfile) {
          setLoadedProfileData(fullProfile)
          // Populate current form immediately
          await populateCurrentForm(fullProfile)
        }
      } catch (error) {
        console.error("Error loading initial profile:", error)
        toast.error("Failed to load profile data", { duration: 3000 })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad])

  // refs for form sections
  const personalDataARef = useRef<PersonalDataASectionRef>(null)
  const personalDataBRef = useRef<PersonalDataBSectionRef>(null)
  const personalDataCRef = useRef<PersonalDataCSectionRef>(null)
  const familyDataARef = useRef<FamilyDataASectionRef>(null)
  const familyDataBRef = useRef<FamilyDataBSectionRef>(null)

  const sections = [
    { name: "Personal Data", parts: 3 },
    { name: "Family Data", parts: 2 },
    { name: "Academic Data", parts: 2 },
    { name: "Distance Learning", parts: 2 },
    { name: "Psychosocial", parts: 2 },
    { name: "Needs Assessment", parts: 2 },
  ]

  // calculate progress for the current section
  const totalParts = sections[currentSection].parts
  const progress = ((currentPart + 1) / totalParts) * 100

  // get current form ref based on section and part
  const getCurrentFormRef = () => {
    if (currentSection === 0) {
      if (currentPart === 0) return personalDataARef
      if (currentPart === 1) return personalDataBRef
      if (currentPart === 2) return personalDataCRef
    }
    if (currentSection === 1) {
      if (currentPart === 0) return familyDataARef
      if (currentPart === 1) return familyDataBRef
    }
    return null
  }

  // get fields to validate for current section/part
  const getFieldsToValidate = (): FormFields[] => {
    if (currentSection === 0) {
      if (currentPart === 0) {
        return [
          "idNo",
          "course",
          "saseScore",
          "academicYear",
          "familyName",
          "givenName",
          "middleInitial",
          "studentStatus",
          "nickname",
          "age",
          "sex",
          "citizenship",
          "dateOfBirth",
          "placeOfBirth",
        ]
      }
      if (currentPart === 1) {
        return [
          "religiousAffiliation",
          "civilStatus",
          "otherCivilStatus",
          "noOfChildren",
          "addressInIligan",
          "contactNo",
          "homeAddress",
          "staysWith",
          "workingStudent",
          "talentsAndSkills",
        ]
      }
      if (currentPart === 2) {
        return [
          "leisureAndRecreationalActivities",
          "seriousMedicalCondition",
          "otherSeriousMedicalCondition",
          "physicalDisability",
          "otherPhysicalDisability",
          "genderIdentity",
          "sexualAttraction",
        ]
      }
    }
    if (currentSection === 1) {
      if (currentPart === 0) {
        return [
          "fathersName",
          "fathersStatus",
          "fathersOccupation",
          "fathersContactNo",
          "mothersName",
          "mothersStatus",
          "mothersOccupation",
          "mothersContactNo",
          "parentsMaritalStatus",
          "familyMonthlyIncome",
        ]
      }
      if (currentPart === 1) {
        return [
          "guardianName",
          "guardianOccupation",
          "guardianContactNo",
          "relationshipWithGuardian",
          "ordinalPosition",
          "noOfSiblings",
          "describeEnvironment",
        ]
      }
    }
    if (currentSection === 2) {
      if (currentPart === 0) {
        return [
          "generalPointAverage",
          "scholar",
          "scholarDetails",
          "lastSchoolAttended",
          "lastSchoolAddress",
          "shsTrack",
          "shsStrand",
          "awards",
        ]
      }
      if (currentPart === 1) {
        return [
          "firstChoice",
          "secondChoice",
          "thirdChoice",
          "studentOrg",
          "courseChoiceActor",
          "otherCourseChoiceActor",
          "reasonsForChoosingiit",
          "otherReasonForChoosingiit",
          "reasonForCourse",
          "careerPursuingInFuture",
          "coCurricularActivities",
        ]
      }
    }
    return []
  }

  // nav handlers
  const handleProceed = async () => {
    const currentRef = getCurrentFormRef()

    // validate form if it exists and is mounted
    if (currentRef?.current?.form) {
      const fieldsToValidate = getFieldsToValidate()
      if (fieldsToValidate.length > 0) {
        // Type assertion needed because different sections use different schemas
        // Safe since we validate based on currentSection/currentPart matching the correct schema
        // @ts-expect-error - Different sections use different schemas (PersonalData vs FamilyData)
        const isValid = await currentRef.current.form.trigger(fieldsToValidate)
        if (!isValid) {
          console.log(
            "Validation failed, errors:",
            currentRef.current.form.formState.errors
          )
          toast.error(
            <div className="relative flex w-full items-center pr-14">
              <span className="pl-2">Failed to save. Please try again</span>
              <CatImageSad />
            </div>,
            {
              duration: 3000,
              icon: <CircleCheckIcon className="size-4" />,
            }
          )
          return
        }
      }
    }

    // SAVE current section data before proceeding
    if (currentRef?.current?.form) {
      setIsSaving(true)
      try {
        const formData = currentRef.current.form.getValues()
        const result = await saveStudentSection(
          formData,
          currentSection as 0 | 1 | 2 | 3 | 4 | 5,
          currentPart as 0 | 1 | 2
        )

        if (!result.success) {
          toast.error(result.error || "Failed to save. Please try again.", {
            duration: 3000,
          })
          setIsSaving(false)
          return // Prevent navigation if save fails
        }

        toast.success(
          <div className="relative flex w-full items-center pr-18">
            <span className="pl-2">Section saved successfully</span>
            <CatImage />
          </div>,
          {
            duration: 3000,
            icon: <CircleCheckIcon className="size-4" />,
          }
        )

        // reload profile data after successful save to keep it in sync
        const updatedProfile = await getStudentProfile()
        if (updatedProfile) {
          setLoadedProfileData(updatedProfile)
        }
      } catch (error) {
        console.error("Error saving section:", error)
        toast.error(
          <div className="relative flex w-full items-center pr-14">
            <span className="pl-2">Failed to save. Please try again</span>
            <CatImageSad />
          </div>,
          {
            duration: 3000,
            icon: <CircleCheckIcon className="size-4" />,
          }
        )
        setIsSaving(false)
        return // prevent navigation if save fails
      } finally {
        setIsSaving(false)
      }
    }

    // proceed to next part or section
    if (currentPart < totalParts - 1) {
      setCurrentPart((p) => p + 1)
    } else if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1)
      setCurrentPart(0)
    }
  }

  // nav handlers
  const handleProceedDEV = async () => {
    // proceed to next part or section
    if (currentPart < totalParts - 1) {
      setCurrentPart((p) => p + 1)
    } else if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1)
      setCurrentPart(0)
    }
  }

  const handlePrevious = () => {
    // Navigate to previous part/section
    // Data is already loaded from initial populateAllForms(), so we just navigate
    if (currentPart > 0) {
      setCurrentPart((p) => p - 1)
    } else if (currentSection > 0) {
      setCurrentSection((s) => s - 1)
      const prevParts = sections[currentSection - 1].parts
      setCurrentPart(prevParts - 1)
    }
  }

  const handleReset = () => {
    const currentRef = getCurrentFormRef()
    if (currentRef?.current) {
      currentRef.current.form.reset()
    }
  }

  // handle step click - navigate to section's first part
  const handleStepClick = (sectionIndex: number) => {
    // only allow navigation to sections that have been reached (or current section)
    if (sectionIndex <= currentSection) {
      // Navigate to section - data is already loaded from initial populateAllForms()
      setCurrentSection(sectionIndex)
      setCurrentPart(0)
    }
  }

  const renderForm = () => {
    if (currentSection === 0) {
      if (currentPart === 0)
        return <PersonalDataASection ref={personalDataARef} />
      if (currentPart === 1)
        return <PersonalDataBSection ref={personalDataBRef} />
      if (currentPart === 2)
        return <PersonalDataCSection ref={personalDataCRef} />
    }
    if (currentSection === 1) {
      if (currentPart === 0) return <FamilyDataASection ref={familyDataARef} />
      if (currentPart === 1) return <FamilyDataBSection ref={familyDataBRef} />
    }

    // placeholder muna
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-500">
        <p>
          Section {currentSection + 1}, Part {currentPart + 1}
        </p>
        <p className="text-sm">to be implementtedddddddddddd</p>
      </div>
    )
  }

  const stepIcons = [
    UserStarIcon,
    HandHeartIcon,
    GraduationCapIcon,
    WifiIcon,
    RibbonIcon,
    RoseIcon,
  ]

  return (
    <div className="flex">
      <div
        id="steps"
        className="relative mt-3 flex w-[260px] flex-col gap-7 px-21"
        onDragOver={(e) => {
          // allow dragging over the container
          if (isDragging) {
            e.preventDefault()
            e.dataTransfer.dropEffect = "move"
          }
        }}
        onDrop={(e) => {
          // handle drop outside of any step (cancel drag)
          if (isDragging) {
            e.preventDefault()
            setDraggedOverStep(null)
            setIsDragging(false)
            setIsIconGrabbed(false)
            if (dragOverTimeoutRef.current) {
              clearTimeout(dragOverTimeoutRef.current)
              dragOverTimeoutRef.current = null
            }
          }
        }}
      >
        <Image
          src={MSULove}
          alt="MSU Love Icon"
          draggable
          className={`absolute z-50 h-18 w-12 transition-all duration-300 ease-in-out hover:scale-110 ${
            isDragging
              ? "cursor-grabbing opacity-70"
              : isIconGrabbed
                ? "cursor-grabbing"
                : "cursor-pointer"
          }`}
          style={{
            left: "50%",
            top: `${currentSection * 70 - 40 + [0, 10, 19, 29, 37, 46][currentSection]}px`,
            transform: `translateX(${[-43, -88, -136, -88, -46, -98][currentSection] + 8}px)`,
          }}
          onMouseDown={() => setIsIconGrabbed(true)}
          onMouseUp={() => {
            setIsIconGrabbed(false)
            setIsDragging(false)
          }}
          onMouseLeave={() => {
            if (!isDragging) {
              setIsIconGrabbed(false)
            }
          }}
          onDragStart={(e) => {
            setIsDragging(true)
            setIsIconGrabbed(true)
            e.dataTransfer.effectAllowed = "move"
            e.dataTransfer.setData("text/plain", "msu-love-icon")
          }}
          onDragEnd={() => {
            setIsDragging(false)
            setIsIconGrabbed(false)
            setDraggedOverStep(null)
            if (dragOverTimeoutRef.current) {
              clearTimeout(dragOverTimeoutRef.current)
              dragOverTimeoutRef.current = null
            }
          }}
        />
        <div className="absolute -translate-x-[62px] translate-y-12">
          <svg
            width="98"
            height="380"
            viewBox="0 0 98 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_1098_17622)">
              <path
                d="M80.549 0.306885C73.3736 34.6504 63.8137 49.3067 37.549 67.8069C1.66176 101.411 6.04899 132.307 5.54896 139.307C5.04894 146.307 7.88242 189.975 37.549 209.307C76.7648 226.744 88.3142 243.987 92.049 286.807C92.0207 325.487 80.6849 343.12 48.549 370.307"
                stroke="#747B7D"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_1098_17622"
                x="0"
                y="0"
                width="97.5488"
                height="379.452"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1098_17622"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1098_17622"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        {stepIcons.map((Icon, index) => {
          const isActive = index <= currentSection
          const isClickable = index <= currentSection
          const mainColor = isActive ? "bg-main" : "bg-main4"
          const shadowColor = isActive ? "bg-main-dark" : "bg-main2"

          const translateX = [-0, -45, -92, -45, -3, -55][index]

          const isDragOver = draggedOverStep === index && isDragging

          return (
            <div
              key={index}
              className={`relative ${isClickable ? "cursor-pointer" : "cursor-not-allowed"} ${
                isClickable ? "group" : ""
              }`}
              id={`circle-${index + 1}`}
              onClick={() => isClickable && handleStepClick(index)}
              onDragEnter={(e) => {
                if (isClickable && isDragging) {
                  // check if mouse is actually over the circle area using the circle's bounding rect
                  const circleEl = circleRefs.current[index]
                  if (circleEl) {
                    const rect = circleEl.getBoundingClientRect()
                    const circleCenterX = rect.left + rect.width / 2
                    const circleCenterY = rect.top + rect.height / 2
                    const distance = Math.sqrt(
                      Math.pow(e.clientX - circleCenterX, 2) +
                        Math.pow(e.clientY - circleCenterY, 2)
                    )

                    // then only trigger if within circle radius + padding (circle is ~32px radius, so 45px gives some buffer)
                    if (distance < 45) {
                      e.preventDefault()
                      if (dragOverTimeoutRef.current) {
                        clearTimeout(dragOverTimeoutRef.current)
                      }
                      setDraggedOverStep(index)
                    }
                  }
                }
              }}
              onDragOver={(e) => {
                // always prevent default to allow dropping
                if (isDragging) {
                  e.preventDefault()

                  if (isClickable) {
                    // check if mouse is actually over the circle area using the circle's bounding rect
                    const circleEl = circleRefs.current[index]
                    if (circleEl) {
                      const rect = circleEl.getBoundingClientRect()
                      const circleCenterX = rect.left + rect.width / 2
                      const circleCenterY = rect.top + rect.height / 2
                      const distance = Math.sqrt(
                        Math.pow(e.clientX - circleCenterX, 2) +
                          Math.pow(e.clientY - circleCenterY, 2)
                      )

                      // only highlight if within circle radius + padding (estimate lang na 45px)
                      const isOverCircle = distance < 45

                      if (isOverCircle) {
                        e.stopPropagation()
                        e.dataTransfer.dropEffect = "move"
                        if (draggedOverStep !== index) {
                          if (dragOverTimeoutRef.current) {
                            clearTimeout(dragOverTimeoutRef.current)
                          }
                          setDraggedOverStep(index)
                        }
                      } else {
                        // mouse is over container but not circle - clear highlight
                        e.dataTransfer.dropEffect = "none"
                        if (draggedOverStep === index) {
                          if (dragOverTimeoutRef.current) {
                            clearTimeout(dragOverTimeoutRef.current)
                          }
                          dragOverTimeoutRef.current = setTimeout(() => {
                            setDraggedOverStep(null)
                            dragOverTimeoutRef.current = null
                          }, 50)
                        }
                      }
                    }
                  } else {
                    e.dataTransfer.dropEffect = "none"
                  }
                }
              }}
              onDragLeave={(e) => {
                // more reliable drag leave detection
                // check if we're moving to a different element (not a child of this one)
                const relatedTarget = e.relatedTarget as Node | null
                const currentTarget = e.currentTarget as Node

                // if relatedTarget is null or not a child of currentTarget, were truly leaving
                if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
                  // also check mouse position as fallback
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX || 0
                  const y = e.clientY || 0

                  const padding = 25 // larger padding for easier drop detection
                  const isOutside =
                    x < rect.left - padding ||
                    x > rect.right + padding ||
                    y < rect.top - padding ||
                    y > rect.bottom + padding

                  if (isOutside || !relatedTarget) {
                    // delay clearing to prevent flickering when moving between child elements
                    if (dragOverTimeoutRef.current) {
                      clearTimeout(dragOverTimeoutRef.current)
                    }
                    dragOverTimeoutRef.current = setTimeout(() => {
                      if (draggedOverStep === index) {
                        setDraggedOverStep(null)
                      }
                      dragOverTimeoutRef.current = null
                    }, 100)
                  }
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (dragOverTimeoutRef.current) {
                  clearTimeout(dragOverTimeoutRef.current)
                  dragOverTimeoutRef.current = null
                }

                const data = e.dataTransfer.getData("text/plain")
                if (data === "msu-love-icon" && isClickable && isDragging) {
                  // verify mouse is actually over the circle when dropped
                  const circleEl = circleRefs.current[index]
                  if (circleEl) {
                    const rect = circleEl.getBoundingClientRect()
                    const circleCenterX = rect.left + rect.width / 2
                    const circleCenterY = rect.top + rect.height / 2
                    const distance = Math.sqrt(
                      Math.pow(e.clientX - circleCenterX, 2) +
                        Math.pow(e.clientY - circleCenterY, 2)
                    )

                    // only accept drop if within reasonable distance (50px for easier dropping)
                    if (distance < 50) {
                      handleStepClick(index)
                      setDraggedOverStep(null)
                      setIsDragging(false)
                      setIsIconGrabbed(false)
                    }
                  }
                }
              }}
            >
              <div
                className={`absolute h-[51px] w-[64px] translate-y-[7px] ${shadowColor} transition-all duration-200 ${
                  isClickable
                    ? "group-hover:scale-115 group-hover:shadow-lg"
                    : ""
                } ${isDragOver ? "scale-115" : ""}`}
                style={{
                  borderRadius: "100%",
                  transform: `translateX(${translateX}px)`,
                }}
              ></div>
              <div
                ref={(el) => {
                  circleRefs.current[index] = el
                }}
                className={`relative h-[51px] w-[64px] ${mainColor} flex items-center justify-center shadow-md transition-all duration-200 ${
                  isClickable
                    ? "group-hover:scale-115 group-hover:shadow-lg"
                    : "opacity-60"
                } ${isDragOver ? "z-10 scale-115" : ""}`}
                style={{
                  borderRadius: "100%",
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <Icon className="h-[24px] w-[24px] text-white" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex h-[520px] w-full max-w-3xl flex-col">
        <div
          id="form-container"
          className="flex h-[480px] w-full max-w-3xl flex-col rounded-md border"
        >
          <div className="flex-1 overflow-y-auto p-4">
            <Progress value={progress} className="mb-4 h-4 w-full" />
            <div className="min-h-[300px]">{renderForm()}</div>
          </div>
          <div className="border-t p-4">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleReset}
                className="cursor-pointer border"
              >
                Reset Changes
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={
                    (currentSection === 0 && currentPart === 0) ||
                    isSaving ||
                    isLoading
                  }
                  className="cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Previous"}
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={isSaving || isLoading}
                  className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : currentSection === sections.length - 1 &&
                        currentPart === totalParts - 1
                      ? "Finish"
                      : "Proceed"}
                </Button>

                {/* DEV BUTTON: just remove if ok na*/}
                <Button
                  onClick={handleProceedDEV}
                  className="bg-main2 hover:bg-main2/90 cursor-pointer rounded-sm tracking-wide"
                >
                  {currentSection === sections.length - 1 &&
                  currentPart === totalParts - 1
                    ? "for testing: finish"
                    : "for testing: next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-main mt-4 ml-185 text-xs italic">
          <HoverCard>
            <HoverCardTrigger className="">
              <CircleAlertIcon className="text-main2/50 hover:text-main mr-1 mb-0.5 inline h-4 w-4" />
            </HoverCardTrigger>
            <HoverCardContent className="text-center text-xs italic">
              Information will only be saved/updated upon clicking the
              &quot;Proceed&quot; button.
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  )
}
