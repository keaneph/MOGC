"use client"

import React from "react"
import { Step } from "nextstepjs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from "next/image"
import Pirate from "@/public/pirate.png"

interface CustomCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour?: () => void
  arrow: React.ReactNode
}

const FourthStepCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: CustomCardProps) => {
  return (
    <Card className="relative w-[350px] tracking-wide">
      <button
        onClick={skipTour}
        className="text-main2/70 hover:text-main2/100 absolute top-4 right-4 cursor-pointer"
        aria-label="Close"
      >
        <XIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 px-6 pt-4">
        <div className="text-xl font-bold">{step.title}</div>
        <div className="-mt-2 text-3xl">{step.icon}</div>
      </div>

      <div className="px-6">
        <div className="mb-8 space-y-3 text-sm">
          <div>Now the real journey begins!</div>
          <div>
            Schedule your first interview with your counselor and set sail
            toward success!
          </div>
        </div>

        <div className="-mb-2 flex flex-col gap-16">
          <div className="flex justify-center gap-4">
            <Button
              onClick={prevStep}
              className="bg-main hover:bg-main/90 w-[150px] cursor-pointer rounded-sm tracking-wide"
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              className="bg-main hover:bg-main/90 w-[150px] cursor-pointer rounded-sm tracking-wide"
            >
              Next
            </Button>
          </div>
          <div className="flex gap-45">
            <button
              onClick={skipTour}
              className="text-link w-[85px] cursor-pointer text-left text-sm decoration-2 underline-offset-4 hover:underline"
            >
              Skip tour
            </button>
            <div className="text-muted-foreground text-sm">
              {currentStep} / {totalSteps - 1}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-33 bottom-0 h-27 w-24 overflow-clip">
        <Image src={Pirate} alt="Siklab As A Pirate" />
      </div>
    </Card>
  )
}

export default FourthStepCard
