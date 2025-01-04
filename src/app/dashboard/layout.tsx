"use client";
import { StudentSideBar } from "@/src/components/StudentSideBar";
import { TeacherSideBar } from "@/src/components/TeacherSideBar";
import { SidebarProvider } from "@/src/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const ISSERVER = typeof window === "undefined";
  let userIs = "null";
  if (!ISSERVER) {
    userIs = localStorage.getItem("userIs") || "null";
  }

  if (userIs !== "null" && JSON.parse(userIs) === "teacher") {
    return (
      <SidebarProvider open={true}>
        <TeacherSideBar />
        <main className="flex flex-col  w-screen relative bg-purple-950 ">
          {children}
        </main>
      </SidebarProvider>
    );
  } else if (userIs !== "null" && JSON.parse(userIs) === "student") {
    return (
      <SidebarProvider open={true}>
        <StudentSideBar />
        <main className="flex flex-col  w-screen bg-purple-950 ">
          {children}
        </main>
      </SidebarProvider>
    );
  }
}
