"use client";

import { useState, useEffect, use } from "react";
import { ethers } from "ethers";
import { classroomABI } from "../../../utils/constants";
import { Web3Error } from "@/src/types/errors";
import { useAppKitAccount } from "@reown/appkit/react";
import { Badge } from "@/src/components/ui/badge";
import ClassroomPurchase from "@/src/components/ClassroomPurchase";
import ClassroomMaterials from "@/src/components/ClassroomMaterials";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import { motion } from "framer-motion";

interface PageProps {
  params: Promise<{
    address: string;
  }>;
}

export type EthereumProviderType = ExternalProvider & {
  request: JsonRpcFetchFunc;
  selectedAddress?: string;
  isMetaMask?: boolean;
};

const ClassroomPage = ({ params }: PageProps) => {
  const { address } = use(params);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [classroomSymbol, setClassroomSymbol] = useState("");
  const [classroomPrice, setClassroomPrice] = useState("");
  const { address: userAddress } = useAppKitAccount();

  useEffect(() => {
    fetchClassroomDetails(address).then((details) => {
      setClassroomName(details.name);
      setClassroomSymbol(details.symbol);
      setClassroomPrice(details.price);
    });
    fetchMaterials();
  }, [address]);

  const fetchClassroomDetails = async (classroomAddress: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as EthereumProviderType
      );
      const signer = provider.getSigner();
      const classroomContract = new ethers.Contract(
        classroomAddress,
        classroomABI,
        signer
      );
      const name = await classroomContract.name();
      const symbol = await classroomContract.symbol();
      const price = await classroomContract.nftPrice();

      return {
        name,
        symbol,
        price: ethers.utils.formatEther(price),
      };
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      return {
        name: "Unnamed Classroom",
        symbol: "???",
        price: "0",
      };
    }
  };

  const fetchMaterials = async () => {
    if (address) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as EthereumProviderType
        );
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const classroomContract = new ethers.Contract(
          address,
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
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  };

  const addMaterial = async () => {
    if (!newMaterial) {
      alert("Please enter an IPFS hash");
      return;
    }

    setAddingMaterial(true);
    try {
      if (userAddress) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as EthereumProviderType
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
          window.ethereum as unknown as EthereumProviderType
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-8 md:grid-cols-[3fr_1fr]"
        >
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-lg">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {classroomName}
            </h1>
            <Badge className="bg-purple-600 text-white">
              {classroomSymbol}
            </Badge>
            <p className="mt-4 text-gray-300">Address: {address}</p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                Course Materials
              </h2>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Enter IPFS Hash"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className="bg-gray-700 text-white border-purple-500"
                />
                <Button
                  onClick={addMaterial}
                  disabled={addingMaterial}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
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
                </Button>
              </div>
              <ClassroomMaterials materials={materials} />
            </div>
          </div>
          <div>
            <ClassroomPurchase
              price={classroomPrice.toString()}
              id={address}
              title={classroomName}
              symbol={classroomSymbol}
              buyAccess={buyAccess}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassroomPage;
