"use client";
import Link from "next/link";
import { GraduationCap, School } from "lucide-react";
export default function TeacherOrStudent() {
    const items = [
        {
            title: "Teacher",
            url: "/dashboard?userIs=teacher",
            icon: School
        },
        {
            title: "Student",
            url: "/dashboard?userIs=student",
            icon: GraduationCap
        }
    ]
    return (
        <>
            <div className="pt-96">
                <h1 className="text-center text-2xl font-semibold">Continue as: </h1>
                <div className="flex justify-center items-center ">
                    {items.map((item) => (
                        <Link href={item.url} key={item.title}>
                            <div className="w-36 bg-gray-300 text-center flex flex-col items-center py-16 px-24 rounded-lg mr-8" >
                                <item.icon size={48} />
                                {item.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}