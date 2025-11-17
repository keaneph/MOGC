"use client"

import { Step } from "nextstepjs"

import React from "react"

import {
  FirstStepCard,
  SecondStepCard,
  ThirdStepCard,
  FourthStepCard,
  FifthStepCard,
  SixthStepCard,
  SeventhStepCard,
  WelcomeCard,
  ClosingCard,
} from "@/components/onboarding/onboarding-cards"

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
