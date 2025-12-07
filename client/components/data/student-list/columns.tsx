"use client"

import {
  CircleUserRoundIcon,
  EllipsisIcon,
  NotepadText,
  CircleCheckIcon,
} from "lucide-react"
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
import { CounselorStudentListItem } from "@/lib/api/counselors"
import { toast } from "sonner"
import CatImage from "@/components/feedback/happy-toast"
import CatImageSad from "@/components/feedback/sad-toast"

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
      const value = (getValue() as string) || "pending"
      const studentAuthId = row.original.studentAuthId

      const handleChange = async (newValue: string) => {
        const casted = newValue as "pending" | "high risk" | "low risk"
        setStudents((prev) =>
          prev.map((student) =>
            student.studentAuthId === studentAuthId
              ? { ...student, assessment: casted }
              : student
          )
        )

        try {
          await updateStudentAssessment(studentAuthId, casted)
          toast.success(
            <div className="relative flex w-full items-center pr-18">
              <span className="pl-2">Assessment status updated</span>
              <CatImage />
            </div>,
            {
              duration: 3000,
              icon: <CircleCheckIcon className="size-4" />,
            }
          )
        } catch (err) {
          console.error("Failed to update assessment:", err)
          toast.error(
            <div className="relative flex w-full items-center pr-14">
              <span className="pl-2">
                Failed to update assessment. Please try again
              </span>
              <CatImageSad />
            </div>,
            { duration: 3000 }
          )
        }
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
    header: "Interview",
    size: 104,
    cell: ({ row }) => {
      const value = row.original.initialInterview

      return (
        <div className="flex justify-center">
          <StatusBadge value={value} />
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
        Counseling
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 120,
    cell: ({ row, getValue }) => {
      const value = (getValue() as string) || "no record"
      const studentAuthId = row.original.studentAuthId

      const handleChange = async (newValue: string) => {
        const casted = newValue as "no record" | "ongoing" | "closed"
        setStudents((prev) =>
          prev.map((student) =>
            student.studentAuthId === studentAuthId
              ? { ...student, counselingStatus: casted }
              : student
          )
        )

        try {
          await updateStudentCounseling(studentAuthId, casted)
          toast.success(
            <div className="relative flex w-full items-center pr-18">
              <span className="pl-2">Counseling status updated</span>
              <CatImage />
            </div>,
            {
              duration: 3000,
              icon: <CircleCheckIcon className="size-4" />,
            }
          )
        } catch (err) {
          console.error("Failed to update status:", err)
          toast.error(
            <div className="relative flex w-full items-center pr-14">
              <span className="pl-2">
                Failed to update status. Please try again
              </span>
              <CatImageSad />
            </div>,
            { duration: 3000 }
          )
        }
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
    accessorKey: "exitInterview",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Exit Interview
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </button>
    ),
    size: 120,
    cell: ({ row }) => {
      const value = row.original.exitInterview

      return (
        <div className="flex justify-center">
          <StatusBadge value={value} />
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
