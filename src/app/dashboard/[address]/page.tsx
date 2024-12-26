"use client";

import { useState, useEffect, use } from "react";
import { ethers } from "ethers";
import { classroomABI } from "../../../utils/constants";
import { Web3Error } from "@/src/types/errors";
import { useAppKitAccount } from "@reown/appkit/react";
import { Badge } from "@/src/components/ui/badge";
import ClassroomPurchase from "@/src/components/ClassroomPurchase";
import ClassroomMaterials from "@/src/components/ClassroomMaterials";

interface PageProps {
  params: Promise<{
    Walletaddress: string;
  }>;
}

const ClassroomPage = ({ params }: PageProps) => {
  const { classroomAddress } = use(params);


  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [classroomSymbol, setClassroomSymbol] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, [classroomAddress]);

 

  const fetchMaterials = async () => {
    if (classroomAddress) {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        const classroomContract = new ethers.Contract(
          classroomAddress,
          classroomABI,
          signer
        );

        const balance = await classroomContract.balanceOf(userAddress);

        if (balance.toNumber() === 0) {
          const price = await classroomContract.nftPrice();
          const buyAccess = await classroomContract.buyAccess({ value: price });
          await buyAccess.wait();
        }

        const materials = await classroomContract.viewMaterials();
        setMaterials(Array.isArray(materials) ? materials : []);
      } catch (error: unknown) {
        console.error("Error fetching materials:", error);
        if (error && typeof error === "object" && "code" in error) {
          const web3Error = error as Web3Error;
          if (web3Error.code === 4001) {
            alert("Please connect your wallet to view materials");
          } else if (web3Error.code === -32000) {
            alert(
              "You need to purchase access to view materials. Please buy access first."
            );
          }
        } else {
          alert(
            "Error loading materials. Please make sure you have purchased access."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  };

  // addMaterial function
  const addMaterial = async () => {
    if (!newMaterial) {
      alert("Please enter an IPFS hash");
      return;
    }

    setAddingMaterial(true);
    try {
      if (primaryWallet) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const signer = provider.getSigner();
        const classroomContract = new ethers.Contract(
          address,
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

  const buyAccess = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const signer = provider.getSigner();
        const classroomContract = new ethers.Contract(
          address,
          classroomABI,
          signer
        );

        const price = await classroomContract.nftPrice();
        const tx = await classroomContract.buyAccess({ value: price });
        await tx.wait();
        alert("Access purchased successfully!");
        fetchMaterials();
      } catch (error) {
        console.error("Error buying access:", error);
        alert("Error purchasing access. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[3fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold mt-6 mb-2">Classroom title</h1>
          <p className="text-gray-600 mb-4">by xxxxxx</p>
          <Badge>category</Badge>
          <p className="mt-4 text-gray-700">address: {address}</p>

          <p className="mt-4 text-gray-700">description</p>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Course Materials</h2>
            <ClassroomMaterials materials={materials} />
          </div>
        </div>
        <div>
          <ClassroomPurchase
            id={address}
            title={classroomName}
            symbol={classroomSymbol}
            buyAccess={buyAccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
// <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4">
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
//           {classroomName || "Loading..."} ({classroomSymbol})
//         </h1>
//         <p className="text-gray-400 break-all">Contract Address: {address}</p>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Course Access</h2>
//           <button
//             onClick={buyAccess}
//             className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors duration-200"
//           >
//             Buy Access
//           </button>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 mb-8">
//         <div className="flex flex-col space-y-4">
//           <h2 className="text-xl font-semibold mb-4">Add New Material</h2>
//           <div className="flex gap-4">
//             <input
//               type="text"
//               placeholder="Enter IPFS Hash"
//               value={newMaterial}
//               onChange={(e) => setNewMaterial(e.target.value)}
//               className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400"
//             />
//             <button
//               onClick={addMaterial}
//               disabled={addingMaterial}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//             >
//               {addingMaterial ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     />
//                   </svg>
//                   Adding...
//                 </>
//               ) : (
//                 "Add Material"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Course Materials</h2>
//           <button
//             onClick={fetchMaterials}
//             disabled={loading}
//             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center gap-2"
//           >
//             <svg
//               className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//               />
//             </svg>
//             Refresh
//           </button>
//         </div>

//         {materials.length > 0 ? (
//           <div className="space-y-4">
//             {materials.map((material, index) => (
//               <div
//                 key={index}
//                 className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300 break-all">
//                     Material #{index + 1}
//                   </span>
//                   <a
//                     href={`https://ipfs.io/ipfs/${material}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
//                   >
//                     View on IPFS
//                   </a>
//                 </div>
//                 <p className="text-gray-400 text-sm mt-2 break-all">
//                   {material}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-700/50 rounded-lg">
//             <p className="text-gray-400">
//               {loading
//                 ? "Loading materials..."
//                 : "No materials added to this classroom yet."}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
