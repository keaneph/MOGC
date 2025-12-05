"use client"

import React, { useState } from "react"

import { PrimaryButton } from "@/components/common/primary-button"

import EmptyProfile from "@/components/profiling/empty-profile"
import { InProgressProfile } from "@/components/profiling/inprogress-profile"
import StudentSummaryPage from "@/components/profiling/student-summary/student-summary"

import { Skeleton } from "@/components/ui/skeleton"

import { profileExists, isStudentProfileComplete } from "@/lib/api/students"

export default function StudentProfilingPage() {
  const [profileStatus, setProfileStatus] = useState<
    "none" | "in-progress" | "complete" | null
  >(null)
  const [isEditing, setIsEditing] = useState(false)

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
    setIsEditing(false)
    setProfileStatus("in-progress")
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setProfileStatus("complete")
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
            {profileStatus === "complete" && !isEditing && (
              <PrimaryButton
                content="Edit Profile"
                onClick={handleEditProfile}
              />
            )}
          </div>
        </div>

        <div>
          {profileStatus === null ? (
            <Skeleton className="h-[510px] w-full rounded-md" />
          ) : profileStatus === "none" ? (
            <EmptyProfile onCreateProfile={handleCreateProfile} />
          ) : profileStatus === "in-progress" ? (
            <InProgressProfile />
          ) : profileStatus === "complete" && isEditing ? (
            <InProgressProfile
              isEditing
              onBackToSummary={() => setIsEditing(false)}
            />
          ) : (
            <StudentSummaryPage />
          )}
        </div>
      </div>
    </div>
  )
}
