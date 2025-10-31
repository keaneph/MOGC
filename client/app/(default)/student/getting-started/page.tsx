"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CatImage from "@/components/happy-toast"
import { CircleCheckIcon } from "lucide-react"
import Confetti from "@/components/confetti"

export default function GettingStartedPage() {
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
        router.replace("/student/getting-started")
      }, 300)
    }
  }, [hasHydrated, toastShown, router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Getting Started Placeholder</h1>
      <p className="text-muted-foreground mt-2">
        Welcome to the Getting Started page. Put your content here.
      </p>
      {showConfetti && <Confetti />}
    </div>
  )
}
