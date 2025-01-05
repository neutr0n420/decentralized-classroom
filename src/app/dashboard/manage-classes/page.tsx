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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Classroom {
  address: string;
  name: string;
  symbol: string;
  price: string;
}

export default function ManageClasses() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          console.log("This is teacher classes", teacherClasses);
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
      console.log("This is classroom contract", classroomContract);
      // console.log("This is classroom contract's material", await classroomContract.viewMaterials());
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
          // materials: await classroomContract.viewMaterials(),
        });
      }
    }

    return teacherClasses;
  }

  const handleCreateClick = () => {
    console.log("Create new class clicked");
    router.push("/dashboard/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text pt-12 text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Manage Your Classes
          </h1>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white z-50">
            <Plus className="mr-2 h-4 w-4" onClick={handleCreateClick} /> Create
            New Class
          </Button>
        </motion.div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : classes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {classes.map(
              (classroom, index) => (
                console.log("This is classroom", classroom),
                (
                  <motion.div
                    key={classroom.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ClassroomCard classroom={classroom} />
                  </motion.div>
                )
              )
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800 bg-opacity-50 text-white border-purple-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">
                  No Classes Found
                </CardTitle>
                <CardDescription className="text-gray-300">
                  You have not created any classes yet.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Link href="/dashboard/create">Create Your First Class</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
