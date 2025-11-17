import { cookies } from "next/headers"

import { Announcements } from "@/components/layouts/announcements"
import { AppHeader } from "@/components/layouts/app-header"
import { AppSidebar } from "@/components/layouts/app-sidebar"
import { AppSidebarCounselor } from "@/components/layouts/app-sidebar-cs"

import { SidebarProvider } from "@/components/ui/sidebar"

import { requireAnyRole } from "@/lib/auth"

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
