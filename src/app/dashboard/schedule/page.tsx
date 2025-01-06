"use client";
import LectureCard from "@/src/components/LiveClasses";
import { classroomABI, classroomFactoryAbi, CONTRACT_ADDRESS } from "@/src/utils/constants";
import { ethers } from "ethers";
// import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
    interface LiveClass {
        id: string;
        title: string;
        description: string;
        // Add other relevant fields here
    }

    const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
    useEffect(() => {
        const fetchLiveClasses = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                    const signer = provider.getSigner();
                    const factoryContract = new ethers.Contract(CONTRACT_ADDRESS, classroomFactoryAbi, signer);
                    const arrayOfStudentContract = await factoryContract.getClassrooms();
                    arrayOfStudentContract.map(async (studentContract: string) => {
                        const ClassContract: ethers.Contract = new ethers.Contract(studentContract, classroomABI, signer);

                        console.log(await ClassContract.getActiveLiveClasses());
                        setLiveClasses(await ClassContract.getActiveLiveClasses());
                    })
                    // console.log(await factoryContract.LiveClass())
                } catch (error) {
                    alert("error fetching factory contract: " + error)
                }
            }
        }
        fetchLiveClasses()
    }, [])
    console.log("Live classes", liveClasses)
    return (
        <div className="pt-32">
            {liveClasses && liveClasses.map((classItem) => {
                return < LectureCard key={classItem.id} />
            })}

        </div>
    )
}

export default Page;