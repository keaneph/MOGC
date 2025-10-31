import type { Metadata } from "next"
import "@/styles/globals.css"
import { ToasterWrapper } from "@/components/ui/toaster-wrapper"

export const metadata: Metadata = {
  title: "MOGC",
  description: "MSU-IIT Office of the Guidance and Counseling",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToasterWrapper />
      </body>
    </html>
  )
}
