import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-docs"

export function DocumentationTable() {
  return (
    <Table className="w-full table-auto border">
      <TableCaption className="text-xs tracking-wide">
        These are the current features being implemented.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-main hover:bg-main text-white hover:text-white">
          <TableHead className="w-[100px] pl-5">Role</TableHead>
          <TableHead className="w-[150px]">Feature</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="pl-5 font-medium">Student</TableCell>
          <TableCell>Homepage</TableCell>
          <TableCell>
            Personalized dashboard with quick access to key features.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell>Getting Started</TableCell>
          <TableCell>
            Includes onboarding flow and "Guide Me" walkthroughs.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell>Student Profiling</TableCell>
          <TableCell>
            Multi-section form capturing personal, family, academic, learning,
            well-being, and needs data. Includes a draggable stepper interface
            where <strong>Siklab</strong>, the mascot guide, can be repositioned
            to any section level, allowing flexible navigation and visual
            progress tracking.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell>Profile Page</TableCell>
          <TableCell>
            Displays submitted profile data in a structured and readable format.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="pl-5 font-medium">Counselor</TableCell>
          <TableCell>Homepage</TableCell>
          <TableCell>
            Personalized dashboard with quick access to key features.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell>Students Table</TableCell>
          <TableCell>
            Displays a dynamic list of students with key academic and counseling
            details, including ID number, course, year level, assessment risk
            level, interview status, and counseling progress. Each row includes
            action buttons for viewing, editing, and deleting records. Status
            indicators are color-coded for clarity, and the table supports
            real-time updates for streamlined tracking and intervention.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
