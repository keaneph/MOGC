import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Announcements } from "@/components/announcements"
import { AppSidebarCounselor } from "@/components/app-sidebar-cs"
import { AppHeader } from "@/components/app-header"
import { requireRole } from "@/lib/auth"

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("counselor")
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <>
      <AppHeader role="Counselor" />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebarCounselor />
        <div className="flex flex-1 flex-col">
          <Announcements />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SidebarProvider>
    </>
  )
}
