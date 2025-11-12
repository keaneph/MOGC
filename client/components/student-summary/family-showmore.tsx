import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function FamilyShowMoreSection({ summary }: Props) {
  return (
    <>
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-row">
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Parents' Marital Status
              </span>
              <span className="text-sm tracking-wide">
                {summary.parents_marital_status}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Family Income
              </span>
              <span className="text-sm tracking-wide">
                {summary.family_monthly_income}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Guardian Name
              </span>
              <span className="text-sm tracking-wide">
                {summary.guardian_name}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Guardian Occupation
              </span>
              <span className="text-sm tracking-wide">
                {summary.guardian_occupation}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Guardian Contact No.
              </span>
              <span className="text-sm tracking-wide">
                {summary.guardian_contact_number}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Relationship (Guardian)
              </span>
              <span className="text-sm tracking-wide">
                {summary.guardian_relationship}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Ordinal Position
              </span>
              <span className="text-sm tracking-wide">
                {summary.ordinal_position}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                No. of Siblings
              </span>
              <span className="text-sm tracking-wide">
                {summary.number_of_siblings}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Home Environment
              </span>
              <span className="text-sm tracking-wide">
                {summary.home_environment_description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
