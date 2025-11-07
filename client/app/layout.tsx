import { ToasterWrapper } from "@/components/ui/toaster-wrapper"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { NextStepProvider, NextStep, Tour } from "nextstepjs"
import WelcomeCard from "@/components/onboarding-cards/welcome-card"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MOGC",
  description: "MSU-IIT Office of the Guidance and Counseling",
}

const steps: Tour[] = [
  {
    tour: "welcomeTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome to MOGC!",
        content: "",
        pointerRadius: 12,
      },
      {
        icon: "🚀",
        title: "Revisit this guide!",
        content: "",
        selector: "#secondStepDIV",
        side: "bottom",
        pointerPadding: 12,
        pointerRadius: 12,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "👋",
        title: "third test!",
        content: "",
        selector: "#thirdStepDIV",
        side: "bottom",
        pointerPadding: 12,
        pointerRadius: 12,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "👋",
        title: "fourth test!",
        content: "",
        selector: "#fourthStepDIV",
        side: "right",
        pointerPadding: 8,
        pointerRadius: 8,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "👋",
        title: "fifth test!",
        content: "",
        selector: "#fifthStepDIV",
        side: "left",
        pointerPadding: 8,
        pointerRadius: 8,
        viewportID: "scrollable-viewport",
      },
    ],
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <NextStepProvider>
          <NextStep
            steps={steps}
            cardComponent={WelcomeCard}
            clickThroughOverlay={false}
          >
            {children}
          </NextStep>
        </NextStepProvider>
        <ToasterWrapper />
      </body>
    </html>
  )
}
