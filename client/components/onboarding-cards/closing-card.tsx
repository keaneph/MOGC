"use client"

import { useState } from "react"
import React from "react"
import { Step } from "nextstepjs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from "next/image"
import Salute from "@/public/salute.png"
import Confetti3 from "@/components/confetti3"

interface CustomCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour?: () => void
  arrow: React.ReactNode
}

const ClosingCard = ({ step, prevStep, skipTour }: CustomCardProps) => {
  const [showConfetti, setShowConfetti] = useState(false)
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
            You can always find me through the {""}
            <strong style={{ color: "var(--main)" }}>Siklab Guide</strong> at
            the bottom-right corner of your screen.
          </div>
          <p>Good luck, and enjoy the journey!</p>
        </div>

        <div className="-mb-2 flex flex-col gap-12">
          <Button
            onClick={() => {
              if (skipTour) skipTour()
              setShowConfetti(true)
              setTimeout(() => setShowConfetti(false), 10000)
            }}
            className="bg-main hover:bg-main/90 w-[150px] cursor-pointer rounded-sm tracking-wide"
          >
            See you around!
          </Button>
          <button
            onClick={prevStep}
            className="text-link w-[85px] cursor-pointer text-left text-sm decoration-2 underline-offset-4 hover:underline"
          >
            Back
          </button>
        </div>
      </div>

      <div className="absolute right-5 bottom-0 h-36 w-32 overflow-clip">
        <Image src={Salute} alt="Siklab Salutes You" />
      </div>
      {showConfetti && <Confetti3 />}
    </Card>
  )
}

export default ClosingCard
