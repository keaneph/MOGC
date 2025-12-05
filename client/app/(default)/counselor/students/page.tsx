"use client"

import { RefreshCcw } from "lucide-react"

import { useEffect, useState, useMemo, useCallback } from "react"

import { SortingState } from "@tanstack/react-table"

import {
  columns,
  CounselorStudentListItem,
} from "@/components/data/student-list/columns"
import { DataTable } from "@/components/data/student-list/data-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { SearchInput } from "@/components/data/student-list/search-input"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { getCounselorStudentList } from "@/lib/api/counselors"

export default function StudentsPage() {
  const [students, setStudents] = useState<CounselorStudentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  const pageSize = 10

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return students.filter(
      (student) =>
        student.idNumber.toLowerCase().includes(term) ||
        student.studentName.toLowerCase().includes(term)
    )
  }, [students, searchTerm])

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      for (const sort of sorting) {
        const { id, desc } = sort
        const aValue = a[id as keyof CounselorStudentListItem]
        const bValue = b[id as keyof CounselorStudentListItem]

        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()

        if (aStr < bStr) return desc ? 1 : -1
        if (aStr > bStr) return desc ? -1 : 1
      }
      return 0
    })
  }, [filteredStudents, sorting])

  const totalPages = Math.ceil(filteredStudents.length / pageSize)

  const paginatedData = useMemo(() => {
    return sortedStudents.slice((page - 1) * pageSize, page * pageSize)
  }, [sortedStudents, page, pageSize])

  const tableColumns = useMemo(() => columns(setStudents), [])

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  )

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCounselorStudentList()
      setStudents(data)
    } catch {
      setError("Failed to load student list.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return (
    <main id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="flex-cols-2 mx-auto flex">
          <h1 className="mb-10 text-3xl font-semibold tracking-wide">
            List of Students
          </h1>
          <div className="ml-auto !w-70 justify-end">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              total={filteredStudents.length}
            />
          </div>
        </div>

        {loading && <Skeleton className="h-[510px] w-full rounded-md" />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="container h-[500px] w-full overflow-y-auto">
            <div className="overflow-y-auto rounded-md border shadow-sm">
              <DataTable
                columns={tableColumns}
                data={paginatedData}
                sorting={sorting}
                setSorting={setSorting}
              />
            </div>
            <div className="mt-2 flex flex-row justify-center">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex cursor-pointer items-center gap-2"
                  onClick={fetchStudents}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    />
                  </PaginationItem>

                  {paginationPages.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
