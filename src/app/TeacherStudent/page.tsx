"use client";

import Link from "next/link";
import { GraduationCap, School } from "lucide-react";
import { motion } from "framer-motion";
import { LampContainer } from "@/src/components/ui/lamp";

export default function TeacherOrStudent() {
  const items = [
    {
      title: "Teacher",
      url: "/dashboard/manage-classes?userIs=teacher",
      icon: School,
    },
    {
      title: "Student",
      url: "/dashboard/my-classes?userIs=student",
      icon: GraduationCap,
    },
  ];
  const ISSERVER = typeof window === "undefined";

  return (
    <div className="h-screen pt-32  flex flex-col justify-center items-center  text-white ">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-gray-900 via-purple-900 p-4 to-violet-900 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          <div className="w-full max-w-4xl">
            <div className="text-center text-4xl font-bold mb-12 text-purple-950 ">
              Continue as:
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              {items.map((item, index) => (
                <Link
                  key={index}
                  onClick={() => {
                    if (!ISSERVER) {
                      const user: string = item.title.toLowerCase();
                      localStorage.setItem("userIs", JSON.stringify(user));
                    }
                  }}
                  href={item.url}
                  className="block"
                >
                  <div className="w-64 h-64 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center p-6 group">
                    <div className="mb-6 text-purple-400 group-hover:text-pink-500 transition-colors duration-300">
                      <item.icon size={64} />
                    </div>
                    <h2 className="text-2xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          </div>{" "}
        </motion.div>
      </LampContainer>
    </div>
  );
}
