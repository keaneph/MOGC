import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function PsychosocialShowMoreSection({ summary }: Props) {
  return (
    <>
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-col">
          <div className="flex w-[920px] p-2">
            <div className="flex- mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Dealing with bad day
              </span>
              <span className="mr-12 text-sm tracking-wide break-words whitespace-pre-wrap">
                {summary.coping_mechanism_bad_day}
              </span>
            </div>
            <div className="flex- mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Perceived Mental Health (present)
              </span>
              <span className="mr-12 text-sm tracking-wide break-words whitespace-pre-wrap">
                {summary.perceived_mental_health}
              </span>
            </div>
            <div className="mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Concerns to discuss
              </span>
              <span className="mr-12 text-sm tracking-wide break-words whitespace-pre-wrap">
                {summary.concerns_to_discuss}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
