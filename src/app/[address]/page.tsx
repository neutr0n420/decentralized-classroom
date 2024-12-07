"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { classroomABI } from "../../utils/constants";

const ClassroomPage = ({ params }: { params: { address: string } }) => {
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [classroomSymbol, setClassroomSymbol] = useState("");

  useEffect(() => {
    fetchClassroomDetails();
    fetchMaterials();
  }, []);

  const fetchClassroomDetails = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const classroomContract = new ethers.Contract(
        params.address,
        classroomABI,
        provider
      );
      try {
        const name = await classroomContract.name();
        const symbol = await classroomContract.symbol();
        setClassroomName(name);
        setClassroomSymbol(symbol);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    }
  };

  const fetchMaterials = async () => {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const classroomContract = new ethers.Contract(
          params.address,
          classroomABI,
          provider
        );
        const materials = await classroomContract.getMaterials();
        setMaterials(materials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addMaterial = async () => {
    if (!newMaterial) {
      alert("Please enter an IPFS hash");
      return;
    }

    setAddingMaterial(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const classroomContract = new ethers.Contract(
          params.address,
          classroomABI,
          signer
        );

        const tx = await classroomContract.addMaterial(newMaterial);
        await tx.wait();
        setNewMaterial("");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Error adding material. Please try again.");
    } finally {
      setAddingMaterial(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {classroomName || "Loading..."} ({classroomSymbol})
          </h1>
          <p className="text-gray-400 break-all">
            Contract Address: {params.address}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 mb-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold mb-4">Add New Material</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter IPFS Hash"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
              />
              <button
                onClick={addMaterial}
                disabled={addingMaterial}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addingMaterial ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
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
                    Adding...
                  </>
                ) : (
                  "Add Material"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Course Materials</h2>
            <button
              onClick={fetchMaterials}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center gap-2"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {materials.length > 0 ? (
            <div className="space-y-4">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 break-all">
                      Material #{index + 1}
                    </span>
                    <a
                      href={`https://ipfs.io/ipfs/${material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      View on IPFS
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 break-all">
                    {material}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-700/50 rounded-lg">
              <p className="text-gray-400">
                {loading
                  ? "Loading materials..."
                  : "No materials added to this classroom yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
