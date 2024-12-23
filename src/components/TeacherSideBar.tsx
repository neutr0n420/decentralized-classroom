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
    }
];

export function TeacherSideBar() {

    // Choose the appropriate sidebar based on userIs

    return (
        <Sidebar className="mt-12">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Teacher Dashboard
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {teacherSidebar.map((item) => (
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