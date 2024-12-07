"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { classroomFactoryAbi } from "../utils/constants";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { useRouter } from "next/navigation";

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;

  useEffect(() => {
    const loadProvider = async () => {
      if (typeof window.ethereum !== "undefined") {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);
      }
    };
    loadProvider();
  }, []);

  const fetchClassrooms = async () => {
    if (!provider) return;
    setLoading(true);
    try {
      const factoryContract = new ethers.Contract(
        factoryAddress,
        classroomFactoryAbi,
        provider
      );
      const addresses = await factoryContract.getClassrooms();
      setClassrooms(addresses);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Decentralized Classroom
          </h1>
          <p className="text-gray-400 text-lg">
            A blockchain-powered platform for modern education
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={fetchClassrooms}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Load Classrooms"
            )}
          </button>

          <button
            onClick={() => router.push("/create")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors duration-200"
          >
            Create New Classroom
          </button>
        </div>

        {classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((address, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Classroom #{index + 1}
                </h3>
                <p className="text-gray-400 text-sm mb-4 break-all">
                  {address}
                </p>
                <button
                  onClick={() => router.push(`/${address}`)}
                  className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors duration-200"
                >
                  View Classroom
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl">
            <p className="text-gray-400">
              {loading
                ? "Loading classrooms..."
                : "No classrooms found. Create one to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
