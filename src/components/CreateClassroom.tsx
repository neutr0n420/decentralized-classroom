"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { classroomFactoryAbi, CONTRACT_ADDRESS } from "../utils/constants";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAppKitAccount } from "@reown/appkit/react";

// Import the hook from AppKit

export default function CreateClassroom() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;

  // Use the hook to get the wallet address and connection status
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Classroom</CardTitle>
          <CardDescription>
            Set up your decentralized learning environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Classroom Name</Label>
            <Input
              id="name"
              placeholder="e.g., Advanced Blockchain Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g., BCD101"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              placeholder="e.g., 0.1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button onClick={createClassroom} disabled={loading}>
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
    </div>
  );
}
