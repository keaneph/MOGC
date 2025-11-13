import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function PersonalShowMoreSection({ summary }: Props) {
  return (
    <>
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-row">
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Nickname
              </span>
              <span className="text-sm tracking-wide">{summary.nickname}</span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Age
              </span>
              <span className="text-sm tracking-wide">{summary.age}</span>
            </div>

            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Sex
              </span>
              <span className="text-sm tracking-wide">{summary.sex}</span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Citizenship
              </span>
              <span className="text-sm tracking-wide">
                {summary.citizenship}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Date of Birth
              </span>
              <span className="text-sm tracking-wide">
                {summary.date_of_birth}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Place of Birth
              </span>
              <span className="text-sm tracking-wide">
                {summary.place_of_birth}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Religious Affiliation
              </span>
              <span className="text-sm tracking-wide">
                {summary.religious_affiliation}
              </span>
            </div>
            {summary.civil_status === "Others" ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Civil Status (Other)
                </span>
                <span className="text-sm tracking-wide">
                  {summary.civil_status_others}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Civil Status
                </span>
                <span className="text-sm tracking-wide">
                  {summary.civil_status}
                </span>
              </div>
            )}
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                No. of Children
              </span>
              <span className="text-sm tracking-wide">
                {summary.number_of_children}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Address in Iligan
              </span>
              <span className="text-sm tracking-wide">
                {summary.address_iligan}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Contact Number
              </span>
              <span className="text-sm tracking-wide">
                {summary.contact_number}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Home Address
              </span>
              <span className="text-sm tracking-wide">
                {summary.home_address}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/*next container*/}
      <div className="container mb-5 ml-20 flex w-[950px] flex-wrap rounded-sm border p-5">
        <div className="flex flex-row">
          <div className="w-[315px] flex-col p-2">
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Stays With
              </span>
              <span className="text-sm tracking-wide">
                {summary.stays_with}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Working Student Status
              </span>
              <span className="text-sm tracking-wide">
                {summary.working_student_status}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Talent Skills
              </span>
              <span className="text-sm tracking-wide">
                {summary.talents_skills}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            {summary.medical_condition === "Existing" ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Medical Condition (Existing)
                </span>
                <span className="text-sm tracking-wide">
                  {summary.medical_condition_others}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Medical Condition
                </span>
                <span className="text-sm tracking-wide">None</span>
              </div>
            )}
            {summary.physical_disability === "Existing" ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Physical Disability
                </span>
                <span className="text-sm tracking-wide">
                  {summary.physical_disability_others}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Physical Disability
                </span>
                <span className="text-sm tracking-wide">None</span>
              </div>
            )}
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Leisure Activities
              </span>
              <span className="text-sm tracking-wide">
                {summary.leisure_activities}
              </span>
            </div>
          </div>
          {/*next column*/}
          <div className="w-[315px] flex-col p-2">
            {summary.physical_disability === "Existing" ? (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Physical Disability
                </span>
                <span className="text-sm tracking-wide">
                  {summary.physical_disability_others}
                </span>
              </div>
            ) : (
              <div className="mb-5 flex flex-col">
                <span className="text-main2 mb-2 text-[12px] tracking-wide">
                  Physical Disability
                </span>
                <span className="text-sm tracking-wide">None</span>
              </div>
            )}
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Gender Identity
              </span>
              <span className="text-sm tracking-wide">
                {summary.gender_identity}
              </span>
            </div>
            <div className="mb-5 flex flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Attraction
              </span>
              <span className="text-sm tracking-wide">
                {summary.attraction}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
