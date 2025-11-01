import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Announcements } from "@/components/announcements"
import { AppHeader } from "@/components/app-header"
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
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <Announcements />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
