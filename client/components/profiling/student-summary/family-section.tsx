import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function FamilySection({ summary }: Props) {
  return (
    <>
      <div className="flex flex-row">
        <div className="w-[315px] flex-col p-2">
          {summary.father_deceased === true ? (
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Father Name
              </span>
              <span className="text-sm tracking-wide">
                {summary.father_name} (Deceased)
              </span>
            </div>
          ) : (
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Father Name
              </span>
              <span className="text-sm tracking-wide">
                {summary.father_name}
              </span>
            </div>
          )}

          {summary.mother_deceased === true ? (
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Mother Name
              </span>
              <span className="text-sm tracking-wide">
                {summary.mother_name} (Deceased)
              </span>
            </div>
          ) : (
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Mother Name
              </span>
              <span className="text-sm tracking-wide">
                {summary.mother_name}
              </span>
            </div>
          )}
        </div>
        <div className="w-[315px] flex-col p-2">
          <div className="mb-5 flex flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Father Occupation
            </span>
            <span className="text-sm tracking-wide">
              {summary.father_occupation}
            </span>
          </div>
          <div className="mb-5 flex flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Mother Occupation
            </span>
            <span className="text-sm tracking-wide">
              {summary.mother_occupation}
            </span>
          </div>
        </div>
        <div className="w-[315px] flex-col p-2">
          <div className="mb-5 flex flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Father Contact No.
            </span>
            <span className="text-sm tracking-wide">
              {summary.father_contact_number}
            </span>
          </div>
          <div className="mb-5 flex flex-col">
            <span className="text-main2 mb-2 text-[12px] tracking-wide">
              Mother Contact No.
            </span>
            <span className="text-sm tracking-wide">
              {summary.mother_contact_number}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
