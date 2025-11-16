"use client"

import React, { useCallback } from "react"
import { Step } from "nextstepjs"
import OnboardingSelector from "@/components/onboarding/OnboardingSelector"
import { createClient } from "@/lib/client"

interface OnboardingProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour?: () => void
  arrow: React.ReactNode
}

export default function OnboardingWithPersistence(props: OnboardingProps) {
  const { skipTour: originalSkip } = props

  const persistAndSkip = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id)
          .select()

        if (error) {
          console.error("Failed to persist onboarding completion:", error)
        } else {
          console.log(
            "Successfully updated onboarding_completed to true:",
            data
          )
        }
      }
    } catch (err) {
      console.error("Failed to persist onboarding completion", err)
    } finally {
      if (originalSkip) {
        originalSkip()
      }
    }
  }, [originalSkip])

  const safeProps: OnboardingProps = {
    ...props,
    skipTour: persistAndSkip,
  }

  return <OnboardingSelector {...safeProps} />
}
