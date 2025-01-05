"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import ClassroomGrid from "@/src/components/ClassroomGrid";
import ClassroomSearch from "@/src/components/ClassroomSearch";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function ClassroomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <h1 className="text-4xl font-bold mb-8 pt-20 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Browse Classrooms
        </h1>
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <ClassroomSearch />
          <Suspense fallback={<ClassroomGridSkeleton />}>
            <ClassroomGrid />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}

function ClassroomGridSkeleton() {
  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col space-y-3"
        >
          <Skeleton className="h-[200px] w-full rounded-xl bg-gray-700" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
