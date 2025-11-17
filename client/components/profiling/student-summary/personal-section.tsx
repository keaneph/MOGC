import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function PersonalSection({ summary }: Props) {
  return (
    <div className="flex flex-row">
      <div className="w-[315px] flex-col p-2">
        <div className="mb-5 flex flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Course
          </span>
          <span className="text-sm tracking-wide">{summary.course}</span>
        </div>
        <div className="mb-5 flex flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            SASE Score
          </span>
          <span className="text-sm tracking-wide">
            {summary.msu_sase_score}
          </span>
        </div>
      </div>
      <div className="w-[315px] flex-col p-2">
        <div className="mb-5 flex flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Name
          </span>
          <span className="text-sm tracking-wide">
            {summary.given_name} {summary.middle_initial}. {summary.family_name}
          </span>
        </div>
        <div className="mb-5 flex flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Academic Year
          </span>
          <span className="text-sm tracking-wide">{summary.academic_year}</span>
        </div>
      </div>
      <div className="w-[315px] flex-col p-2">
        <div className="mb-5 flex flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Student Status
          </span>
          <span className="text-sm tracking-wide">
            {summary.student_status}
          </span>
        </div>
      </div>
    </div>
  )
}
