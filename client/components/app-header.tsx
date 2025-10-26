'use client'

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { 
    CircleUserRoundIcon,
    LanguagesIcon,
    BellIcon,
    SearchIcon
 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TooltipThis } from "./tooltip-this";
import { ContactDrawer } from "./drawer";
import { UserDropdown } from "./userprofile-dropdown";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

export function AppHeader({role}: {role: string}) {
    const userName = useSupabaseUser()
  return (
    <header className="sticky flex items-center h-14 border-b bg-main">
      {/* logo section */}
        <div className="flex border-b items-center justify-center w-14 h-14 bg-white">
            <TooltipThis label="Home">
                <Button asChild variant="default" className="cursor-pointer p-1 h-auto hover:bg-primary/10">
                    <Link href="/">
                        <Image src={logo} alt="MSU-IIT OGC" className="h-10 w-10"  />
                    </Link>
                </Button>
            </TooltipThis>
        </div>

      {/* profile section */}
      <div className="flex items-center">

        <div className="flex items-center justify-center w-14">
        {/* svg has diff sizing*/}
        <CircleUserRoundIcon className="text-white h-8 w-8" strokeWidth={1.5}/>
        </div>
        
        <div className="flex flex-col -mt-1.5">
            <span className="text-white font-medium tracking-wide">
                Welcome {userName ?? 'Guest'}!
            </span>
            <Badge
                variant="secondary"
                className="rounded-sm mt-0.5 w-28 h-4.5 text-xs flex items-center justify-center tracking-wide text-main"> 
                {role}
            </Badge>
            </div>
      </div>

      {/* right section */}
        <div className="text-white text-sm ml-auto mr-6 flex items-center gap-8 tracking-wide ">
            <TooltipThis label="Search the application">
                <div className="flex gap-1 items-center cursor-pointer hover:underline underline-offset-4 decoration-2 decoration-white">
                    <SearchIcon className="h-4 w-4" />
                    <div>Search</div>
                </div>
            </TooltipThis>

            <TooltipThis label="Contact our support team for assistance">
                    <div>
                        <ContactDrawer trigger={<div className="cursor-pointer hover:underline underline-offset-4 decoration-2 decoration-white">
                        Discuss your needs
                        </div>} />
                    </div>
            </TooltipThis>

            <TooltipThis label="View the documentation">
                <div className="cursor-pointer hover:underline underline-offset-4 decoration-2 decoration-white">
                        Documentation
                    </div>
            </TooltipThis>

            <TooltipThis label="Change Language">
                <Button asChild variant="default" className="cursor-pointer !p-1 h-auto w-auto hover:bg-primary/10">
                    <Link href="/student/getting-started">
                        <LanguagesIcon className="!h-5 !w-5"/>
                    </Link>
                </Button>
            </TooltipThis>

            <TooltipThis label="View your notifications">
                <Button asChild variant="default" className="cursor-pointer !p-1 h-auto w-auto hover:bg-primary/10">
                    <Link href="/student/getting-started">
                        <BellIcon className="!h-5 !w-5"/>
                    </Link>
                </Button>
            </TooltipThis>

            <UserDropdown /> 
        </div>
</header>
);
}