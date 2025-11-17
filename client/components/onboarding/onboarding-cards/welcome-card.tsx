"use client"

import { XIcon } from "lucide-react"

import Image from "next/image"

import { Step } from "nextstepjs"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import Happy from "@/public/happy.png"

interface CustomCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour?: () => void
  arrow: React.ReactNode
}

const WelcomeCard = ({ step, nextStep, skipTour }: CustomCardProps) => {
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
          <div>
            I&apos;m <strong style={{ color: "var(--main)" }}>Siklab</strong>,
            your paw-some guide!
          </div>
          <div>
            I&apos;ll walk you through how to navigate the app and show you
            where everything is.
          </div>
          <p>Ready to get started?</p>
        </div>

        <div className="-mb-2 flex flex-col gap-12">
          <Button
            onClick={nextStep}
            className="bg-main hover:bg-main/90 w-[150px] cursor-pointer rounded-sm tracking-wide"
          >
            Let&apos;s go!
          </Button>
          <button
            onClick={skipTour}
            className="text-link w-[85px] cursor-pointer text-left text-sm decoration-2 underline-offset-4 hover:underline"
          >
            Maybe later
          </button>
        </div>
      </div>

      <div className="absolute right-5 bottom-0 h-36 w-32 overflow-clip">
        <Image src={Happy} alt="Siklab Welcomes You" />
      </div>
    </Card>
  )
}

export default WelcomeCard
