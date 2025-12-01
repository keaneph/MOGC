import {
  BookHeart,
  CalendarDays,
  ChartLine,
  ClipboardClock,
} from "lucide-react"

import Image from "next/image"

import { DocumentationTable } from "@/components/data/docs/documentation-table"

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
        <div className="container mr-20 mb-10 grid grid-cols-1 gap-0 md:grid-cols-[1fr_2fr]">
          {/* Siklab Bubble section */}
          <div className="p-2 pr-16 pl-30">
            <div className="border-main relative z-10 border border-dashed p-4">
              <div className="text-main2 text-center text-xs font-normal italic">
                Hi! I’m <strong>Siklab</strong> — your spark of support and
                guidance here at OGC. Let’s grow together!
              </div>
            </div>
          </div>

          <div className="flex-cols-2 flex">
            {/* Siklab Pic section */}
            <div className="mt-auto">
              <Image
                src="/docu.png"
                alt="Siklab Mascot"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            {/* Contributors section */}
            <div className="bg-background -ml-[3px] rounded-sm border p-4">
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
        </div>
        {/* title */}
        <div className="mb-10 text-xl font-semibold tracking-wide">
          Roadmap & Current Features
        </div>
        <div className="relative container mb-5 flex">
          <div className="absolute bottom-[2%] left-[-3.1%]">
            <Image
              src="/pushing.png"
              alt="Siklab Mascot"
              width={110}
              height={110}
              className=""
            />
          </div>

          {/* Table */}
          <div className="ml-17.5">
            <DocumentationTable />
          </div>
        </div>

        <div id="roadmap" className="mb-20 ml-10 w-full scroll-mt-24">
          <div className="mt-10 mb-10 ml-20 scroll-mt-24 text-lg font-semibold tracking-wide">
            Roadmap
          </div>

          <div className="mb-20 ml-10 h-50 w-full">
            <div className="flex">
              <div className="relative">
                <Image
                  src="/roadmap.svg"
                  alt="Roadmap Image"
                  width={1600}
                  height={600}
                  className="h-auto w-[900px]"
                />
                <Image
                  src="/pulling.png"
                  alt="Siklab Mascot"
                  width={250}
                  height={250}
                  className="absolute top-[47.6%] left-[99.5%] -translate-y-1/2"
                />
                {/* Stepper 1 */}
                <div className="absolute top-[-5%] left-[5.5%] flex flex-col items-center">
                  <div className="bg-main ring-main2 h-5 w-5 rounded-full border-3 border-white ring-1"></div>
                  <div className="bg-main h-15 w-[2px]"></div>{" "}
                  {/* vertical line */}
                  <div className="container mb-auto flex !w-[210px] items-center rounded-sm border bg-white pt-2 pr-3 pb-2 pl-2 shadow-md">
                    {/* Icon */}
                    <div className="mr-2 mb-auto">
                      <div className="bg-main/5 flex h-6 w-6 items-center justify-center rounded-sm">
                        <ClipboardClock
                          className="h-4 w-4"
                          style={{ color: "var(--main)" }}
                        />
                      </div>
                    </div>

                    {/* Texts */}
                    <div className="flex flex-col">
                      <div className="text-[12px] font-medium tracking-wide">
                        Appointment Scheduling
                      </div>
                      <div className="text-main2 text-[10px] font-normal tracking-wide">
                        Counselor & Student
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepper 2*/}
                <div className="absolute top-[-15%] left-[21.5%] flex flex-col items-center">
                  {/* container */}
                  <div className="container mb-auto flex !w-[210px] items-center rounded-sm border bg-white pt-2 pr-3 pb-2 pl-2 shadow-md">
                    {/* Icon */}
                    <div className="mr-2 mb-auto">
                      <div className="bg-main/5 flex h-6 w-6 items-center justify-center rounded-sm">
                        <BookHeart
                          className="h-4 w-4"
                          style={{ color: "var(--main)" }}
                        />
                      </div>
                    </div>

                    {/* Texts */}
                    <div className="flex flex-col">
                      <div className="text-[12px] font-medium tracking-wide">
                        Session notes and counseling history
                      </div>
                      <div className="text-main2 text-[10px] font-normal tracking-wide">
                        Counselor
                      </div>
                    </div>
                  </div>
                  {/* vertical line */}
                  <div className="bg-main h-15 w-[2px]"></div>
                  <div className="bg-main ring-main2 h-5 w-5 rounded-full border-3 border-white ring-1"></div>
                </div>

                {/* Stepper 3 */}
                <div className="absolute top-[-4%] left-[42.5%] flex flex-col items-center">
                  <div className="bg-main ring-main2 h-5 w-5 rounded-full border-3 border-white ring-1"></div>
                  <div className="bg-main h-15 w-[2px]"></div>{" "}
                  {/* vertical line */}
                  <div className="container mb-auto flex !w-[210px] items-center rounded-sm border bg-white pt-2 pr-3 pb-2 pl-2 shadow-md">
                    {/* Icon */}
                    <div className="mr-2 mb-auto">
                      <div className="bg-main/5 flex h-6 w-6 items-center justify-center rounded-sm">
                        <ChartLine
                          className="h-4 w-4"
                          style={{ color: "var(--main)" }}
                        />
                      </div>
                    </div>

                    {/* Texts */}
                    <div className="flex flex-col">
                      <div className="text-[12px] font-medium tracking-wide">
                        Analytics dashboard for trends
                      </div>
                      <div className="text-main2 text-[10px] font-normal tracking-wide">
                        Counselor & Student
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepper 2*/}
                <div className="absolute top-[5.8%] left-[65%] flex flex-col items-center">
                  {/* container */}
                  <div className="container mb-auto flex !w-[210px] items-center rounded-sm border bg-white pt-2 pr-3 pb-2 pl-2 shadow-md">
                    {/* Icon */}
                    <div className="mr-2 mb-auto">
                      <div className="bg-main/5 flex h-6 w-6 items-center justify-center rounded-sm">
                        <CalendarDays
                          className="h-4 w-4"
                          style={{ color: "var(--main)" }}
                        />
                      </div>
                    </div>

                    {/* Texts */}
                    <div className="flex flex-col">
                      <div className="text-[12px] font-medium tracking-wide">
                        Calendar of Events
                      </div>
                      <div className="font-normaltext-main2 text-[10px] tracking-wide">
                        Counselor & Student
                      </div>
                    </div>
                  </div>
                  {/* vertical line */}
                  <div className="bg-main h-15 w-[2px]"></div>
                  <div className="bg-main ring-main2 h-5 w-5 rounded-full border-3 border-white ring-1"></div>
                </div>
                {/* End of Steppers */}
              </div>
            </div>
          </div>
        </div>

        {/* End of Page */}
      </div>
    </div>
  )
}
