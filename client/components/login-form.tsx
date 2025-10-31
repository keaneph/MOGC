"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "@/public/logo.png"
import { toast } from "sonner"
import { CircleCheckIcon } from "lucide-react"
import CatImageSad from "./sad-toast"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    const params = new URLSearchParams(window.location.search)
    const toastFlag = params.get("toast")

    if (toastFlag === "logout") {
      toast.success(
        <div className="relative flex w-full items-center pr-24">
          <span className="pl-2">Logged out successfully</span>
          <CatImageSad />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    }
  }, [hasHydrated])

  const handleMyIITLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: { prompt: "select_account" },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen" {...props}>
      <div
        className="hidden h-screen bg-cover bg-[position:38%_center] md:block md:w-1/2"
        style={{ backgroundImage: "url('/login-photo.png')" }}
      />

      <div className="flex w-full flex-col justify-center px-8 md:w-2/3">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Image src={logo} alt="MSU-IIT OGC" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-wide">
                MSU-IIT OGC
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-wide">
              Log in to your account
            </h2>
          </div>

          <div className="mt-8 w-full">
            <div className="mx-auto flex max-w-md items-center">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-main2 mx-2 max-w-xs text-center text-xs leading-snug tracking-wide">
                Access your counseling sessions, assessments, and guidance
                resources in one place.
              </span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
          </div>

          <div className="space-y-25">
            <form onSubmit={handleMyIITLogin}>
              {error && <p className="text-main text-sm">{error}</p>}
              <Button
                type="submit"
                variant="outline"
                className="bg-main hover:bg-main-dark w-full cursor-pointer rounded-sm tracking-wide text-white hover:text-white"
                disabled={isLoading}
              >
                <img
                  src="/google-icon.svg"
                  alt="Google icon"
                  width={18}
                  height={18}
                />
                {isLoading ? "Redirecting..." : "Continue with My.IIT"}
              </Button>
            </form>

            <div className="cursor-pointer text-center text-sm tracking-wide">
              <a href="#" className="text-link text-xs hover:underline">
                Go back to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
