import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Announcements } from "@/components/announcements"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { SiklabSheet } from "@/components/siklab-sheet"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

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
