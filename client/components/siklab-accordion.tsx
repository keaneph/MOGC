import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CircleCheckBigIcon } from "lucide-react"
import { PrimaryButton } from "./primary-button"

type SiklabAccordionProps = {
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

export function SiklabAccordion({
  value,
  onValueChange,
}: SiklabAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      value={value as string | undefined}
      onValueChange={onValueChange}
      className="w-full tracking-wide"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main h-5 w-5" />
            Fill up personal information
          </div>
        </AccordionTrigger>
        <AccordionContent className="font-regular flex flex-col gap-4 pl-2 text-balance">
          <p>
            Provide your personal and academic information. Accurate information
            ensures your counselor can tailor sessions to your needs.
          </p>
          <p>
            Once completed, proceed to the next step for your initial interview.
          </p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main h-5 w-5" />
            Interview with counselor
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pl-2 text-balance">
          <p>
            After submitting your details, you&apos;ll be scheduled for an
            initial interview with your assigned counselor.
          </p>
          <p>
            This short session helps the counselor understand your background,
            interests, and current goals.
          </p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main/35 h-5 w-5" />
            Interpret initialization tests
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pl-2 text-balance">
          <p>
            Once your initial tests are completed, your counselor will review
            and interpret your results. You’ll receive insights into your
            learning style, career preferences, and key areas to develop.
          </p>
          <p>Use this information to plan your next steps effectively.</p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main/35 h-5 w-5" />
            Book a counseling session
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pl-2 text-balance">
          <p>
            You can now book counseling sessions through the MOGC portal. Choose
            your preferred date, and time.
          </p>
          <p>
            Once your session is booked, you’ll receive a confirmation with the
            details.
          </p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main/35 h-5 w-5" />
            Check out calendar of events
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pl-2 text-balance">
          <p>
            Explore the Siklab calendar to stay informed about upcoming events
            and workshops. These include wellness sessions, academic success
            programs, and career guidance seminars.
          </p>
          <p>Stay tuned for more updates!</p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger className="cursor-pointer pl-2">
          <div className="flex items-center gap-4">
            <CircleCheckBigIcon className="text-main/35 h-5 w-5" />
            Customize settings
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pl-2 text-balance">
          <p>
            Personalize your Siklab experience by managing your account
            settings. Adjust notifications, theme preferences, and privacy
            options.
          </p>
          <p>Your data remains confidential and secure at all times.</p>
          <div className="w-auto">
            <PrimaryButton content="Guide me" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
