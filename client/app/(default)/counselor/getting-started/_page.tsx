import Link from "next/link"
import { FileQuestionMarkIcon } from "lucide-react"
import Image from "next/image"
import cats from "@/public/images/cats.png"
import { Button } from "@/components/ui/button"

export default function GettingStartedPage() {
  return (
    <div className="mt-10 mr-36 ml-36 tracking-wide">
      <div>
        <div className="mb-12 text-3xl font-semibold">Getting Started</div>
        <div className="flex items-center rounded-sm border-1 p-2.5">
          <div className="mr-2 flex items-center justify-center">
            <FileQuestionMarkIcon
              style={{ fontSize: "1.5rem", color: "var(--main)" }}
            />
          </div>
          <div className="text-sm font-medium">
            New to MSU-IIT? Check out our onboarding guide to get started.&nbsp;
            <Link
              href="/onboarding"
              className="underline"
              style={{ color: "var(--link)" }}
            >
              Start the guide.{" "}
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-6 mb-6 text-lg font-semibold">Start Profiling</div>
        <div className="flex rounded-sm border-1">
          <div className="mr-70 flex-col">
            <div className="pt-8 pl-10 text-lg font-semibold">
              Start filling up Personal Demographic Form
            </div>
            <div className="w-100 pt-5 pl-10 text-sm font-medium">
              Start filling up the personal demographic form or use one of our
              samples to get started in minutes.
            </div>
            <div className="flex items-center pt-5 pl-10">
              <div>
                <Button
                  variant="default"
                  className="rounded-sm"
                  style={{ backgroundColor: "var(--main)", color: "white" }}
                >
                  Create Profile
                </Button>
              </div>
              <div>
                <Link
                  href="/learn-more"
                  className="mt-4 pl-5 text-sm font-medium"
                  style={{ color: "var(--link)" }}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div>
            <Image src={cats} alt="MSU-IIT CATS Logo" className="h-50 w-70" />
          </div>
        </div>
        <div className="mt-6 mb-6 text-lg font-semibold">Next Steps</div>
      </div>
    </div>
  )
}
