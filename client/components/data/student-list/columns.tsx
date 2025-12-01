"use client"

import { CircleUserRoundIcon, EllipsisIcon, NotepadText } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  updateStudentAssessment,
  updateStudentCounseling,
  updateStudentInterview,
} from "@/lib/api/counselors"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import StatusBadge, { StatusType } from "./status-badge"

export type CounselorStudentListItem = {
  idNumber: string
  studentName: string
  course: string
  yearLevel: string
  assessment: "pending" | "high risk" | "low risk"
  initialInterview: "pending" | "scheduled" | "rescheduled" | "done"
  counselingStatus: "no record" | "ongoing" | "closed"
}

export const columns = (
  setStudents: React.Dispatch<React.SetStateAction<CounselorStudentListItem[]>>
): ColumnDef<CounselorStudentListItem>[] => [
  {
    accessorKey: "idNumber",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        ID Number
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 85,
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Student Name
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 190,
  },
  {
    accessorKey: "course",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Course
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 150,
  },
  {
    accessorKey: "yearLevel",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Year Level
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 80,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "assessment",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Assessment
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 100,
    cell: ({ row, getValue }) => {
      const value = getValue<string>() || "pending"
      const id = row.original.idNumber

      const handleChange = async (newValue: string) => {
        const casted = newValue as "pending" | "high risk" | "low risk"
        setStudents((prev) =>
          prev.map((student) =>
            student.idNumber === id
              ? { ...student, assessment: casted }
              : student
          )
        )
        updateStudentAssessment(id, casted).catch((err) =>
          console.error("Failed to update assessment:", err)
        )
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="!h-[20px] cursor-pointer !border-none p-1 text-center text-[10px] leading-none [&>svg]:hidden">
              <StatusBadge value={value as StatusType} />
            </SelectTrigger>
            <SelectContent className="!w-[100px] rounded-lg text-[10px]">
              {["pending", "high risk", "low risk"].map((option) => (
                <SelectItem key={option} value={option}>
                  <StatusBadge value={option as StatusType} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
  },
  {
    accessorKey: "initialInterview",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Initial Interview
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 104,
    cell: ({ row, getValue }) => {
      const value = (getValue() as string) || "pending"
      const id = row.original.idNumber

      const handleChange = async (newValue: string) => {
        const casted = newValue as
          | "pending"
          | "scheduled"
          | "rescheduled"
          | "done"
        setStudents((prev) =>
          prev.map((student) =>
            student.idNumber === id
              ? { ...student, initialInterview: casted }
              : student
          )
        )
        updateStudentInterview(id, casted).catch((err) =>
          console.error("Failed to update interview:", err)
        )
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="!h-[20px] cursor-pointer !border-none p-1 text-center text-[10px] leading-none [&>svg]:hidden">
              <StatusBadge value={value as StatusType} />
            </SelectTrigger>
            <SelectContent className="!w-[140px] rounded-lg text-[10px]">
              {["pending", "scheduled", "rescheduled", "done"].map((option) => (
                <SelectItem key={option} value={option}>
                  <StatusBadge value={option as StatusType} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
  },
  {
    accessorKey: "counselingStatus",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Counseling Status
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 120,
    cell: ({ row, getValue }) => {
      const value = (getValue() as string) || "no record"
      const id = row.original.idNumber

      const handleChange = async (newValue: string) => {
        const casted = newValue as "no record" | "ongoing" | "closed"
        setStudents((prev) =>
          prev.map((student) =>
            student.idNumber === id
              ? { ...student, counselingStatus: casted }
              : student
          )
        )
        updateStudentCounseling(id, casted).catch((err) =>
          console.error("Failed to update status:", err)
        )
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="!h-[20px] cursor-pointer !border-none p-1 text-center text-[10px] leading-none [&>svg]:hidden">
              <StatusBadge value={value as StatusType} />
            </SelectTrigger>
            <SelectContent className="!w-[100px] rounded-lg text-[10px]">
              {["no record", "ongoing", "closed"].map((option) => (
                <SelectItem key={option} value={option}>
                  <StatusBadge value={option as StatusType} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 75,
    cell: ({ row }) => {
      const studentName = row.original.studentName
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-5 w-8 cursor-pointer p-0">
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link
                href={`/counselor/students/${encodeURIComponent(studentName)}/profile`}
              >
                <Button
                  variant="ghost"
                  className="flex w-full cursor-pointer justify-between text-xs"
                >
                  View Profile
                  <CircleUserRoundIcon className="text-main2 ml-2 h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenuSeparator className="mr-2 ml-2" />
              <Link
                href={`/counselor/students/${encodeURIComponent(studentName)}/notes`}
              >
                <Button
                  variant="ghost"
                  className="flex w-full cursor-pointer justify-between text-xs"
                >
                  Add Note
                  <NotepadText className="text-main2 ml-2 h-4 w-4" />
                </Button>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
