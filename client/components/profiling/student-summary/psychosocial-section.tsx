import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function PsychosocialSection({ summary }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex w-[920px] p-2">
        {summary.seeking_professional_help === true ? (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Seeking Professional Help
            </span>
            <span className="text-sm tracking-wide">Yes</span>
          </div>
        ) : (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Seeking Professional Help
            </span>
            <span className="text-sm tracking-wide">No</span>
          </div>
        )}
        {summary.had_counseling_before === true ? (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Had Counseling Before
            </span>
            <span className="text-sm tracking-wide">Yes</span>
          </div>
        ) : (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Had Counseling Before
            </span>
            <span className="text-sm tracking-wide">No</span>
          </div>
        )}
        {summary.needs_immediate_counseling === true ? (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Need Immediate Counseling
            </span>
            <span className="text-sm tracking-wide">Yes</span>
          </div>
        ) : (
          <div className="mb-5 flex w-[300px] flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Need Immediate Counseling
            </span>
            <span className="text-sm tracking-wide">No</span>
          </div>
        )}
      </div>
      {/*next row*/}
      <div className="flex w-[920px] p-2">
        {Array.isArray(summary.problem_sharers) &&
          summary.problem_sharers.length > 0 && (
            <div className="mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                To whom do you share your problems with
              </span>
              <ul className="list-disc pl-5 text-sm tracking-wide">
                {summary.problem_sharers
                  .filter((share) => share !== "Others")
                  .map((share, index) => (
                    <li key={index}>{share}</li>
                  ))}
                {summary.problem_sharers.includes("Others") &&
                  summary.problem_sharers_others && (
                    <li>{summary.problem_sharers_others}</li>
                  )}
              </ul>
            </div>
          )}
        <div className="mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Personality Characteristics
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.personality_characteristics}
          </span>
        </div>
      </div>
    </div>
  )
}
