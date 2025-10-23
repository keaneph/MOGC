import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Announcements } from "@/components/announcements";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SiklabSheet } from "@/components/siklab-sheet";

export default function WithSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TooltipProvider>
        {children}
        <div className="fixed bottom-3 right-3 z-50">
          <SiklabSheet />
        </div>
      </TooltipProvider>
    </div>
  );
}
