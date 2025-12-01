import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CounselorStudentListItem } from "../columns"
import StatusBadge, { StatusType } from "../status-badge"
import { Button } from "@/components/ui/button"
import { getStudentNotes, StudentNote } from "@/lib/api/counselors"
import { SearchInput } from "../search-input"
import { Separator } from "@/components/ui/separator"
import { SquarePenIcon } from "lucide-react"

type Props = {
  student: CounselorStudentListItem
}

const StudentNotes: React.FC<Props> = ({ student }) => {
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNote, setSelectedNote] = useState<StudentNote | null>(null)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "regular":
        return "bg-main/50"
      case "progress":
        return "bg-main3/50"
      case "closure":
        return "bg-link/50"
      default:
        return "bg-gray-300"
    }
  }

  useEffect(() => {
    getStudentNotes(student.idNumber).then(setNotes)
  }, [student.idNumber])

  const filteredNotes = notes.filter((note) => {
    const term = searchTerm.toLowerCase()
    return (
      note.note_title.toLowerCase().includes(term) ||
      note.note_type.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    )
  })

  return (
    <div className="mt-7 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-3xl font-semibold tracking-wide">Notes</div>

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
            Assessment: <StatusBadge value={student.assessment as StatusType} />
          </div>
          <div>
            Counseling Status:{" "}
            <StatusBadge value={student.counselingStatus as StatusType} />
          </div>
        </div>

        <div className="mb-10 flex h-[500px] w-full rounded-sm border shadow-sm">
          {/* Left Section */}
          <div className="flex h-full w-[30%] flex-col p-3">
            <div className="text-muted-foreground mt-1 mb-2 ml-2 w-full pr-4 text-[16px] font-semibold tracking-wide">
              Recent Sessions
              <Separator orientation="horizontal" className="mt-1 w-full" />
            </div>
            <div className="mb-2 h-5 w-full">
              <SearchInput
                value={searchTerm}
                onChange={(val: string) => setSearchTerm(val)}
                total={notes.length}
              />
            </div>

            <ScrollArea className="mt-4 h-full w-full overflow-y-auto rounded-md">
              <ul className="space-y-2">
                {filteredNotes.map((note) => (
                  <li
                    key={note.id}
                    className={`hover:bg-muted cursor-pointer rounded-md p-2 ${
                      selectedNote?.id === note.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-center font-semibold">
                      <div
                        className={`${getTypeColor(note.note_type)} mr-3 h-5 w-2`}
                      ></div>{" "}
                      {note.note_title}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {note.note_type} •{" "}
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                  </li>
                ))}
                {filteredNotes.length === 0 && (
                  <li className="text-muted-foreground text-center text-sm">
                    No notes found
                  </li>
                )}
              </ul>
            </ScrollArea>

            <div className="w-full">
              <Button
                variant="default"
                className="bg-main hover:bg-main mt-2 w-full cursor-pointer"
              >
                Add Note
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-full" />
          {/* Right Section */}
          <div className="flex h-full w-[70%] flex-col p-4">
            {!selectedNote ? (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                <p className="mb-4 text-lg font-semibold">
                  Select a note to view details
                </p>
                <Button
                  variant="default"
                  className="bg-main hover:bg-main cursor-pointer"
                >
                  Add Note
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex">
                  <h2 className="mb-2 text-xl font-semibold">
                    {selectedNote.note_title}{" "}
                  </h2>
                  <div className="ml-auto">
                    <Button
                      variant="outline"
                      className="justify-right ml-auto h-8 cursor-pointer border-none px-3 text-sm"
                    >
                      <SquarePenIcon className="text-main2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">
                  {new Date(selectedNote.created_at).toLocaleString()} •{" "}
                  {selectedNote.note_type.charAt(0).toUpperCase() +
                    selectedNote.note_type.slice(1)}{" "}
                  Note
                </p>
                <ScrollArea className="h-full overflow-y-auto">
                  <div className="p-4 text-sm leading-relaxed">
                    {selectedNote.content}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
        {/* Legend */}
        <div className="relative z-20 mt-6 mb-30 flex w-full justify-center gap-6 text-sm tracking-wide">
          <span className="font-semibold">Legend:</span>

          <div className="flex items-center gap-2">
            <div className="bg-main/50 h-4 w-4 rounded-sm"></div>
            <span>Regular Note</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-main3/50 h-4 w-4 rounded-sm"></div>
            <span>Progress Note</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-link/50 h-4 w-4 rounded-sm"></div>
            <span>Closure Note</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentNotes
