"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PrimaryButton } from "@/components/primary-button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSupabaseEmail } from "@/hooks/use-supabase-email"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { getStudentProfileSummary, StudentRecord } from "@/lib/api/students"
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
import PersonalSection from "@/components/student-summary/personal-section"
import PersonalShowMoreSection from "@/components/student-summary/personal-showmore"
import SummarySkeleton from "@/components/student-summary/summary-skeleton"
import FamilySection from "@/components/student-summary/family-section"
import FamilyShowMoreSection from "@/components/student-summary/family-showmore"
import AcademicSection from "@/components/student-summary/academic-section"
import AcademicShowMoreSection from "@/components/student-summary/academic-showmore"
import DistanceSection from "@/components/student-summary/distance-section"
import PsychosocialSection from "@/components/student-summary/psychosocial-section"
import NeedsSection from "./needs-section"
import NeedsShowMoreSection from "./needs-showmore"
import PsychosocialShowMoreSection from "./psychosocial-showmore"

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

  useEffect(() => {
    getStudentProfileSummary().then((data) => {
      if (data) setSummary(data)
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
              className={`ml-10 h-10 w-10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${
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
        <div className="mt-2 ml-2 flex flex-row gap-10">
          <div className="flex flex-row">
            <div className="bg-link mr-3 h-3 w-3"></div>
            <span className="text-[10px]">
              STUDENT PROFILING AND NEEDS ASSESSMENT
            </span>
          </div>
          <div className="flex flex-row">
            <div className="bg-main mr-3 h-3 w-3"></div>
            <span className="text-[10px]">COUNSELOR INITIAL INTERVIEW</span>
          </div>
        </div>
        <div className="mt-4 ml-2 flex flex-row gap-10">
          <span className="text-[10px]">Legend:</span>
          <div className="flex flex-row items-center">
            <div className="bg-link mr-3 h-2.5 w-2.5"></div>
            <span className="text-[10px]">Done</span>
          </div>
          <div className="flex flex-row items-center">
            <div className="bg-main3 mr-3 h-2.5 w-2.5"></div>
            <span className="text-[10px]">Pending</span>
          </div>
          <div className="flex flex-row items-center">
            <div className="bg-main mr-3 h-2.5 w-2.5"></div>
            <span className="text-[10px]">Not Started</span>
          </div>
        </div>
      </div>
    </div>
  )
}
