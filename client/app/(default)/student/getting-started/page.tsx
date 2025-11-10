"use client"

import { useState, useEffect } from "react"
import {
  MegaphoneIcon,
  MessagesSquareIcon,
  BookOpenCheckIcon,
  SpeechIcon,
  TelescopeIcon,
} from "lucide-react"
import Link from "next/link"
import { PrimaryButton } from "@/components/primary-button"
import { Button } from "@/components/ui/button"
import love from "@/public/love.png"
import Image from "next/image"
import { TooltipThis } from "@/components/tooltip-this"
import { SiklabSheet } from "@/components/siklab-sheet"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CatImage from "@/components/happy-toast"
import { CircleCheckIcon } from "lucide-react"
import Confetti from "@/components/confetti"
import { useNextStep } from "nextstepjs"
import { getOnboardingStatus } from "@/lib/api/students"

export default function GettingStartedPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [accordionValue, setAccordionValue] = useState("")
  const router = useRouter()
  const [hasHydrated, setHasHydrated] = useState(false)
  const [toastShown, setToastShown] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { startNextStep } = useNextStep()

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) return
    ;(async () => {
      try {
        const result = await getOnboardingStatus()
        console.log("Onboarding status result:", result)
        const { startTour } = result

        if (startTour) {
          console.log("Starting welcome tour")
          startNextStep("welcomeTour")
        } else {
          console.log("Onboarding completed, not starting tour")
        }
      } catch (error) {
        console.error("Error getting onboarding status:", error)
        startNextStep("welcomeTour")
      }
    })()
  }, [hasHydrated, startNextStep])

  useEffect(() => {
    if (!hasHydrated || toastShown) return

    const params = new URLSearchParams(window.location.search)
    const toastFlag = params.get("toast")
    console.log("Toast flag:", toastFlag)

    if (toastFlag === "success") {
      setTimeout(() => {
        toast.success(
          <div className="relative flex w-full items-center pr-24">
            <span className="pl-2">Logged in successfully</span>
            <CatImage />
          </div>,
          {
            duration: 3000,
            icon: <CircleCheckIcon className="size-4" />,
          }
        )

        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        setToastShown(true)
        router.replace("/student/getting-started")
      }, 300)
    }
  }, [hasHydrated, toastShown, router])

  return (
    <div id="main-container" className="mt-12 flex w-full justify-center px-6">
      {/* main content container */}
      <div className="w-full max-w-5xl">
        <div id="firstStepDIV">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Getting Started
          </div>

          <div className="mb-6 flex rounded-sm border p-3.5">
            <div className="mr-3 flex justify-center">
              <MegaphoneIcon
                className="mx-2 h-5 w-5"
                style={{ color: "var(--main)" }}
              />
            </div>
            <div className="text-sm font-medium tracking-wide">
              New to MSU-IIT? Check out our onboarding guide to get
              started.&nbsp;
              <TooltipThis label="Start the onboarding guide by Siklab!">
                <button
                  onClick={() => startNextStep("welcomeTour")}
                  className="text-link cursor-pointer decoration-2 underline-offset-4 hover:underline"
                >
                  Start the guide.
                </button>
              </TooltipThis>
            </div>
          </div>
        </div>

        <div id="secondStepDIV">
          <div className="mb-6 text-lg font-semibold tracking-wide">
            Start Profiling
          </div>
          <div className="mb-12 flex justify-center rounded-sm border pt-3 pl-3">
            <div className="mt-5 ml-6 h-auto w-full flex-col">
              <div className="mb-6 text-lg font-semibold tracking-wide">
                Start Filling up Personal Demographic Form
              </div>

              <div className="text-md mb-6 font-medium tracking-wide">
                Start filling up the personal demographic form <br />
                or interact with Siklab Guide to get started in minutes.
              </div>

              <div className="mb-6 text-sm font-medium tracking-wide">
                <TooltipThis label="Fill up your personal demographic form now!">
                  <Link href="/student/student-profiling">
                    <PrimaryButton content="Create Profile" />
                  </Link>
                </TooltipThis>
                <TooltipThis label="Learn more about personal demographic forms">
                  <button
                    onClick={() => {
                      setAccordionValue("item-1")
                      setSheetOpen(true)
                    }}
                    className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                  >
                    Learn more
                  </button>
                </TooltipThis>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <Image src={love} alt="Love" className="mr-8 h-auto w-55" />
            </div>
          </div>
        </div>

        <div className="mb-6 text-lg font-semibold tracking-wide">
          Next Steps
        </div>

        <div id="thirdStepDIV" className="grid grid-cols-2 gap-4">
          <div id="fourthStepDIV" className="flex rounded-sm border p-6">
            <div className="mr-4">
              <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                <MessagesSquareIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium tracking-wide">
                Counselor Interview
              </div>
              <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                Book an appointment with the guidance counselor of your
                department to finish initialization.
              </div>
              <div className="text-sm font-medium tracking-wide">
                <TooltipThis label="Proceed to book an appointment with your counselor">
                  <Link href="/student/counseling">
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-sm tracking-wide"
                    >
                      Go Next
                    </Button>
                  </Link>
                </TooltipThis>
                <TooltipThis label="Learn more about counselor interviews">
                  <button
                    onClick={() => {
                      setAccordionValue("item-2")
                      setSheetOpen(true)
                    }}
                    className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                  >
                    Learn more
                  </button>
                </TooltipThis>
              </div>
            </div>
          </div>

          <div id="fifthStepDIV" className="flex rounded-sm border p-6">
            <div className="mr-4">
              <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                <BookOpenCheckIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium tracking-wide">
                Initialization Tests
              </div>
              <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                Take the required tests to help us understand your needs better
                and provide appropriate support.
              </div>
              <div className="text-sm font-medium tracking-wide">
                <TooltipThis label="Proceed to take the initialization tests">
                  <Link href="/student/counseling">
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-sm tracking-wide"
                    >
                      Go Next
                    </Button>
                  </Link>
                </TooltipThis>
                <TooltipThis label="Learn more about initialization tests">
                  <button
                    onClick={() => {
                      setAccordionValue("item-3")
                      setSheetOpen(true)
                    }}
                    className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                  >
                    Learn more
                  </button>
                </TooltipThis>
              </div>
            </div>
          </div>

          <div id="sixthStepDIV" className="flex rounded-sm border p-6">
            <div className="mr-4">
              <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                <SpeechIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium tracking-wide">
                Counseling Sessions
              </div>
              <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                Schedule counseling sessions with your assigned counselor to
                discuss your concerns and goals.
              </div>
              <div className="text-sm font-medium tracking-wide">
                <TooltipThis label="Proceed to schedule counseling sessions">
                  <Link href="/student/counseling">
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-sm tracking-wide"
                    >
                      Go Next
                    </Button>
                  </Link>
                </TooltipThis>
                <TooltipThis label="Learn more about counseling sessions">
                  <button
                    onClick={() => {
                      setAccordionValue("item-4")
                      setSheetOpen(true)
                    }}
                    className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                  >
                    Learn more
                  </button>
                </TooltipThis>
              </div>
            </div>
          </div>

          <div id="seventhStepDIV" className="flex rounded-sm border p-6">
            <div className="mr-4">
              <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                <TelescopeIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium tracking-wide">
                Explore MOGC
              </div>
              <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                Explore the various features and resources available in the MOGC
                web application.
              </div>
              <div className="text-sm font-medium tracking-wide">
                <TooltipThis label="Proceed to explore the MOGC application">
                  <Link href="/documentation">
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-sm tracking-wide"
                    >
                      Go Next
                    </Button>
                  </Link>
                </TooltipThis>
                <TooltipThis label="Learn more about exploring MOGC">
                  <button
                    onClick={() => {
                      setAccordionValue("item-5")
                      setSheetOpen(true)
                    }}
                    className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                  >
                    Learn more
                  </button>
                </TooltipThis>
              </div>
            </div>
          </div>
        </div>
        <div className="h-5"></div>
      </div>
      {/* Siklab sheet (controlled) */}
      <SiklabSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        accordionValue={accordionValue}
        onAccordionValueChange={(v) => setAccordionValue(v as string)}
        showTrigger={false}
      />
      {showConfetti && <Confetti />}
    </div>
  )
}
