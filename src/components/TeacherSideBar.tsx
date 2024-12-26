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
import { useRouter } from "next/navigation";

// Menu items.

const teacherSidebar = [
  {
    title: "Manage Classes",
    url: "/dashboard/manage-classes",
    icon: Home,
  },
  {
    title: "Create class",
    url: "/dashboard/create-class",
    icon: Plus,
  },
  {
    title: "Browse class",
    url: "/dashboard/classrooms",
    icon: Search,
  },
];

export function TeacherSideBar() {
  // Choose the appropriate sidebar based on userIs

  const router = useRouter();

  const handleItemClick = (item: { url: string }) => {
    const { url } = item;
    router.push(url);
  };

  return (
    <Sidebar className="mt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teacher Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teacherSidebar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
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
