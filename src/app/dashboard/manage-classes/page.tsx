"use client";

import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import {
  classroomABI,
  classroomFactoryAbi,
  CONTRACT_ADDRESS,
} from "@/src/utils/constants";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import ClassroomCard from "@/src/components/ClassroomCard";

interface Classroom {
  address: string;
  name: string;
  symbol: string;
  price: string;
  materials: string[];
}

export default function ManageClasses() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(
            window.ethereum as ethers.providers.ExternalProvider
          );
          const signer = provider.getSigner();
          const teacherAddress = await signer.getAddress();
          const teacherClasses = await getTeacherClasses(
            provider,
            teacherAddress
          );
          setClasses(teacherClasses);
        } catch (error) {
          console.error("Error fetching classes:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Ethereum object not found");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  async function getTeacherClasses(
    provider: ethers.providers.Provider,
    teacherAddress: string
  ) {
    const factoryContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      classroomFactoryAbi,
      provider
    );

    const classroomAddresses = await factoryContract.getClassrooms();

    const teacherClasses = [];

    for (const classroomAddress of classroomAddresses) {
      const classroomContract = new ethers.Contract(
        classroomAddress,
        classroomABI,
        provider
      );

      const owner = await classroomContract.owner();

      if (owner.toLowerCase() === teacherAddress.toLowerCase()) {
        const name = await classroomContract.name();
        const symbol = await classroomContract.symbol();
        const price = await classroomContract.nftPrice();

        teacherClasses.push({
          address: classroomAddress,
          name,
          symbol,
          price: utils.formatEther(price),
          materials: await classroomContract.viewMaterials(),
        });
      }
    }

    return teacherClasses;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Your Classes</h1>
        <Button asChild>
          <Link href="/dashboard/create-class">
            <Plus className="mr-2 h-4 w-4" /> Create New Class
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : classes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classroom) => (
            <ClassroomCard key={classroom.address} classroom={classroom} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Classes Found</CardTitle>
            <CardDescription>
              You haven't created any classes yet.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/create-class">
                Create Your First Class
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
