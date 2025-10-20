import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Announcements } from "@/components/announcements";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";

export default async function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TooltipProvider>
      {/* Fixed header */}
      <AppHeader /> 
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={defaultOpen}>
          {/* Fixed sidebar offset by header height */}
          <AppSidebar />
          {/* Scrollable content */}
          <div className="flex flex-col flex-1">
            <Announcements />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
          </div>

        </SidebarProvider>
      </div>
      </TooltipProvider>
    </div>
  );
}
