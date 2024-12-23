"use client";

import { Home, Plus, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

// Menu items.
const studentSidebar = [
  {
    title: "Your classes",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "browse classes",
    url: "/dashboard/classrooms",
    icon: Search,
  },
  {
    title: "create class",
    url: "#",
    icon: Plus,
  },
];


export function StudentSideBar() {

  return (
    <Sidebar className="mt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Student Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentSidebar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}