"use client";

import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";
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

const studentSidebar = [
  {
    title: "Your Classes",
    url: "/dashboard/my-classes",
    icon: Home,
  },
  {
    title: "Browse Classes",
    url: "/dashboard/classrooms",
    icon: Search,
  },
];

export function StudentSideBar() {
  const router = useRouter();
  return (
    <Sidebar className="w-64 bg-gray-900 text-white border-r border-gray-800 mt-16">
      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SidebarGroupLabel className="px-4 py-2 text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Student Dashboard
            </SidebarGroupLabel>
          </motion.div>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentSidebar.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push(item.url)}
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
