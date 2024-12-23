"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const property = searchParams.get("userIs");
  console.log(property)
  if (property) {
    localStorage.setItem('userIs', JSON.stringify(property))
  }
  return <div>page</div>;
};

export default Page;
