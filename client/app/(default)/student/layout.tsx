import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Announcements } from "@/components/announcements"
import { AppHeader } from "@/components/app-header"
import { requireRole } from "@/lib/auth"
import { NextStepViewport } from "nextstepjs"

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
