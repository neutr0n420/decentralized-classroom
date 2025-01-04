"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/src/components/ui/button";
import { classroomFactoryAbi, CONTRACT_ADDRESS } from "@/src/utils/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "lucide-react";

interface ClassroomInfo {
  classroomAddress: string;
  name: string;
  symbol: string;
  price: string;
  hasCompletionNFT: boolean;
}

export default function UserClassrooms() {
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<ClassroomInfo[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;
  const { isConnected, address } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && address) {
      fetchUserClassrooms();
    }
  }, [isConnected, address]);

  const fetchUserClassrooms = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("Please install a web3 wallet");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const factoryContract = new ethers.Contract(
        factoryAddress,
        classroomFactoryAbi,
        signer
      );

      // Get classroom details using the new function
      const classroomDetails = await factoryContract.getStudentClassroomDetails(
        address
      );

      // Transform the data
      interface RawClassroomDetails {
        classroomAddress: string;
        name: string;
        symbol: string;
        price: ethers.BigNumber;
        hasCompletionNFT: boolean;
      }

      const formattedClassrooms: ClassroomInfo[] = classroomDetails.map(
        (classroom: RawClassroomDetails) => ({
          classroomAddress: classroom.classroomAddress,
          name: classroom.name,
          symbol: classroom.symbol,
          price: ethers.utils.formatEther(classroom.price),
          hasCompletionNFT: classroom.hasCompletionNFT,
        })
      );

      setEnrolledClassrooms(formattedClassrooms);
    } catch (error) {
      console.error("Error fetching enrolled classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-6 text-purple-300">
        Loading your enrolled classrooms...
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-16 md:grid-cols-2 lg:grid-cols-3 mx-4">
      <div className="col-span-full text-2xl text-purple-300 text-bold">
        My Classes
      </div>
      {enrolledClassrooms.length > 0 ? (
        enrolledClassrooms.map((classroom, index) => (
          <motion.div
            key={classroom.classroomAddress}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700 text-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2 text-purple-300">
                  {classroom.name}
                </CardTitle>
                <p className="text-sm text-gray-400 mb-2 break-all flex flex-wrap">
                  address: {classroom.classroomAddress}
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-purple-600 text-white">
                    {classroom.symbol}
                  </Badge>
                  {classroom.hasCompletionNFT && (
                    <Badge className="bg-green-600 text-white">Completed</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() =>
                    router.push(`/dashboard/${classroom.classroomAddress}`)
                  }
                >
                  View Class
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400">
          You are not enrolled in any classes yet.
        </div>
      )}
    </div>
  );
}
