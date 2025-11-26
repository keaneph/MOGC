"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import StudentProfile from "@/components/data/student-list/student-profile/student-profile"
import { getCounselorStudentList } from "@/lib/api/counselors"
import { CounselorStudentListItem } from "@/components/data/student-list/columns"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipThis } from "@/components/feedback/tooltip-this"
import { Button } from "@/components/ui/button"
import { ArrowLeftToLineIcon } from "lucide-react"
import Link from "next/link"

export default function StudentProfilePage() {
  const params = useParams()
  const studentName = decodeURIComponent(params.name as string)
  const [student, setStudent] = useState<CounselorStudentListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      setError(null)
      try {
        const students: CounselorStudentListItem[] =
          await getCounselorStudentList()
        const found = students.find((s) => s.studentName === studentName)
        setStudent(found ?? null)
      } catch {
        setError("Failed to load student profile.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [studentName])

  if (loading) {
    return <Skeleton className="m-20 mr-20 h-100" />
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  if (!student) {
    return <p>No student found.</p>
  }

  return (
    <div>
      <Link href="/counselor/students">
        <TooltipThis label="Go Back to List">
          <Button
            variant="outline"
            className="mt-5 ml-10 cursor-pointer rounded-sm px-4 py-2 text-sm tracking-wide"
          >
            <ArrowLeftToLineIcon />
          </Button>
        </TooltipThis>
      </Link>

      <StudentProfile student={student} />
    </div>
  )
}
