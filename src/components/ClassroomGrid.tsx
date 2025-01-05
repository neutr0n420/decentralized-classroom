"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { useStore } from "../store/store";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  classroomABI,
  classroomFactoryAbi,
  CONTRACT_ADDRESS,
} from "../utils/constants";
import { MultiStepLoader } from "./ui/multi-step-loader";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ClassroomDetail {
  name: string;
  symbol: string;
  price: string;
}

export default function ClassroomGrid() {
  const [classrooms, setClassrooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;
  const { isConnected } = useAppKitAccount();
  const [isOpeningClass, setIsOpeningClass] = useState(false);

  const classroomDetails = useStore((state) => state.classroomDetails);
  const setClassroomDetails = useStore((state) => state.setClassroomDetails);

  useEffect(() => {
    if (isConnected) {
      fetchClassrooms();
    }
  }, [isConnected]);

  useEffect(() => {
    if (classrooms.length > 0) {
      fetchAllClassroomDetails();
    }
  }, [classrooms]);

  const fetchClassroomDetails = async (classroomAddress: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install a web3 wallet");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const classroomContract = new ethers.Contract(
        classroomAddress,
        classroomABI,
        signer
      );
      console.log(classroomContract);
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

  const fetchAllClassroomDetails = async () => {
    const details: Record<string, ClassroomDetail> = {};
    const BATCH_SIZE = 1; //for ratelimiting
    const DELAY_MS = 1000;

    try {
      for (let i = classrooms.length - 1; i >= 0; i -= BATCH_SIZE) {
        const batch = classrooms.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
          batch.map(async (classroom) => {
            const result = await fetchClassroomDetails(classroom);
            return { classroom, result };
          })
        );

        batchResults.forEach(({ classroom, result }) => {
          details[classroom] = result;
        });

        setClassroomDetails({ ...details });

        if (i + BATCH_SIZE < classrooms.length) {
          await delay(DELAY_MS);
        }
      }
    } catch (error) {
      console.error("Error in batch processing:", error);
    }
  };

  const fetchClassrooms = async () => {
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
      console.log("Factory contract: ", factoryContract);
      const addresses = await factoryContract.getClassrooms();
      console.log("This is address", addresses);
      setClassrooms(addresses);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-6 text-purple-300">
        Loading classrooms...
      </div>
    );
  }

  const loadingStates = [
    {
      text: "Calling the RPC",
    },
    {
      text: "Querying the blockchain",
    },
    {
      text: "Parsing the data",
    },
  ];
  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isOpeningClass}
        duration={2000}
      />
      {classrooms.length > 0 &&
        [...classrooms].reverse().map((classroom, index) => {
          const details = classroomDetails[classroom] || {
            name: "Loading...",
            teacher: "Loading...",
            enrolledCount: "...",
          };

          return (
            <motion.div
              key={classroom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700 text-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2 text-purple-300">
                    {details.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mb-2 break-all flex flex-wrap">
                    address: {classroom}
                  </p>
                  <Badge className="bg-purple-600 text-white">
                    {details.symbol}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => {
                      setIsOpeningClass(true);
                      router.push(`/dashboard/${classroom}`);
                      setIsOpeningClass(false);
                    }}
                  >
                    View Class
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
    </div>
  );
}
