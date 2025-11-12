import { requireAnyRole } from "@/lib/auth"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarCounselor } from "@/components/app-sidebar-cs"
import { Announcements } from "@/components/announcements"
import { cookies } from "next/headers"

export default async function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await requireAnyRole(["student", "counselor"])
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <>
      <AppHeader role={capitalizedRole} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={defaultOpen}>
          {role === "counselor" ? <AppSidebarCounselor /> : <AppSidebar />}
          <div className="flex flex-1 flex-col">
            <Announcements />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
