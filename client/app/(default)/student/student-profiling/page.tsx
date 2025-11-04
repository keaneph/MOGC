"use client"

import EmptyProfile from "@/components/empty-profile"
import { InProgressProfile } from "@/components/inprogress-profile"
import { PrimaryButton } from "@/components/primary-button"
import { profileExists } from "@/lib/api/students"
import * as React from "react"

export default function StudentProfilingPage() {
  const [hasProfile, setHasProfile] = React.useState<boolean | null>(null) // null = checking, true/false = determined

  // check if profile exists on mount
  React.useEffect(() => {
    async function checkProfile() {
      const exists = await profileExists()
      setHasProfile(exists)
    }
    checkProfile()
  }, [])
  return (
    <div id="main-container" className="mt-12 flex w-full justify-center px-6">
      {/* main content container */}
      <div className="w-full max-w-5xl">
        <div className="flex justify-between">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Student Profile
          </div>
          <div>
            {!hasProfile && (
              <PrimaryButton
                content="Create Profile"
                onClick={() => setHasProfile(true)}
              />
            )}
          </div>
        </div>

        <div>
          {hasProfile === null ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : hasProfile ? (
            <div>
              <InProgressProfile />
            </div>
          ) : (
            <EmptyProfile />
          )}
        </div>
      </div>
    </div>
  )
}
