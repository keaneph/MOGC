import Link from "next/link"
import { MessageSquareWarningIcon } from "lucide-react"
import { TooltipThis } from "./tooltip-this"
import { ContactDrawer } from "./drawer"
import { PrimaryButton } from "./primary-button"

export function Announcements() {
  return (
    <div className="flex h-24 items-center justify-between gap-4 border-b px-12">
      {/* icon section */}
      <div className="mr-2 flex-shrink-0">
        <MessageSquareWarningIcon className="text-main3 h-5.5 w-5.5" />
      </div>

      {/* text section */}
      <div className="text-center text-[13px] leading-relaxed font-medium tracking-wide md:text-left">
        Thank you for testing the Office of the Guidance and Counseling web
        application! This is a work in progress and you can&nbsp;
        <TooltipThis label="See what features are coming next!">
          <Link
            href="/documentation"
            className="text-link decoration-2 underline-offset-4 hover:underline"
          >
            view the roadmap here.
          </Link>
        </TooltipThis>
        &nbsp;Like what you&#39;re seeing?&nbsp;
        <TooltipThis label="See all features implemented so far!">
          <Link
            href="/features"
            className="text-link decoration-2 underline-offset-4 hover:underline"
          >
            View the full features here.
          </Link>
        </TooltipThis>
      </div>

      {/* button section */}
      <div>
        <TooltipThis label="Report any bugs you encounter!">
          <div>
            <ContactDrawer trigger={<PrimaryButton content="Report bugs" />} />
          </div>
        </TooltipThis>
      </div>
    </div>
  )
}
