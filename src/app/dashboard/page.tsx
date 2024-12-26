"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const property = searchParams.get("userIs");
  console.log(property);
  if (property) {
    localStorage.setItem("userIs", JSON.stringify(property));
  }
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      page
    </div>
  );
};

export default Page;
