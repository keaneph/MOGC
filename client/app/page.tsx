import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>for testing purposes only. click to be redirected. happy coding guys</h1>
      <div className="flex">
        <Button className="m-2 bg-main cursor-pointer"> 
          <Link href="/student/getting-started">
            Student
          </Link>
        </Button>

        <Button className="m-2 bg-main cursor-pointer"> 
          <Link href="/counselor/getting-started" >
            Counselor 
          </Link>
        </Button>
      </div>
    </div>
  )

}
