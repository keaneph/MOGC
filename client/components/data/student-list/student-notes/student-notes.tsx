import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CounselorStudentListItem } from "../columns"
import StatusBadge, { StatusType } from "../status-badge"
import { Button } from "@/components/ui/button"
import {
  deleteStudentNote,
  getStudentNotes,
  saveStudentNote,
  StudentNote,
  updateStudentNote,
} from "@/lib/api/counselors"
import { SearchInput } from "../search-input"
import { Separator } from "@/components/ui/separator"
import { SquarePenIcon, CircleCheckIcon } from "lucide-react"
import { NoteForm } from "./note-form"
import { toast } from "sonner"
import CatImage from "@/components/feedback/happy-toast"
import CatImageSad from "@/components/feedback/sad-toast"
import { DeleteConfirmationDialog } from "./delete-confirmation"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  student: CounselorStudentListItem
}

const StudentNotes: React.FC<Props> = ({ student }) => {
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNote, setSelectedNote] = useState<StudentNote | null>(null)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState("regular")
  const [newContent, setNewContent] = useState("")
  const [editNoteOpen, setEditNoteOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getStudentNotes(student.idNumber).then((data) => {
      setNotes(data)
      setLoading(false)
    })
  }, [student.idNumber])

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

  const handleSaveNote = async () => {
    setSaving(true)
    const saved = await saveStudentNote(student.idNumber, {
      student_id: student.idNumber,
      note_title: newTitle,
      note_type: newType,
      content: newContent,
    })

    if (saved) {
      setNotes([saved, ...notes])
      setSelectedNote(saved)
      setAddNoteOpen(false)
      setNewTitle("")
      setNewType("regular")
      setNewContent("")
      toast.success(
        <div className="relative flex w-full items-center pr-18">
          <span className="pl-2">Note saved successfully</span>
          <CatImage />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    } else {
      toast.error(
        <div className="relative flex w-full items-center pr-14">
          <span className="pl-2">Failed to save. Please try again</span>
          <CatImageSad />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    }
    setSaving(false)
  }

  const handleUpdateNote = async () => {
    if (!selectedNote) return
    setSaving(true)
    const updated = await updateStudentNote(student.idNumber, selectedNote.id, {
      note_title: newTitle,
      note_type: newType,
      content: newContent,
    })

    if (updated) {
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)))
      setSelectedNote(updated)
      setEditNoteOpen(false)
      setNewTitle("")
      setNewType("regular")
      setNewContent("")
      toast.success(
        <div className="relative flex w-full items-center pr-18">
          <span className="pl-2">Note updated successfully</span>
          <CatImage />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    } else {
      toast.error(
        <div className="relative flex w-full items-center pr-14">
          <span className="pl-2">Failed to save. Please try again</span>
          <CatImageSad />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    }
    setSaving(false)
  }

  const handleDeleteNote = async () => {
    if (!selectedNote) return
    const deleted = await deleteStudentNote(student.idNumber, selectedNote.id)
    if (deleted) {
      setNotes(notes.filter((n) => n.id !== selectedNote.id))
      setSelectedNote(null)
      toast.success(
        <div className="relative flex w-full items-center pr-18">
          <span className="pl-2">Note deleted successfully</span>
          <CatImage />
        </div>,
        {
          duration: 3000,
          icon: <CircleCheckIcon className="size-4" />,
        }
      )
    }
  }

  return (
    <div className="mt-7 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-3xl font-semibold tracking-wide">Notes</div>

        <div className="mb-2 flex w-full justify-center gap-4 text-[13px] tracking-wide">
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

        <div className="mb-5 flex h-[500px] w-full rounded-sm border shadow-sm">
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="rounded-md p-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="mt-2 h-3 w-24" />
                    </li>
                  ))
                ) : filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
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
                  ))
                ) : (
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
                onClick={() => {
                  setAddNoteOpen(true)
                  setSelectedNote(null)
                }}
              >
                Add Note
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-full" />
          {/* Right Section */}
          <div className="flex h-full w-[70%] flex-col p-4">
            {addNoteOpen ? (
              <NoteForm
                title="Add New Note"
                noteTitle={newTitle}
                noteType={newType}
                noteContent={newContent}
                onTitleChange={setNewTitle}
                onTypeChange={setNewType}
                onContentChange={setNewContent}
                onSave={handleSaveNote}
                onCancel={() => setAddNoteOpen(false)}
                saving={saving}
              />
            ) : editNoteOpen && selectedNote ? (
              <NoteForm
                title="Edit Note"
                noteTitle={newTitle}
                noteType={newType}
                noteContent={newContent}
                onTitleChange={setNewTitle}
                onTypeChange={setNewType}
                onContentChange={setNewContent}
                onSave={handleUpdateNote}
                onCancel={() => setEditNoteOpen(false)}
                saving={saving}
              />
            ) : !selectedNote ? (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                <p className="mb-4 text-lg font-semibold">
                  Select a note to view details
                </p>
                <Button
                  variant="default"
                  className="bg-main hover:bg-main cursor-pointer"
                  onClick={() => {
                    setAddNoteOpen(true)
                    setSelectedNote(null)
                  }}
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
                      className="justify-right ml-auto cursor-pointer border-none text-sm"
                      onClick={() => {
                        if (selectedNote) {
                          setNewTitle(selectedNote.note_title)
                          setNewType(selectedNote.note_type)
                          setNewContent(selectedNote.content)
                          setEditNoteOpen(true)
                          setAddNoteOpen(false)
                        }
                      }}
                    >
                      <SquarePenIcon className="text-main2 !h-4 !w-4" />
                    </Button>
                    <DeleteConfirmationDialog onConfirm={handleDeleteNote} />
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">
                  {new Date(selectedNote.created_at).toLocaleString()} •{" "}
                  <Badge
                    className={`${getTypeColor(selectedNote.note_type)} text-main2 font-semibold`}
                  >
                    {selectedNote.note_type.charAt(0).toUpperCase() +
                      selectedNote.note_type.slice(1)}{" "}
                    Note
                  </Badge>
                </p>
                <ScrollArea className="h-[350px] overflow-y-auto">
                  <div className="overflow-y-auto p-4 text-sm leading-relaxed whitespace-pre-line">
                    {selectedNote.content}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
        {/* Legend */}
        <div className="relative z-20 mb-30 flex w-full justify-center gap-6 text-xs tracking-wide">
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
