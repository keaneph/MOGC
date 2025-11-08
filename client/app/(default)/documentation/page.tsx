import Image from "next/image"
import { DocumentationTable } from "@/components/documentation-table"
import {
  BookHeart,
  CalendarDays,
  ChartLine,
  ClipboardClock,
} from "lucide-react"

export default function DocumentationPage() {
  return (
    <div id="main-container" className="mt-12 flex w-full justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* title */}
        <div className="mb-10 text-3xl font-semibold tracking-wide">
          Documentation
        </div>
        <div className="mb-10 text-sm font-normal tracking-wide">
          Welcome to the official documentation for the{" "}
          <strong>MSU-IIT Office of the Guidance and Counseling (MOGC)</strong>{" "}
          web application. This platform streamlines student support services,
          enabling secure, role-based access for both students and counselors.
          Designed with scalability and automation in mind, it empowers users
          through guided onboarding, detailed profiling, and efficient counselor
          workflows.
        </div>

        {/* Siklab and Contributors */}
        <div className="relative mr-20 mb-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Siklab section */}
          <div className="p-5 pr-16 pl-40">
            <div className="border-main relative z-10 border border-dashed p-4">
              <div className="text-main2 text-center text-xs font-normal italic">
                Hi! I’m <strong>Siklab</strong> — your spark of support and
                guidance here at OGC. Let’s grow together!
              </div>
            </div>
          </div>
          <div className="bottom-0 left-100 -z-10">
            <Image src="/docu.png" alt="Siklab Mascot" width={96} height={96} />
          </div>

          {/* Contributors section */}
          <div className="bg-background z-10 rounded-sm border p-4">
            <div className="mb-4 text-base font-semibold tracking-wide">
              Contributors
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                "Keane Pharelle Ledesma",
                "Sheldon Ed Enario",
                "Juhanara Saluta",
                "Vidal Serate",
              ].map((name, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Image
                    src="/dp.png"
                    alt={name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div className="text-xs font-medium tracking-wide">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* title */}
        <div className="mb-10 text-xl font-semibold tracking-wide">
          Roadmap & Current Features
        </div>
        <div className="flex-cols-2 mb-5 flex">
          <div className="mt-65 -mb-4 -ml-5">
            <Image
              src="/pushing.png"
              alt="Siklab Mascot"
              width={96}
              height={96}
              className="ml-[7px]"
            />
          </div>
          <DocumentationTable />
        </div>
        <div className="mb-10 ml-20 text-lg font-semibold tracking-wide">
          Roadmap
        </div>
        <div className="mr-30 mb-20 ml-20 flex justify-center">
          <div className="grid w-full max-w-4xl grid-cols-2 gap-6">
            <div className="flex rounded-sm border pt-6 pb-3 pl-6">
              <div className="mr-4">
                <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                  <ClipboardClock
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  Appointment Scheduling
                </div>
                <div className="font-regular text-main2 mb-4 text-xs tracking-wide">
                  Counselor & Student
                </div>
              </div>
            </div>
            <div className="flex rounded-sm border pt-6 pb-3 pl-6">
              <div className="mr-4">
                <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                  <BookHeart
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  Session notes and counseling history
                </div>
                <div className="font-regular text-main2 mb-4 text-xs tracking-wide">
                  Counselor
                </div>
              </div>
            </div>
            <div className="flex rounded-sm border pt-6 pb-3 pl-6">
              <div className="mr-4">
                <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                  <ChartLine
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  Analytics dashboard for trends
                </div>
                <div className="font-regular text-main2 mb-4 text-xs tracking-wide">
                  Counselor & Student
                </div>
              </div>
            </div>
            <div className="flex rounded-sm border pt-6 pb-3 pl-6">
              <div className="mr-4">
                <div className="bg-main/5 flex h-10 w-10 items-center justify-center rounded-sm">
                  <CalendarDays
                    className="h-6 w-6"
                    style={{ color: "var(--main)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 text-sm font-medium tracking-wide">
                  Calendar of Events
                </div>
                <div className="font-regular text-main2 mb-4 text-xs tracking-wide">
                  Counselor & Student
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
