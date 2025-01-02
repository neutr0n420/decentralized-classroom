"use client";
import { StudentSideBar } from "@/src/components/StudentSideBar";
import { TeacherSideBar } from "@/src/components/TeacherSideBar";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const ISSERVER = typeof window === "undefined";
  let userIs = "null";
  if (!ISSERVER) {
    userIs = localStorage.getItem("userIs") || "null";
  }

  if (userIs !== "null" && JSON.parse(userIs) === "teacher") {
    return (
      <SidebarProvider>
        <TeacherSideBar />
        <main className="flex flex-col h-screen w-screen relative bg-purple-950">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    );
  } else if (userIs !== "null" && JSON.parse(userIs) === "student") {
    return (
      <SidebarProvider>
        <StudentSideBar />
        <main className="flex flex-col h-screen w-screen bg-purple-950">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    );
  }
}
