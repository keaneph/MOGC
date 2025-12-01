import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type NoteFormProps = {
  title: string
  noteTitle: string
  noteType: string
  noteContent: string
  onTitleChange: (val: string) => void
  onTypeChange: (val: string) => void
  onContentChange: (val: string) => void
  onSave: () => void
  onCancel: () => void
  saving?: boolean
}

export const NoteForm: React.FC<NoteFormProps> = ({
  title,
  noteTitle,
  noteType,
  noteContent,
  onTitleChange,
  onTypeChange,
  onContentChange,
  onSave,
  onCancel,
  saving,
}) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">{title}</h2>

    <Input
      placeholder="Title"
      value={noteTitle}
      onChange={(e) => onTitleChange(e.target.value)}
    />

    <Select value={noteType} onValueChange={onTypeChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="regular">Regular</SelectItem>
        <SelectItem value="progress">Progress</SelectItem>
        <SelectItem value="closure">Closure</SelectItem>
      </SelectContent>
    </Select>

    <Textarea
      placeholder="Content"
      value={noteContent}
      onChange={(e) => onContentChange(e.target.value)}
      className="h-65"
    />

    <div className="ml-auto flex gap-2">
      <Button
        variant="default"
        className="bg-main hover:bg-main cursor-pointer"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>

      <Button variant="outline" className="cursor-pointer" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </div>
)
