"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import React from "react"

import {
  SparklesIcon,
  ChartNoAxesCombinedIcon,
  UserPenIcon,
  CalendarPlusIcon,
  PartyPopperIcon,
  SettingsIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { TooltipThis } from "@/components/feedback/tooltip-this"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Getting Started",
    url: "/student/getting-started",
    icon: SparklesIcon,
    noOutline: true,
  },
  {
    title: "Activity",
    url: "/student/activity",
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: "Student Profiling",
    url: "/student/student-profiling",
    icon: UserPenIcon,
  },
  {
    title: "Booking",
    url: "/student/booking",
    icon: CalendarPlusIcon,
  },
  {
    title: "Calendar of Events",
    url: "/student/calendar-of-events",
    icon: PartyPopperIcon,
  },
  {
    title: "Settings",
    url: "/student/settings",
    icon: SettingsIcon,
  },
]

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="font-semibold tracking-wide"
      style={{ color: "var(--main2)" }}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 ml-0.5 gap-3">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <TooltipThis label={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url} className="!gap-4">
                          {item.noOutline ? (
                            <Icon
                              fill={isActive ? "var(--main)" : "var(--main2)"}
                              stroke="none"
                              className="!h-4.5 !w-4.5"
                            />
                          ) : (
                            <Icon
                              fill="none"
                              stroke={isActive ? "var(--main)" : "currentColor"}
                              className="!h-4.5 !w-4.5"
                            />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipThis>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <button
          onClick={toggleSidebar}
          className="hover:bg-muted flex w-full cursor-pointer items-center justify-end py-4 pr-4 transition-colors"
        >
          {open ? (
            <ChevronsLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronsRightIcon className="h-5 w-5" />
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
