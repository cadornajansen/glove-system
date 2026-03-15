"use client";

import * as React from "react";
import {
  HeartPulse,
  LayoutDashboard,
  Pill,
  CalendarDays,
  FileText,
  LifeBuoy,
  Send,
  Command,
  Activity,
  ClipboardList,
  BarChart3,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Patient A",
    email: "patient@example.com",
    avatar: "/avatars/patient.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Daily Tasks", url: "/dashboard#tasks" },
      ],
    },
    {
      title: "Health Records",
      url: "/records",
      icon: HeartPulse,
      items: [
        { title: "Vitals", url: "/records/vitals" },
        { title: "Condition Logs", url: "/records/conditions" },
      ],
    },
    {
      title: "Medication",
      url: "/medication",
      icon: Pill,
      items: [
        { title: "Today’s Medication", url: "/medication/today" },
        { title: "History", url: "/medication/history" },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CalendarDays,
      items: [
        { title: "Schedules", url: "/calendar" },
        { title: "Reminders", url: "/calendar/reminders" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Daily Summary", url: "/reports/daily" },
        { title: "Export", url: "/reports/export" },
      ],
    },
  ],

  // 🔹 This is NEW (replacing generic "Projects" with medical context)
  projects: [
    {
      name: "Vitals Monitoring",
      url: "/records/vitals",
      icon: Activity,
    },
    {
      name: "Care Plans",
      url: "/care-plans",
      icon: ClipboardList,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Medicare Assist</span>
                  <span className="truncate text-xs">Stroke Care System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}