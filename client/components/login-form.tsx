'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import logo from '@/public/logo.png'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMyIITLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { prompt: "select_account" },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen" {...props}>
      <div
        className="hidden md:block md:w-1/2 h-screen bg-cover bg-[position:38%_center]"
        style={{ backgroundImage: "url('/login-photo.png')" }}
      />

      <div className="flex w-full flex-col justify-center px-8 md:w-2/3">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Image
                src={logo}
                alt="MSU-IIT OGC"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold tracking-wide">MSU-IIT OGC</span>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-wide">Log in to your account</h2>
          </div>

          <div className="mt-8 w-full">
            <div className="mx-auto max-w-md flex items-center">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="mx-2 text-xs text-main2 text-center max-w-xs leading-snug tracking-wide">
                Access your counseling sessions, assessments, and guidance resources in one place.
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          </div>

          <div className="space-y-25">
            <form onSubmit={handleMyIITLogin}>
              {error && <p className="text-sm text-main">{error}</p>}
              <Button
                type="submit"
                variant="outline"
                className="w-full text-white bg-main hover:bg-main-dark rounded-sm tracking-wide cursor-pointer"
                disabled={isLoading}
              >
                <img
                    src="/google-icon.svg"
                    alt="Google icon"
                    className="!h-4.5 !w-4.5"
                  />
                {isLoading ? 'Redirecting...' : 'Continue with My.IIT'}
              </Button>
            </form>

        
          <div className="text-center text-sm tracking-wide cursor-pointer">
              <a href="#" className="text-link hover:underline text-xs">
                Go back to Homepage
              </a>
            </div>
            </div>
        </div>
      </div>
    </div>
  )
}