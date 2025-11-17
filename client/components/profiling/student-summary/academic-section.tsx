import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function AcademicSection({ summary }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex w-[920px] p-2">
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            SHS GPA
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.shs_gpa}
          </span>
        </div>
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Previous School Name
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.previous_school_name}
          </span>
        </div>
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Previous School Address
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.previous_school_address}
          </span>
        </div>
      </div>
      {/*next row*/}
      <div className="flex w-[920px] p-2">
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            SHS Track
          </span>
          <span className="text-sm tracking-wide">{summary.shs_track}</span>
        </div>
        <div className="mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            SHS Strand
          </span>
          <span className="text-sm tracking-wide">{summary.shs_strand}</span>
        </div>
      </div>
    </div>
  )
}
