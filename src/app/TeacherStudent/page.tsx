"use client";

import Link from "next/link";
import { GraduationCap, School } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4">
      <div className="w-full max-w-4xl">
        <motion.h1
          className="text-center text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Continue as:
        </motion.h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
