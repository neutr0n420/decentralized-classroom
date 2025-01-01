"use client";

import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export default function Home() {
  const { isConnected } = useAppKitAccount();
  console.log(isConnected);
  useEffect(() => {
    if (isConnected) {
      redirect("/TeacherStudent");
    }
  }, [isConnected]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Revolutionize Teaching with DeClassroom
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Create secure, decentralized classrooms and reward your
                  students with unique NFTs.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-800 text-purple-500"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-black bg-opacity-50"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center space-y-4 p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-lg"
              >
                <svg
                  className="w-12 h-12 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-xl font-medium text-white">
                  Decentralized Platform
                </h3>
                <p className="text-gray-300 text-center">
                  Create and manage classrooms on a secure, decentralized
                  network.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center space-y-4 p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-lg"
              >
                <svg
                  className="w-12 h-12 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-white">
                  Enhanced Security
                </h3>
                <p className="text-gray-300 text-center">
                  Protect your content and student data with blockchain
                  technology.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center space-y-4 p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-lg"
              >
                <svg
                  className="w-12 h-12 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-white">
                  NFT-Gated Classes
                </h3>
                <p className="text-gray-300 text-center">
                  Control access to your classes with unique NFT keys.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black to-purple-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-medium text-white">
                  Create a Classroom
                </h3>
                <p className="text-gray-300 text-center">
                  Set up your decentralized classroom and customize your
                  content.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-medium text-white">
                  Enroll Students
                </h3>
                <p className="text-gray-300 text-center">
                  Students receive unique NFTs for each class they enroll in.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-medium text-white">
                  Teach and Reward
                </h3>
                <p className="text-gray-300 text-center">
                  Conduct classes and reward student achievements with NFTs.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="for-teachers"
          className="w-full py-12 md:py-24 lg:py-32 bg-black bg-opacity-50"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-medium text-white mb-4">
                  For Teachers
                </h3>
                <p className="text-gray-300 mb-6">
                  DeClassroom empowers teachers with cutting-edge technology to
                  create engaging, secure, and rewarding learning experiences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create unlimited decentralized classrooms
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Control access with NFT-gated classes
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Reward students with unique NFTs
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-black bg-opacity-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose text-gray-300 md:text-left">
                © 2023 DeClassroom. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                className="text-gray-300 hover:text-white transition-colors"
                href="#"
              >
                Terms
              </Link>
              <Link
                className="text-gray-300 hover:text-white transition-colors"
                href="#"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
