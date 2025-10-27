import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Announcements } from "@/components/announcements";
import { AppSidebarCounselor } from "@/components/app-sidebar-cs";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect("/auth/login")
  }
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
        <AppHeader role="Counselor" /> 
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebarCounselor />
            <div className="flex flex-col flex-1">
                <Announcements />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    </>
    
  );
}
