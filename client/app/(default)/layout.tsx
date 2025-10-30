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
