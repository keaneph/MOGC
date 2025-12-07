import AcademicSection from "@/components/profiling/student-summary/academic-section"
import AcademicShowMoreSection from "@/components/profiling/student-summary/academic-showmore"
import DistanceSection from "@/components/profiling/student-summary/distance-section"
import FamilySection from "@/components/profiling/student-summary/family-section"
import FamilyShowMoreSection from "@/components/profiling/student-summary/family-showmore"
import NeedsSection from "@/components/profiling/student-summary/needs-section"
import NeedsShowMoreSection from "@/components/profiling/student-summary/needs-showmore"
import PersonalSection from "@/components/profiling/student-summary/personal-section"
import PersonalShowMoreSection from "@/components/profiling/student-summary/personal-showmore"
import PsychosocialSection from "@/components/profiling/student-summary/psychosocial-section"
import PsychosocialShowMoreSection from "@/components/profiling/student-summary/psychosocial-showmore"
import SummarySkeleton from "@/components/profiling/student-summary/summary-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CounselorStudentListItem,
  getStudentEmailbyAuthId,
  getStudentProfilebyAuthId,
  isStudentProfileCompleteByAuthId,
  profileExistsByAuthId,
} from "@/lib/api/counselors"
import { StudentRecord } from "@/lib/api/students"
import {
  GraduationCapIcon,
  HandHeartIcon,
  RibbonIcon,
  RoseIcon,
  UserStarIcon,
  WifiIcon,
} from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import StatusBadge, { StatusType } from "../status-badge"

type Props = {
  student: CounselorStudentListItem
}

const StudentProfile: React.FC<Props> = ({ student }) => {
  const studentAuthId = student.studentAuthId
  const [summary, setSummary] = useState<StudentRecord | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<
    "personal" | "family" | "academic" | "distance" | "psychosocial" | "needs"
  >("personal")
  const [showMore, setShowMore] = useState(false)
  const [sectionClicked, setSectionClicked] = useState(false)
  const sectionLabels: Record<typeof activeSection, string> = {
    personal: "Personal",
    family: "Family",
    academic: "Academic",
    distance: "Distance Learning",
    psychosocial: "Psychosocial Wellbeing",
    needs: "Needs Assessment",
  }
  const [profileStatus, setProfileStatus] = useState<
    "none" | "in-progress" | "complete" | null
  >(null)

  useEffect(() => {
    async function fetchData() {
      const profile = await getStudentProfilebyAuthId(studentAuthId)
      setSummary(profile)
      const studentEmail = await getStudentEmailbyAuthId(studentAuthId)
      setEmail(studentEmail)
    }
    fetchData()
  }, [studentAuthId])

  //check if profile exists
  useEffect(() => {
    async function checkProfileByAuthId() {
      const exists = await profileExistsByAuthId(studentAuthId)
      if (!exists) {
        setProfileStatus("none")
        return
      }

      const complete = await isStudentProfileCompleteByAuthId(studentAuthId)
      setProfileStatus(complete ? "complete" : "in-progress")
    }

    checkProfileByAuthId()
  }, [studentAuthId])

  return (
    <div id="main-container" className="mt-7 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="relative flex">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Student Profile
          </div>

          <Card className="absolute -top-5 right-1 mb-5 w-60 rounded-md shadow-md">
            <CardContent>
              <div className="mb-1 flex">
                <span className="text-[12px] tracking-wide">
                  Student Profiling
                </span>
                <div className="ml-auto">
                  {profileStatus === null ? (
                    <Skeleton className="h-3 w-10" />
                  ) : profileStatus === "none" ? (
                    <StatusBadge value={"not started" as StatusType} />
                  ) : profileStatus === "in-progress" ? (
                    <StatusBadge value={"pending" as StatusType} />
                  ) : profileStatus === "complete" ? (
                    <StatusBadge value={"completed" as StatusType} />
                  ) : (
                    <Skeleton className="h-3 w-10" />
                  )}
                </div>
              </div>
              <div className="mb-1 flex">
                <span className="text-[12px] tracking-wide">Assessment</span>
                <div className="ml-auto">
                  <StatusBadge value={student.assessment as StatusType} />
                </div>
              </div>
              <div className="mb-1 flex">
                <span className="text-[12px] tracking-wide">
                  Initial Interview
                </span>
                <div className="ml-auto">
                  <StatusBadge value={student.initialInterview as StatusType} />
                </div>
              </div>
              <div className="mb-1 flex">
                <span className="text-[12px] tracking-wide">Counseling</span>
                <div className="ml-auto">
                  <StatusBadge value={student.counselingStatus as StatusType} />
                </div>
              </div>
              <div className="flex">
                <span className="text-[12px] tracking-wide">
                  Exit Interview
                </span>
                <div className="ml-auto">
                  <StatusBadge value={student.exitInterview as StatusType} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/*Header*/}
        <div className="container mb-5 flex flex-row">
          <Image
            src="/dp.png"
            alt="profile"
            width={100}
            height={50}
            className="mr-5 !h-25 !w-25 object-cover"
          />
          <div className="flex-col">
            <span className="mb-2 font-bold tracking-wide">
              {summary?.given_name ?? <Skeleton className="mb-2 h-4 w-25" />}{" "}
              {summary?.family_name ?? <Skeleton className="mb-2 h-4 w-25" />}
            </span>
            <div className="mb-1 text-xs tracking-wide">
              {email ?? <Skeleton className="mb-2 h-4 w-50" />}
            </div>
            <Badge
              variant="default"
              className="bg-main cursor-pointer text-[10px]"
            >
              {summary?.id_number ?? <Skeleton className="h-3 w-20" />}
            </Badge>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative container mb-5 ml-60 h-20 items-center">
          <div className="border-main2 absolute top-[26%] left-0 z-0 ml-10 w-[420px] border-t-2 border-dashed shadow-[0_8px_30px_rgba(0,0,0,0.4)]"></div>
          <div className="relative z-10 flex items-center">
            {[
              { key: "personal", icon: <UserStarIcon /> },
              { key: "family", icon: <HandHeartIcon /> },
              { key: "academic", icon: <GraduationCapIcon /> },
              { key: "distance", icon: <WifiIcon /> },
              { key: "psychosocial", icon: <RibbonIcon /> },
              { key: "needs", icon: <RoseIcon /> },
            ].map(({ key, icon }) => (
              <Button
                key={key}
                variant="default"
                onClick={() => {
                  setActiveSection(key as typeof activeSection)
                  setShowMore(false)
                  setSectionClicked(true)
                }}
                className={`ml-10 h-10 w-10 cursor-pointer rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${
                  activeSection === key
                    ? "bg-main hover:bg-main"
                    : "bg-main2 hover:bg-main-dark"
                }`}
              >
                {icon}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-5 ml-20">
          <div className="mb-5 text-xl font-medium tracking-wide">
            {sectionClicked ? sectionLabels[activeSection] : "Personal"}
          </div>
        </div>

        {/* Summary Section */}
        <div className="relative container mb-5 ml-20 flex w-[950px] rounded-sm border p-5 pb-0">
          <Image
            src="/sitting-2.png"
            alt="profile"
            width={100}
            height={50}
            className="absolute top-[-125.5px] right-5"
          />
          {summary ? (
            <>
              {activeSection === "personal" && (
                <PersonalSection summary={summary} />
              )}
              {activeSection === "family" && (
                <FamilySection summary={summary} />
              )}
              {activeSection === "academic" && (
                <AcademicSection summary={summary} />
              )}
              {activeSection === "distance" && (
                <DistanceSection summary={summary} />
              )}
              {activeSection === "psychosocial" && (
                <PsychosocialSection summary={summary} />
              )}
              {activeSection === "needs" && <NeedsSection summary={summary} />}
            </>
          ) : (
            <SummarySkeleton />
          )}
        </div>
        <div className="mb-20">
          {/* Show More Section */}
          {summary && activeSection === "personal" && showMore && (
            <>
              <PersonalShowMoreSection summary={summary} />
              <div className="mb-5 ml-20 text-xs">
                <span
                  className="text-link cursor-pointer hover:underline"
                  onClick={() => setShowMore(false)}
                >
                  Show less
                </span>
              </div>
            </>
          )}

          {/* Show More Toggle (initial) */}
          {summary && activeSection === "personal" && !showMore && (
            <div className="mb-5 ml-20 text-xs">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show more
              </span>
            </div>
          )}

          {/* Show More Section */}
          {summary && activeSection === "family" && showMore && (
            <>
              <FamilyShowMoreSection summary={summary} />
              <div className="mb-5 ml-20 text-xs">
                <span
                  className="text-link cursor-pointer hover:underline"
                  onClick={() => setShowMore(false)}
                >
                  Show less
                </span>
              </div>
            </>
          )}

          {/* Show More Toggle (initial) */}
          {summary && activeSection === "family" && !showMore && (
            <div className="mb-5 ml-20 text-xs">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show more
              </span>
            </div>
          )}

          {/* Show More Section */}
          {summary && activeSection === "academic" && showMore && (
            <>
              <AcademicShowMoreSection summary={summary} />
              <div className="mb-5 ml-20 text-xs">
                <span
                  className="text-link cursor-pointer hover:underline"
                  onClick={() => setShowMore(false)}
                >
                  Show less
                </span>
              </div>
            </>
          )}

          {/* Show More Toggle (initial) */}
          {summary && activeSection === "academic" && !showMore && (
            <div className="mb-5 ml-20 text-xs">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show more
              </span>
            </div>
          )}

          {/* Show More Section */}
          {summary && activeSection === "psychosocial" && showMore && (
            <>
              <PsychosocialShowMoreSection summary={summary} />
              <div className="mb-5 ml-20 text-xs">
                <span
                  className="text-link cursor-pointer hover:underline"
                  onClick={() => setShowMore(false)}
                >
                  Show less
                </span>
              </div>
            </>
          )}

          {/* Show More Toggle (initial) */}
          {summary && activeSection === "psychosocial" && !showMore && (
            <div className="mb-5 ml-20 text-xs">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show more
              </span>
            </div>
          )}

          {/* Show More Section */}
          {summary && activeSection === "needs" && showMore && (
            <>
              <NeedsShowMoreSection summary={summary} />
              <div className="mb-5 ml-20 text-xs">
                <span
                  className="text-link cursor-pointer hover:underline"
                  onClick={() => setShowMore(false)}
                >
                  Show less
                </span>
              </div>
            </>
          )}

          {/* Show More Toggle (initial) */}
          {summary && activeSection === "needs" && !showMore && (
            <div className="mb-5 ml-20 text-xs">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show more
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
