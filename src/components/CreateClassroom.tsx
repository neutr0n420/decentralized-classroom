"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, Coins, Tag } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { classroomFactoryAbi, CONTRACT_ADDRESS } from "../utils/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CreateClassroom() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;

  const { address, isConnected } = useAppKitAccount();

  const createClassroom = async () => {
    if (!name || !symbol || !price) {
      alert("Please fill in all fields");
      return;
    }

    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }

    if (!address) {
      alert("Wallet address is not available.");
      return;
    }

    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("Please install a web3 wallet");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("Signer address:", await signer.getAddress());
      const factoryContract = new ethers.Contract(
        factoryAddress,
        classroomFactoryAbi,
        signer
      );

      console.log({
        name,
        symbol,
        price,
        ethers: ethers.utils.parseEther(price),
      });

      const tx = await factoryContract.createClassroom(
        name,
        symbol,
        ethers.utils.parseEther(price)
      );
      console.log("Transaction hash:", tx.hash);
      await tx.wait();

      alert("Classroom created successfully!");
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Error creating classroom. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-gray-800 border-gray-700 text-white shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Create New Classroom
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Set up your decentralized learning environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Classroom Name
              </Label>
              <div className="relative">
                <BookOpen
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="name"
                  placeholder="e.g., Advanced Blockchain Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-gray-300">
                Symbol
              </Label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="symbol"
                  placeholder="e.g., BCD101"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300">
                Price (ETH)
              </Label>
              <div className="relative">
                <Coins
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="price"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 0.1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={createClassroom}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Classroom"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
