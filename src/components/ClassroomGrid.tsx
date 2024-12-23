import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { classroomFactoryAbi, CONTRACT_ADDRESS } from "../utils/constants";
import { ethers } from "ethers";
import { Button } from "./ui/button";

export default function ClassroomGrid() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const factoryAddress = CONTRACT_ADDRESS;

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      console.log("reached");
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();

      const factoryContract = new ethers.Contract(
        factoryAddress,
        classroomFactoryAbi,
        signer
      );
      const addresses = await factoryContract.getClassrooms();
      // const className = await factoryContract.
      setClassrooms(addresses);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {classrooms.map((classroom) => (
        <Card key={classroom} className="w-80">
          <CardContent className="p-4">
            <CardTitle className="text-xl mb-2">ClassRoom name</CardTitle>
            <p className="text-sm text-gray-500 mb-2 break-all flex flex-wrap">
              address: {classroom}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              by {"classroom.teacher"}
            </p>
            <Badge>{"category"}</Badge>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="text-sm text-gray-500">{"XXXX"} enrolled</span>
            <Button
              variant={"link"}
              onClick={() => router.push(`/dashboard/${classroom}`)}
            >
              View Class
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
