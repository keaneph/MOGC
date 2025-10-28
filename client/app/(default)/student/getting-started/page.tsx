"use client"

import { useState } from "react"
import { 
    MegaphoneIcon,
    MessagesSquareIcon,
    BookOpenCheckIcon,
    SpeechIcon,
    TelescopeIcon,
} 
from "lucide-react";
import Link from "next/link";
import { PrimaryButton } from "@/components/primary-button";
import { Button } from "@/components/ui/button";
import love from "@/public/love.png"
import Image from "next/image";
import { TooltipThis } from "@/components/tooltip-this";
import { SiklabSheet } from "@/components/siklab-sheet"

export default function GettingStartedPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [accordionValue, setAccordionValue] = useState("")
  return (
    <div
      id="main-container"
      className="flex justify-center w-full mt-12 px-6"
    >
      {/* main content container */}
      <div className="w-full max-w-5xl">
        <div className="text-3xl font-semibold tracking-wide mb-10">
          Getting Started
        </div>

        <div className="flex border-1 rounded-sm p-3.5 mb-6">
          <div className="mr-3 flex justify-center">
            <MegaphoneIcon
              className="h-5 w-5 mx-2"
              style={{ color: "var(--main)" }}
            />
          </div>
          <div className="text-sm font-medium tracking-wide">
            New to MSU-IIT? Check out our onboarding guide to get started.&nbsp;
            <TooltipThis label="Start the onboarding guide by Siklab!">
              <Link
                href="/onboarding"
                className="underline"
                style={{ color: "var(--link)" }}
              >
                Start the guide.
              </Link>
            </TooltipThis>
          </div>
        </div>

        <div className="text-lg font-semibold tracking-wide mb-6">
          Start Profiling
        </div>

        <div className="flex border-1 justify-center rounded-sm pl-3 pt-3 mb-12">
          <div className="w-full flex-col ml-6 mt-5 h-auto">
            
            <div className="text-lg font-semibold tracking-wide mb-6">
              Start Filling up Personal Demographic Form
            </div>

            <div className="text-md font-medium tracking-wide mb-6">
              Start filling up the personal demographic form <br/>
              or use one of our samples to get started in minutes.
            </div>

            <div className="mb-6 text-sm font-medium tracking-wide ">
              <Link href="/student/student-profiling">
                <TooltipThis label="Fill up your personal demographic form now!">
                 <PrimaryButton content="Create Profile"/>
                </TooltipThis>
              </Link>
              <TooltipThis label="Learn more about personal demographic forms">
              <button
                onClick={() => {
                  setAccordionValue("item-1")
                  setSheetOpen(true)
                }}
                className="ml-4 cursor-pointer"
                style={{ color: "var(--link)" }}
              >
                Learn more
              </button>
              </TooltipThis>
            </div>

          </div>        
          <div className="w-full flex justify-end">
            <Image src={love} alt="Love" className="w-55 h-auto mr-8" />
          </div>
        </div>

        <div className="text-lg font-semibold tracking-wide mb-6">
          Next Steps
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="flex border-1 rounded-sm p-6">
            <div className="mr-4">
              <div className="flex justify-center items-center bg-main/5 w-10 h-10 rounded-sm">
                <MessagesSquareIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}/>
              </div>
            </div>
            <div className="flex flex-col" >
              <div className="text-sm font-medium tracking-wide mb-2">
                Counselor Interview 
              </div>
              <div className="text-sm font-regular tracking-wide mb-4 text-main2">
                Book an appointment with the guidance counselor of
                your department to finish initialization.
              </div>
              <div className="text-sm font-medium tracking-wide ">
                <TooltipThis label="Proceed to book an appointment with your counselor">
                  <Button variant="outline" className="rounded-sm tracking-wide cursor-pointer">
                    Go Next
                  </Button>
                </TooltipThis>
                <TooltipThis label="Learn more about counselor interviews">
                  <button
                      onClick={() => {
                        setAccordionValue("item-2")
                        setSheetOpen(true)
                      }}
                      className="ml-4 cursor-pointer"
                      style={{ color: "var(--link)" }}
                    >
                      Learn more
                  </button>
              </TooltipThis>
              </div>
            </div>
          </div>

          <div className="flex border-1 rounded-sm p-6">
            <div className="mr-4">
              <div className="flex justify-center items-center bg-main/5 w-10 h-10 rounded-sm">
                <BookOpenCheckIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}/>
              </div>
            </div>
            <div className="flex flex-col" >
              <div className="text-sm font-medium tracking-wide mb-2">
                Initialization Tests 
              </div>
              <div className="text-sm font-regular tracking-wide mb-4 text-main2">
                Take the required tests to help us understand
                your needs better and provide appropriate support.
              </div>
              <div className="text-sm font-medium tracking-wide ">
                <TooltipThis label="Proceed to take the initialization tests">
                  <Button variant="outline" className="rounded-sm tracking-wide cursor-pointer">
                    Go Next
                  </Button>
                </TooltipThis>
                <TooltipThis label="Learn more about initialization tests">
                  <button
                      onClick={() => {
                        setAccordionValue("item-3")
                        setSheetOpen(true)
                      }}
                      className="ml-4 cursor-pointer"
                      style={{ color: "var(--link)" }}
                    >
                      Learn more
                  </button>
              </TooltipThis>
              </div>
            </div>
          </div>

          <div className="flex border-1 rounded-sm p-6">
            <div className="mr-4">
              <div className="flex justify-center items-center bg-main/5 w-10 h-10 rounded-sm">
                <SpeechIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}/>
              </div>
            </div>
            <div className="flex flex-col" >
              <div className="text-sm font-medium tracking-wide mb-2">
                Counseling Sessions
              </div>
              <div className="text-sm font-regular tracking-wide mb-4 text-main2">
                Schedule counseling sessions with your assigned
                counselor to discuss your concerns and goals.
              </div>
              <div className="text-sm font-medium tracking-wide ">
                <TooltipThis label="Proceed to schedule counseling sessions">
                  <Button variant="outline" className="rounded-sm tracking-wide cursor-pointer">
                    Go Next
                  </Button>
                </TooltipThis>
                <TooltipThis label="Learn more about counseling sessions">
                  <button
                      onClick={() => {
                        setAccordionValue("item-4")
                        setSheetOpen(true)
                      }}
                      className="ml-4 cursor-pointer"
                      style={{ color: "var(--link)" }}
                    >
                      Learn more
                  </button>
              </TooltipThis>
              </div>
            </div>
          </div>

          <div className="flex border-1 rounded-sm p-6">
            <div className="mr-4">
              <div className="flex justify-center items-center bg-main/5 w-10 h-10 rounded-sm">
                <TelescopeIcon
                  className="h-6 w-6"
                  style={{ color: "var(--main)" }}/>
              </div>
            </div>
            <div className="flex flex-col" >
              <div className="text-sm font-medium tracking-wide mb-2">
                Explore MOGC
              </div>
              <div className="text-sm font-regular tracking-wide mb-4 text-main2">
                Explore the various features and resources
                available in the MOGC web application.
              </div>
              <div className="text-sm font-medium tracking-wide ">
                <TooltipThis label="Proceed to explore the MOGC application">
                  <Button variant="outline" className="rounded-sm tracking-wide cursor-pointer">
                    Go Next
                  </Button>
                </TooltipThis>
                <TooltipThis label="Learn more about exploring MOGC">
                  <button
                      onClick={() => {
                        setAccordionValue("item-5")
                        setSheetOpen(true)
                      }}
                      className="ml-4 cursor-pointer"
                      style={{ color: "var(--link)" }}
                    >
                      Learn more
                  </button>
              </TooltipThis>
              </div>
            </div>
          </div>
          
          <div className="h-15">
          </div>

        </div>
      </div>
      {/* Siklab sheet (controlled) */}
      <SiklabSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        accordionValue={accordionValue}
        onAccordionValueChange={(v) => setAccordionValue(v as string)}
        showTrigger={false}
      />
    </div>
  );
}
