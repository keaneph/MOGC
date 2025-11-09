"use client"

import React from "react"
import { Step } from "nextstepjs"
import WelcomeCard from "@/components/onboarding-cards/welcome-card"
import SecondStepCard from "@/components/onboarding-cards/second-step-card"
import FirstStepCard from "@/components/onboarding-cards/first-step-card"
import ThirdStepCard from "@/components/onboarding-cards/third-step-card"
import FourthStepCard from "@/components/onboarding-cards/fourth-step-card"
import FifthStepCard from "@/components/onboarding-cards/fifth-step-card"
import SixthStepCard from "@/components/onboarding-cards/sixth-step-card"
import SeventhStepCard from "@/components/onboarding-cards/seventh-step-card"
import ClosingCard from "@/components/onboarding-cards/closing-card"

interface OnboardingCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour?: () => void
  arrow: React.ReactNode
}

const OnboardingSelector = (props: OnboardingCardProps) => {
  const { currentStep } = props

  // Choose card by step index. Adjust mapping here when you add/remove steps.
  // Normalize props for card components that expect skipTour to be defined
  const safeProps = {
    ...props,
    skipTour: props.skipTour ?? (() => {}),
  }

  switch (currentStep) {
    case 0:
      return <WelcomeCard {...safeProps} />
    case 1:
      return <FirstStepCard {...safeProps} />
    case 2:
      return <SecondStepCard {...safeProps} />
    case 3:
      return <ThirdStepCard {...safeProps} />
    case 4:
      return <FourthStepCard {...safeProps} />
    case 5:
      return <FifthStepCard {...safeProps} />
    case 6:
      return <SixthStepCard {...safeProps} />
    case 7:
      return <SeventhStepCard {...safeProps} />
    case 8:
      return <ClosingCard {...safeProps} />
    default:
      // Fallback to WelcomeCard (safe default)
      return <WelcomeCard {...safeProps} />
  }
}

export default OnboardingSelector
