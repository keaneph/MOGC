"use client"

import { CircleUserRoundIcon, EllipsisIcon, NotepadText } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import {
  Select,
  SelectTrigger,
  SelectValue,
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
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"

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

      const getBgColor = (val: string) => {
        switch (val) {
          case "high risk":
            return "bg-[var(--status-red)]"
          case "low risk":
            return "bg-[var(--status-green)]"
          case "pending":
          default:
            return "bg-[var(--status-yellow)]"
        }
      }

      const getTextColor = (val: string) => {
        switch (val) {
          case "high risk":
          case "low risk":
            return "text-white"
          case "pending":
          default:
            return "text-main2"
        }
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger
              className={`cursor-pointer rounded-lg px-2 py-1 text-center text-[10px] leading-none ${getBgColor(value)} ${getTextColor(value)} !h-[20px] [&>svg]:hidden`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="!w-[100px] !min-w-[100px] rounded-lg text-[10px]">
              {["pending", "high risk", "low risk"].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={`mb-2 cursor-pointer rounded-md px-2 py-1 text-center text-[9px] ${getBgColor(option)} ${getTextColor(option)} data-[highlighted]:${getBgColor(option)} data-[highlighted]:${getTextColor(option)} data-[state=checked]:${getBgColor(option)} data-[state=checked]:${getTextColor(option)} hover:${getBgColor(option)} hover:${getTextColor(option)} focus:${getBgColor(option)} focus:${getTextColor(option)}`}
                >
                  {option.toUpperCase()}
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

      const getBgColor = (val: string) => {
        switch (val) {
          case "done":
            return "bg-[var(--status-green)]"
          case "scheduled":
            return "bg-[var(--status-peach)]"
          case "rescheduled":
            return "bg-[var(--status-blue)]"
          default:
            return "bg-[var(--status-yellow)]"
        }
      }

      const getTextColor = (val: string) => {
        switch (val) {
          case "done":
          case "scheduled":
          case "rescheduled":
            return "text-white"
          case "pending":
          default:
            return "text-main2"
        }
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger
              className={`cursor-pointer rounded-lg px-2 py-1 text-center text-[10px] leading-none ${getBgColor(value)} ${getTextColor(value)} !h-[20px] [&>svg]:hidden`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="!w-[100px] !min-w-[100px] rounded-lg text-[10px]">
              {["pending", "scheduled", "rescheduled", "done"].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={`mb-2 cursor-pointer rounded-md px-2 py-1 text-center text-[9px] ${getBgColor(option)} ${getTextColor(option)} data-[highlighted]:${getBgColor(option)} data-[highlighted]:${getTextColor(option)} data-[state=checked]:${getBgColor(option)} data-[state=checked]:${getTextColor(option)} hover:${getBgColor(option)} hover:${getTextColor(option)} focus:${getBgColor(option)} focus:${getTextColor(option)}`}
                >
                  {option.toUpperCase()}
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

      const getBgColor = (val: string) => {
        switch (val) {
          case "ongoing":
            return "bg-[var(--status-blue)]"
          case "closed":
            return "bg-[var(--status-green)]"
          default:
            return "bg-[var(--status-yellow)]"
        }
      }

      const getTextColor = (val: string) => {
        switch (val) {
          case "ongoing":
          case "closed":
            return "text-white"
          case "no record":
          default:
            return "text-main2"
        }
      }

      return (
        <div className="flex justify-center">
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger
              className={`cursor-pointer rounded-lg px-2 py-1 text-center text-[10px] leading-none ${getBgColor(value)} ${getTextColor(value)} !h-[20px] [&>svg]:hidden`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="!w-[100px] !min-w-[100px] rounded-lg text-[10px]">
              {["no record", "ongoing", "closed"].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={`mb-2 cursor-pointer rounded-md px-2 py-1 text-center text-[9px] ${getBgColor(option)} ${getTextColor(option)} data-[highlighted]:${getBgColor(option)} data-[highlighted]:${getTextColor(option)} data-[state=checked]:${getBgColor(option)} data-[state=checked]:${getTextColor(option)} hover:${getBgColor(option)} hover:${getTextColor(option)} focus:${getBgColor(option)} focus:${getTextColor(option)}`}
                >
                  {option.toUpperCase()}
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
    cell: ({}) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-5 w-8 cursor-pointer p-0">
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between text-xs"
              >
                View Details
                <CircleUserRoundIcon className="ml-2 h-4 w-4" />
              </Button>
              <DropdownMenuSeparator className="mr-2 ml-2" />
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between text-xs"
              >
                Add Note
                <NotepadText className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
