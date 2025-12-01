import { CounselorStudentListItem } from "../columns"
import StatusBadge, { StatusType } from "../status-badge"

type Props = {
  student: CounselorStudentListItem
}

const StudentNotes: React.FC<Props> = ({ student }) => {
  return (
    <div id="main-container" className="mt-7 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between">
          <div className="mb-10 text-3xl font-semibold tracking-wide">
            Notes
          </div>
        </div>
        <div className="mb-2 flex w-full justify-center gap-4 text-sm tracking-wide">
          <div>
            Name: <strong>{student.studentName}</strong>
          </div>
          <div>
            ID Number: <strong>{student.idNumber}</strong>
          </div>
          <div>
            Course: <strong>{student.course}</strong>
          </div>
          <div>
            Assessment:{" "}
            <StatusBadge
              value={student.assessment as StatusType}
            ></StatusBadge>{" "}
          </div>
          <div>
            Counseling Status:{" "}
            <StatusBadge
              value={student.counselingStatus as StatusType}
            ></StatusBadge>
          </div>
        </div>
        <div className="container !h-150 !w-full rounded-sm border-2 p-5"></div>
      </div>
    </div>
  )
}

export default StudentNotes
