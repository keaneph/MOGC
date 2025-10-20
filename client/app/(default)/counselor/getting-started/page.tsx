import Link from "next/link";
import { FileQuestionMarkIcon } from "lucide-react";
import Image from "next/image";
import cats from "@/public/images/cats.png";
import { Button } from "@/components/ui/button"

export default function GettingStartedPage() {
  return (
    <div className="ml-36 mr-36 mt-10 tracking-wide">
      <div>
        <div className="text-3xl font-semibold mb-12">
          Getting Started
        </div>
        <div className="flex items-center border-1 rounded-sm p-2.5">
          <div className="mr-2 justify-center items-center flex">
            <FileQuestionMarkIcon style={{ fontSize: "1.5rem", color: 'var(--main)' }} />
          </div>
          <div  className="text-sm font-medium">
            New to MSU-IIT? Check out our onboarding guide to get started.&nbsp;
            <Link href="/onboarding" className="underline"style={
              {color: 'var(--link)'}
            }>Start the guide. </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="text-lg font-semibold mt-6 mb-6">
          Start Profiling
        </div>
        <div className="flex border-1 rounded-sm">
            <div className="flex-col mr-70">
              <div className="text-lg font-semibold pt-8 pl-10">
                Start filling up Personal Demographic Form
              </div>
              <div className="text-sm font-medium pt-5 pl-10 w-100">
                Start filling up the personal demographic form 
                or use one of our samples to get started in minutes.
              </div>
              <div className="flex pl-10 pt-5 items-center">
                <div>
                  <Button variant="default" className="rounded-sm" style={
                    {backgroundColor: 'var(--main)', color: 'white'}
                }>
                  Create Profile
                </Button>
                </div>
                <div>
                  <Link href="/learn-more" 
                        className="pl-5 mt-4 text-sm font-medium"
                        style= {
                          {color: 'var(--link)'} 
                        }>
                        Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <Image src={cats} alt="MSU-IIT CATS Logo" className="h-50 w-70" />
            </div>
        </div>
        <div className="text-lg font-semibold mt-6 mb-6">
          Next Steps
        </div>
      </div>
    </div>
  );
}
