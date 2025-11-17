import { cookies } from "next/headers"

import { NextStepViewport } from "nextstepjs"

import { AppSidebar } from "@/components/layouts/app-sidebar"
import { Announcements } from "@/components/layouts/announcements"
import { AppHeader } from "@/components/layouts/app-header"

import { SidebarProvider } from "@/components/ui/sidebar"

import { requireRole } from "@/lib/auth"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("student")
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <>
      <AppHeader role="Student" />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={defaultOpen} className="h-full min-h-0">
          <AppSidebar />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Announcements />
            <main className="min-h-0 flex-1 overflow-y-auto">
              <NextStepViewport id="scrollable-viewport">
                {children}
              </NextStepViewport>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
