"use client"

import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, NotepadText } from "lucide-react"

export type CounselorStudentListItem = {
  idNumber: string
  studentName: string
  course: string
  yearLevel: string
  assessment: "pending" | "high risk" | "low risk"
  initialInterview: "pending" | "scheduled" | "rescheduled" | "done"
  counselingStatus: "no record" | "ongoing" | "closed"
}

export const columns: ColumnDef<CounselorStudentListItem>[] = [
  {
    accessorKey: "idNumber",
    header: "ID Number",
    size: 85,
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
    size: 190,
  },
  {
    accessorKey: "course",
    header: "Course",
    size: 150,
  },
  {
    accessorKey: "yearLevel",
    header: "Year Level",
    size: 80,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "assessment",
    header: "Assessment",
    size: 100,
    cell: ({ getValue }) => {
      const value = getValue<string>()
      const formattedValue = value.toUpperCase()
      const bgColor =
        value === "high risk"
          ? "bg-[var(--status-red)]"
          : value === "low risk"
            ? "bg-[var(--status-green)]"
            : "bg-[var(--status-yellow)]"

      const textColor =
        value === "high risk" || value === "low risk"
          ? "text-white"
          : "text-main2"

      return (
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-center text-[10px] font-medium ${bgColor} ${textColor}`}
          >
            {formattedValue}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "initialInterview",
    header: "Initial Interview",
    size: 104,
    cell: ({ getValue }) => {
      const value = getValue() as string
      const formattedValue = value.toUpperCase()
      const bgColor =
        value === "done"
          ? "bg-[var(--status-green)]"
          : value === "scheduled"
            ? "bg-[var(--status-peach)]"
            : value === "rescheduled"
              ? "bg-[var(--status-blue)]"
              : "bg-[var(--status-yellow)]"
      const textColor =
        value === "done" || value === "scheduled" || value === "rescheduled"
          ? "text-white"
          : "text-main2"

      return (
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-center text-[10px] font-medium ${bgColor} ${textColor}`}
          >
            {formattedValue}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "counselingStatus",
    header: "Counseling Status",
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue() as string
      const formattedValue = value.toUpperCase()
      const bgColor =
        value === "ongoing"
          ? "bg-[var(--status-blue)]"
          : value === "closed"
            ? "bg-[var(--status-green)]"
            : "bg-[var(--status-yellow)]"
      const textColor =
        value === "ongoing" || value === "closed" ? "text-white" : "text-main2"

      return (
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-center text-[10px] font-medium ${bgColor} ${textColor}`}
          >
            {formattedValue}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 75,
    cell: ({}) => {
      return (
        <div className="flex-cols-2 flex justify-center">
          <EyeIcon className="text-main2 hover:text-main h-4 w-4 cursor-pointer" />
          <NotepadText className="text-main2 hover:text-main ml-4 h-4 w-4 cursor-pointer" />
        </div>
      )
    },
  },
]
