"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CatImage from "@/components/happy-toast"
import { CircleCheckIcon } from "lucide-react"
import Confetti from "@/components/confetti"
import {
  CalendarClockIcon,
  FileSpreadsheetIcon,
  HandHeartIcon,
  TelescopeIcon,
} from "lucide-react"
import Link from "next/link"
import { PrimaryButton } from "@/components/primary-button"
import { Button } from "@/components/ui/button"
import love from "@/public/love.png"
import Image from "next/image"
import { TooltipThis } from "@/components/tooltip-this"

export default function GettiingStartedPage() {
  const router = useRouter()
  const [hasHydrated, setHasHydrated] = useState(false)
  const [toastShown, setToastShown] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

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
        router.replace("/counselor/getting-started")
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

          <div id="secondStepDIV">
            <div className="mb-6 text-lg font-semibold tracking-wide">
              Start Scheduling
            </div>
            <div className="mb-12 flex justify-center rounded-sm border pt-3 pl-3">
              <div className="mt-5 ml-6 h-auto w-full flex-col">
                <div className="mb-6 text-lg font-semibold tracking-wide">
                  Check your availability and create your schedule!
                </div>

                <div className="text-md mb-6 font-medium tracking-wide">
                  To get started, check your availability to let students know
                  when you&apos;re available.
                </div>

                <div className="mb-6 text-sm font-medium tracking-wide">
                  <TooltipThis label="Check availability!">
                    <Link href="/counselor/availability">
                      <PrimaryButton content="Check Availability" />
                    </Link>
                  </TooltipThis>
                  <TooltipThis label="Learn more about availability">
                    <button
                      onClick={() => {}}
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
                  <CalendarClockIcon
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  Create Schedule
                </div>
                <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                  Create different types of events to manage your schedule
                  effectively.
                </div>
                <div className="text-sm font-medium tracking-wide">
                  <TooltipThis label="Proceed to create schedule">
                    <Link href="/counselor/scheduling">
                      <Button
                        variant="outline"
                        className="cursor-pointer rounded-sm tracking-wide"
                      >
                        Go Next
                      </Button>
                    </Link>
                  </TooltipThis>
                  <TooltipThis label="Learn more about creating schedules">
                    <button
                      onClick={() => {}}
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
                  <FileSpreadsheetIcon
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  View Students
                </div>
                <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                  View the list of students assigned to you for counseling,
                  including their profiles, counseling history, and progress.
                </div>
                <div className="text-sm font-medium tracking-wide">
                  <TooltipThis label="Proceed to view students">
                    <Link href="/counselor/students">
                      <Button
                        variant="outline"
                        className="cursor-pointer rounded-sm tracking-wide"
                      >
                        Go Next
                      </Button>
                    </Link>
                  </TooltipThis>
                  <TooltipThis label="Learn more about viewing students">
                    <button
                      onClick={() => {}}
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
                  <HandHeartIcon
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  View Meetings
                </div>
                <div className="font-regular text-main2 mb-4 text-sm tracking-wide">
                  View and manage your upcoming counseling sessions with
                  students.
                </div>
                <div className="text-sm font-medium tracking-wide">
                  <TooltipThis label="Proceed to view meetings">
                    <Link href="/counselor/meetings">
                      <Button
                        variant="outline"
                        className="cursor-pointer rounded-sm tracking-wide"
                      >
                        Go Next
                      </Button>
                    </Link>
                  </TooltipThis>
                  <TooltipThis label="Learn more about viewing counseling sessions">
                    <button
                      onClick={() => {}}
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
                  Explore the various features and resources available in the
                  MOGC web application.
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
                      onClick={() => {}}
                      className="text-link ml-4 cursor-pointer decoration-2 underline-offset-4 hover:underline"
                    >
                      Learn more
                    </button>
                  </TooltipThis>
                </div>
              </div>
            </div>
          </div>
          <div className="h-20"></div>
        </div>
        {showConfetti && <Confetti />}
      </div>
    </div>
  )
}
