import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function NeedsShowMoreSection({ summary }: Props) {
  return (
    <>
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-col">
          <div className="flex w-[920px] p-2">
            <div className="flex flex-col">
              {Array.isArray(summary.personal_social_needs) &&
                summary.personal_social_needs.length > 0 && (
                  <div className="mb-5 flex w-[300px] flex-col">
                    <span className="text-main2 mb-2 text-[12px] tracking-wide">
                      Personal-Social Needs
                    </span>
                    <ul className="list-disc pl-5 text-sm tracking-wide">
                      {summary.personal_social_needs
                        .filter((needs) => needs !== "Others")
                        .map((needs, index) => (
                          <li key={index}>{needs}</li>
                        ))}
                      {summary.personal_social_needs.includes("Others") &&
                        summary.personal_social_needs_others && (
                          <li>{summary.personal_social_needs_others}</li>
                        )}
                    </ul>
                  </div>
                )}
              {Array.isArray(summary.primary_problem_sharer) &&
                summary.primary_problem_sharer.length > 0 && (
                  <div className="mb-5 flex w-[300px] flex-col">
                    <span className="text-main2 mb-2 text-[12px] tracking-wide">
                      I can discuss problems with
                    </span>
                    <ul className="mr-9 list-disc pl-5 text-sm tracking-wide break-words whitespace-pre-wrap">
                      {summary.primary_problem_sharer
                        .filter((response) => response !== "Others")
                        .map((response, index) => (
                          <li key={index}>{response}</li>
                        ))}
                      {summary.primary_problem_sharer.includes("Others") &&
                        summary.primary_problem_sharer_others && (
                          <li>{summary.primary_problem_sharer_others}</li>
                        )}
                    </ul>
                  </div>
                )}
            </div>
            {Array.isArray(summary.improvement_needs) &&
              summary.improvement_needs.length > 0 && (
                <div className="mb-5 flex w-[300px] flex-col">
                  <span className="text-main2 mb-2 text-[12px] tracking-wide">
                    Needs to improve
                  </span>
                  <ul className="list-disc pl-5 text-sm tracking-wide">
                    {summary.improvement_needs
                      .filter((improve) => improve !== "Others")
                      .map((improve, index) => (
                        <li key={index}>{improve}</li>
                      ))}
                    {summary.improvement_needs.includes("Others") &&
                      summary.improvement_needs_others && (
                        <li>{summary.improvement_needs_others}</li>
                      )}
                  </ul>
                </div>
              )}
            {Array.isArray(summary.upset_responses) &&
              summary.upset_responses.length > 0 && (
                <div className="mb-5 flex w-[300px] flex-col">
                  <span className="text-main2 mb-2 text-[12px] tracking-wide">
                    Response(s) when upset
                  </span>
                  <ul className="mr-9 list-disc pl-5 text-sm tracking-wide break-words whitespace-pre-wrap">
                    {summary.upset_responses
                      .filter((response) => response !== "Others")
                      .map((response, index) => (
                        <li key={index}>{response}</li>
                      ))}
                    {summary.upset_responses.includes("Others") &&
                      summary.upset_responses_others && (
                        <li>{summary.upset_responses_others}</li>
                      )}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
