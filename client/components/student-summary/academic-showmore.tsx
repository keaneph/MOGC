import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function AcademicShowMoreSection({ summary }: Props) {
  return (
    <>
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-row">
          <div className="w-[315px] flex-col p-2">
            {summary.is_scholar === true ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Scholarship
                </span>
                <span className="text-sm tracking-wide">
                  {summary.scholarship_type}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Scholar
                </span>
                <span className="text-sm tracking-wide">
                  {summary.is_scholar}
                </span>
              </div>
            )}
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Awards/Honors
              </span>
              <span className="text-sm tracking-wide">
                {summary.awards_honors}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Student Organizations
              </span>
              <span className="text-sm tracking-wide">
                {summary.student_organizations}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Co-Curricular Activities
              </span>
              <span className="text-sm tracking-wide">
                {summary.cocurricular_activities}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Career Option 1
              </span>
              <span className="text-sm tracking-wide">
                {summary.career_option_1}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Career Option 2
              </span>
              <span className="text-sm tracking-wide">
                {summary.career_option_2}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Career Option 3
              </span>
              <span className="text-sm tracking-wide">
                {summary.career_option_3}
              </span>
            </div>
            {summary.course_choice_actor === "Others" ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Career was chosen by
                </span>
                <span className="text-sm tracking-wide">
                  {summary.course_choice_actor_others}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Career was chosen by
                </span>
                <span className="text-sm tracking-wide">
                  {summary.course_choice_actor}
                </span>
              </div>
            )}
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Reason for chosen career
              </span>
              <span className="text-sm tracking-wide">
                {summary.course_choice_reason}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Career Path after College
              </span>
              <span className="text-sm tracking-wide">
                {summary.post_college_career_goal}
              </span>
            </div>
            {Array.isArray(summary.reasons_for_choosing_msuiit) &&
              summary.reasons_for_choosing_msuiit.length > 0 && (
                <div className="mb-5 flex flex-col">
                  <span className="text-main2 mb-2 text-[12px] tracking-wide">
                    Reason for choosing IIT
                  </span>
                  <ul className="list-disc pl-5 text-[12px] tracking-wide">
                    {summary.reasons_for_choosing_msuiit
                      .filter((reason) => reason !== "Others")
                      .map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    {summary.reasons_for_choosing_msuiit.includes("Others") &&
                      summary.reasons_for_choosing_msuiit_others && (
                        <li>{summary.reasons_for_choosing_msuiit_others}</li>
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
