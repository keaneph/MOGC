import { PrimaryButton } from "@/components/primary-button"
import {
  Empty,
  EmptyHeader,
  EmptyContent,
  EmptyTitle,
} from "@/components/ui/empty"
import sitting from "@/public/sitting.png"
import Image from "next/image"

interface EmptyProfileProps {
  onCreateProfile: () => void
}

export default function EmptyProfile({ onCreateProfile }: EmptyProfileProps) {
  return (
    <Empty className="rounded-sm border-1 !pb-0">
      <EmptyHeader>
        <EmptyTitle className="mt-6 text-3xl font-semibold tracking-wide">
          You don&apos;t have a profile yet
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent className="text-regular text-md text-main4 gap-8 tracking-wide">
        <div>
          Ready to level up your learning experience? This profile is your
          starter quest — each <br /> step unlocks a clearer picture of who you
          are and how we can support you best.
        </div>

        <PrimaryButton content="Create Profile" onClick={onCreateProfile} />
      </EmptyContent>
      <div className="">
        <Image
          src={sitting}
          alt="Sitting Siklab"
          className="relative top-7 h-auto w-50"
        />
      </div>
    </Empty>
  )
}
