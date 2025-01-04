"use client";

import { Home, Plus, Search, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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

const teacherSidebar = [
  {
    title: "Manage Classes",
    url: "/dashboard/manage-classes",
    icon: Home,
  },
  {
    title: "Create Class",
    url: "/dashboard/create",
    icon: Plus,
  },
  {
    title: "Browse Classes",
    url: "/dashboard/classrooms",
    icon: Search,
  },
  {
    title: "Start a video Class",
    url: "/dashboard/video-call",
    icon: Video,
  },
];

export function TeacherSideBar() {
  const router = useRouter();

  const handleItemClick = (item: { url: string }) => {
    const { url } = item;
    router.push(url);
  };

  return (
    <Sidebar className="w-64 bg-gray-900 text-white border-r border-gray-800 mt-16  ">
      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SidebarGroupLabel className="px-4 py-2 text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Teacher Dashboard
            </SidebarGroupLabel>
          </motion.div>
          <SidebarGroupContent>
            <SidebarMenu>
              {teacherSidebar.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleItemClick(item)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      {item.icon && (
                        <item.icon className="w-5 h-5 text-purple-400" />
                      )}
                      <span className="text-gray-300 hover:text-white transition-colors duration-200">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
