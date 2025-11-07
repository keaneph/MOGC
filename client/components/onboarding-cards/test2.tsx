"use client"

import React from "react"
import { Step } from "nextstepjs"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ShadcnCustomCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  arrow: React.ReactNode
}

const WelcomeCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: ShadcnCustomCardProps) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step.title}
          {step.icon && <span>{step.icon}</span>}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-2">{step.content}</div>
        {arrow}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-muted-foreground text-sm">
          {currentStep + 1} / {totalSteps}
        </div>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" size="sm" onClick={prevStep}>
              Previous
            </Button>
          )}

          <Button size="sm" onClick={nextStep}>
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </Button>

          {step.showSkip && (
            <Button variant="ghost" size="sm" onClick={skipTour}>
              Skip
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default WelcomeCard
