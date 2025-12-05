"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import React from "react"

import {
  SparklesIcon,
  ChartNoAxesCombinedIcon,
  AlarmClockIcon,
  CalendarRangeIcon,
  HandshakeIcon,
  SquareUserIcon,
  PartyPopperIcon,
  SettingsIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

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

import { TooltipThis } from "@/components/feedback/tooltip-this"

const items = [
  {
    title: "Getting Started",
    url: "/counselor/getting-started",
    icon: SparklesIcon,
    noOutline: true,
  },
  {
    title: "Activity",
    url: "/counselor/activity",
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: "Event Types",
    url: "/counselor/event-types",
    icon: CalendarRangeIcon,
  },
  {
    title: "Appointments",
    url: "/counselor/appointments",
    icon: HandshakeIcon,
  },
  {
    title: "Availability",
    url: "/counselor/availability",
    icon: AlarmClockIcon,
  },
  {
    title: "Students",
    url: "/counselor/students",
    icon: SquareUserIcon,
  },
  {
    title: "Calendar of Events",
    url: "/counselor/calendar-of-events",
    icon: PartyPopperIcon,
  },
  {
    title: "Settings",
    url: "/counselor/settings",
    icon: SettingsIcon,
  },
]

export function AppSidebarCounselor() {
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
