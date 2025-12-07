"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useSupabaseEmail } from "@/hooks/use-supabase-email"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import {
  getStudentProfileSummary,
  getStudentStatus,
  StudentRecord,
} from "@/lib/api/students"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  UserStarIcon,
  HandHeartIcon,
  GraduationCapIcon,
  WifiIcon,
  RibbonIcon,
  RoseIcon,
} from "lucide-react"
import PersonalSection from "@/components/profiling/student-summary/personal-section"
import PersonalShowMoreSection from "@/components/profiling/student-summary/personal-showmore"
import SummarySkeleton from "@/components/profiling/student-summary/summary-skeleton"
import FamilySection from "@/components/profiling/student-summary/family-section"
import FamilyShowMoreSection from "@/components/profiling/student-summary/family-showmore"
import AcademicSection from "@/components/profiling/student-summary/academic-section"
import AcademicShowMoreSection from "@/components/profiling/student-summary/academic-showmore"
import DistanceSection from "@/components/profiling/student-summary/distance-section"
import PsychosocialSection from "@/components/profiling/student-summary/psychosocial-section"
import NeedsSection from "./needs-section"
import NeedsShowMoreSection from "./needs-showmore"
import PsychosocialShowMoreSection from "./psychosocial-showmore"
import { CounselorStudentListItem } from "@/lib/api/counselors"
import StatusBadge, {
  StatusType,
} from "@/components/data/student-list/status-badge"

export default function StudentSummaryPage() {
  const [summary, setSummary] = useState<StudentRecord | null>(null)
  const [activeSection, setActiveSection] = useState<
    "personal" | "family" | "academic" | "distance" | "psychosocial" | "needs"
  >("personal")
  const [showMore, setShowMore] = useState(false)
  const [sectionClicked, setSectionClicked] = useState(false)
  const userName = useSupabaseUser()
  const email = useSupabaseEmail()
  const sectionLabels: Record<typeof activeSection, string> = {
    personal: "Personal",
    family: "Family",
    academic: "Academic",
    distance: "Distance Learning",
    psychosocial: "Psychosocial Wellbeing",
    needs: "Needs Assessment",
  }
  const [status, setStatus] = useState<CounselorStudentListItem | null>(null)

  useEffect(() => {
    getStudentProfileSummary().then((data) => {
      if (data) setSummary(data)
    })

    getStudentStatus().then((status) => {
      if (status) setStatus(status)
    })
  }, [])

  return (
    <div className="w-full max-w-5xl">
      {/* Header */}
      <div className="flex-cols-2 container mb-5 flex">
        <Image
          src="/dp.png"
          alt="profile"
          width={100}
          height={50}
          className="mr-5"
        />
        <div className="flex-col">
          <span className="mb-2 font-bold tracking-wide">
            {userName ?? <Skeleton className="mb-2 h-6 w-50" />}
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
            {activeSection === "family" && <FamilySection summary={summary} />}
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

      {/* Legend */}
      <div className="container mb-20 ml-20 flex w-[950px] flex-col">
        <span className="text-xs">
          Within your residency in MSU-IIT, you have to complete the following
          interviews required by the Office of Guidance and Counseling.
        </span>
        <div className="mt-2 ml-2 flex gap-6 text-[12px]">
          <div className="flex gap-3 font-semibold tracking-wide">
            Student Profiling:
            <StatusBadge value={"completed" as StatusType} />
          </div>
          <div className="flex gap-3 font-semibold tracking-wide">
            Counselor Initial Interview:
            <StatusBadge value={status?.initialInterview as StatusType} />
          </div>
          <div className="flex gap-3 font-semibold tracking-wide">
            Counseling
            <StatusBadge value={status?.counselingStatus as StatusType} />
          </div>
          <div className="flex gap-3 font-semibold tracking-wide">
            Exit Interview
            <StatusBadge value={status?.exitInterview as StatusType} />
          </div>
        </div>
      </div>
    </div>
  )
}
