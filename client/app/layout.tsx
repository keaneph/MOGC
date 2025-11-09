import { ToasterWrapper } from "@/components/ui/toaster-wrapper"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { NextStepProvider, NextStep, Tour } from "nextstepjs"
import OnboardingSelector from "@/components/onboarding/OnboardingSelector"

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
        pointerRadius: 5,
      },
      {
        icon: "🛸",
        title: "Revisit this guide!",
        content: "",
        selector: "#firstStepDIV",
        side: "bottom",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🎂",
        title: "Declare your existence!",
        content: "",
        selector: "#secondStepDIV",
        side: "bottom",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🗺️",
        title: "The sea is calling!",
        content: "",
        selector: "#thirdStepDIV",
        side: "top",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "⚓",
        title: "O captain! My captain!",
        content: "",
        selector: "#fourthStepDIV",
        side: "top",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🎯",
        title: "Your first mates!",
        content: "",
        selector: "#fifthStepDIV",
        side: "top",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🧜",
        title: "Seek, and ye shall find!",
        content: "",
        selector: "#sixthStepDIV",
        side: "top",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🔭",
        title: "Explore MOGC!",
        content: "",
        selector: "#seventhStepDIV",
        side: "top",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "🐱",
        title: "Need more assistance?",
        content: "",
        pointerPadding: 5,
        pointerRadius: 5,
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
            cardComponent={OnboardingSelector}
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
