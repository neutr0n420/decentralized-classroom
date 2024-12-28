"use client";
import React from "react";

const Page = () => {
  const user = localStorage.getItem("userIs") || "null";
  console.log(user);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      page
    </div>
  );
};

export default Page;
