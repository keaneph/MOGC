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
        icon: "⌛",
        title: "What's next?",
        content: "",
        selector: "#thirdStepDIV",
        side: "right",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "⌛",
        title: "O captain! My captain!",
        content: "",
        selector: "#fourthStepDIV",
        side: "right",
        pointerPadding: 5,
        pointerRadius: 5,
        viewportID: "scrollable-viewport",
      },
      {
        icon: "⌛",
        title: "Einstein IQ?!",
        content: "",
        selector: "#fifthStepDIV",
        side: "left",
        pointerPadding: 5,
        pointerRadius: 5,
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
