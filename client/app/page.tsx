import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>
        for testing purposes only. click to be redirected. happy coding guys
      </h1>
      <div className="flex">
        <Button className="bg-main m-2 cursor-pointer">
          <Link href="/student/getting-started">Student</Link>
        </Button>

        <Button className="bg-main m-2 cursor-pointer">
          <Link href="/counselor/getting-started">Counselor</Link>
        </Button>
      </div>
    </div>
  )
}
