import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  classroomABI,
  classroomFactoryAbi,
  CONTRACT_ADDRESS,
} from "../utils/constants";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import { useAppKitAccount } from "@reown/appkit/react";
import { useStore } from "../store/store";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ClassroomDetail {
  name: string;
  symbol: string;
  price: string;
}

export default function ClassroomGrid() {
  const [classrooms, setClassrooms] = useState<string[]>([]);
  // const [classroomDetails, setClassroomDetails] = useState<
  //   Record<string, ClassroomDetail>
  // >({});

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;
  const { isConnected } = useAppKitAccount();

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
      console.log("This is address", addresses);
      setClassrooms(addresses);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Loading classrooms...</div>;
  }

  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {classrooms.length > 0 &&
        [...classrooms].reverse().map((classroom) => {
          const details = classroomDetails[classroom] || {
            name: "Loading...",
            teacher: "Loading...",
            enrolledCount: "...",
          };

          return (
            <Card key={classroom} className="w-80">
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{details.name}</CardTitle>
                <p className="text-sm text-gray-500 mb-2 break-all flex flex-wrap">
                  address: {classroom}
                </p>
                <Badge>{details.symbol}</Badge>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button
                  variant="link"
                  onClick={() => router.push(`/dashboard/${classroom}`)}
                >
                  View Class
                </Button>
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
}
