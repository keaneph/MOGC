import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function NeedsSection({ summary }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex w-[920px] p-2">
        {Array.isArray(summary.financial_assistance_needs) &&
          summary.financial_assistance_needs.length > 0 && (
            <div className="mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Financial Needs
              </span>
              <ul className="list-disc pl-5 text-sm tracking-wide">
                {summary.financial_assistance_needs
                  .filter((financial) => financial !== "Others")
                  .map((financial, index) => (
                    <li key={index}>{financial}</li>
                  ))}
                {summary.financial_assistance_needs.includes("Others") &&
                  summary.financial_assistance_needs_others && (
                    <li>{summary.financial_assistance_needs_others}</li>
                  )}
              </ul>
            </div>
          )}
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            I willfully came for counseling when I had a problem
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.experience_counseling_willfully}
          </span>
        </div>
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            I experience counseling upon referral
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.experience_counseling_referral}
          </span>
        </div>
      </div>
      {/*next row*/}
      <div className="flex w-[920px] p-2">
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            I know that help is available at OGC
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.know_guidance_center_help}
          </span>
        </div>
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            I am afraid to go to the OGC
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.afraid_of_guidance_center}
          </span>
        </div>
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            I am shy to ask assistance/seek counseling from my guidance
            counselor
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.shy_to_ask_counselor}
          </span>
        </div>
      </div>
    </div>
  )
}
