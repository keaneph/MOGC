"use client"

import { Skeleton } from "@/components/ui/skeleton"
import EmptyProfile from "@/components/empty-profile"
import { InProgressProfile } from "@/components/inprogress-profile"
import { PrimaryButton } from "@/components/primary-button"
import { profileExists } from "@/lib/api/students"
import * as React from "react"
import { isStudentProfileComplete } from "@/lib/api/students"
import StudentSummaryPage from "@/components/student-summary/student-summary"

export default function StudentProfilingPage() {
  const [profileStatus, setProfileStatus] = React.useState<
    "none" | "in-progress" | "complete" | null
  >(null)

  React.useEffect(() => {
    async function checkProfile() {
      const exists = await profileExists()
      if (!exists) {
        setProfileStatus("none")
        return
      }

      const complete = await isStudentProfileComplete()
      setProfileStatus(complete ? "complete" : "in-progress")
    }

    checkProfile()
  }, [])

  const handleCreateProfile = () => {
    setProfileStatus("in-progress")
  }

  return (
    <div id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Student Profile
          </div>
          <div>
            {profileStatus === "none" && (
              <PrimaryButton
                content="Create Profile"
                onClick={handleCreateProfile}
              />
            )}
            {profileStatus === "complete" && (
              <PrimaryButton
                content="Edit Profile"
                onClick={handleCreateProfile}
              />
            )}
          </div>
        </div>

        <div>
          {profileStatus === null ? (
            <Skeleton className="rounded-m h-[510px] w-full" />
          ) : profileStatus === "none" ? (
            <EmptyProfile onCreateProfile={handleCreateProfile} />
          ) : profileStatus === "in-progress" ? (
            <InProgressProfile />
          ) : (
            <StudentSummaryPage />
          )}
        </div>
      </div>
    </div>
  )
}
