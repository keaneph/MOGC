import React from "react"
import { CounselorStudentListItem } from "../columns"

type Props = {
  student: CounselorStudentListItem
}

const StudentProfile: React.FC<Props> = ({ student }) => {
  return (
    <div id="main-container" className="mt-7 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            {student.studentName}&apos;s Profile
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
