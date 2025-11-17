import { redirect } from "next/navigation"

import { TooltipProvider } from "@radix-ui/react-tooltip"

import { SiklabSheet } from "@/components/layouts/sheet"

import { createClient } from "@/lib/server"

export default async function WithSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <TooltipProvider>
          {children}
          <div className="fixed right-3 bottom-3 z-50">
            <SiklabSheet />
          </div>
        </TooltipProvider>
      </div>
    </>
  )
}
