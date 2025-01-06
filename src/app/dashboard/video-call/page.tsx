"use client";
import { createRoom } from "@/src/app/api/createRoom";
import { useRouter } from "next/navigation";
import { BookOpen, Hourglass, Loader2, Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { MultiStepLoader } from "@/src/components/ui/multi-step-loader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { ethers } from "ethers";
import { FactoryContractInstance } from "@/src/utils/contractFunction";
import { classroomABI } from "@/src/utils/constants";
import { DateTimePicker } from "@/src/components/DateTimePicker";
import { dateTimeToNumeric } from "@/src/lib/utils";
// import { Plus } from "lucide-react";

const App = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const loadingStates = [
        {
            text: "Calling the RPC",
        },
        {
            text: "Querying the blockchain",
        },
        {
            text: "Creating your room",
        },
    ];
    const [className, setClassName] = useState("");
    const [timeDate, setTimeDate] = useState<string | undefined>(undefined);
    const [duration, setDuration] = useState("");
    const [contractAddress, setContractAddress] = useState<string[]>([]);
    const domain = window.location.origin
    console.log(domain)
    useEffect(() => {
        FactoryContractInstance().then((res) => {
            setContractAddress(res?.classroomAddresses)
        })
    }, [])
    console.log(timeDate)
    const roomCreate = async () => {
        if (!window.ethereum) {
            console.error("Ethereum provider not found");
            setLoading(false);
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        const contractOwner = await signer.getAddress();
        console.log(1)
        contractAddress.map(async (classAddress) => {
            console.log(2)
            const classroomContract = new ethers.Contract(classAddress, classroomABI, signer);
            console.log(await classroomContract.owner())
            if (!timeDate) {
                console.error("Time and Date of the class is not set");
                return;
            }
            const dateInNumeric = dateTimeToNumeric(timeDate);
            if (contractOwner === await classroomContract.owner()) {
                setLoading(true);
                console.log(3)
                const roomId = await createRoom();
                const { push } = router;
                console.log("classname", className);
                console.log("time duration", dateInNumeric);
                console.log("duration", duration);
                push(`/dashboard/video-call/${roomId}`);
                const tx = await classroomContract.scheduleLiveClass(`${domain}/dashboard/video-call/${roomId}`, className, dateInNumeric, duration);
                console.log(tx)
                console.log(classroomContract)
                setLoading(false);
            }
            // else {
            //     alert("Please Create classroom first to access this feature")
            //     router.push('/dashboard/create')
            // }
        })

    };

    return (
        <>

            <div className="text-white w-1/2 mx-auto mt-32">
                <MultiStepLoader
                    loadingStates={loadingStates}
                    loading={loading}
                    duration={2000}
                />
                {/* 
            1. Meeting url
            2. topic
            3. start time
            4. duration
            */}
                <p className="text-6xl font-semibold py-8 bg-gradient-to-r from-purple-400 bg-clip-text text-transparent to-pink-600">
                    {" "}
                    Create New Class
                </p>
                <Card className="bg-gray-800 border-gray-700 text-white shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Create new lecture
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-center">
                            Set up your decentralized learning environment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">
                                Class Name
                            </Label>
                            <div className="relative">
                                <BookOpen
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <Input
                                    id="name"
                                    required
                                    onChange={e => setClassName(e.target.value)}
                                    placeholder="e.g., Advanced Blockchain Development"
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="symbol" className="text-gray-300">
                                Time & Date of the class
                            </Label>

                            <DateTimePicker onDateChange={e => setTimeDate(e ? e.toISOString() : undefined)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-gray-300">
                                Duration of Class
                            </Label>
                            <div className="relative">
                                <Hourglass
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <Input
                                    id="price"
                                    onChange={e => setDuration(e.target.value)}
                                    required
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 1"
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
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            onClick={() => roomCreate()}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus />
                                    New Room
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>


        </>
    );
};
export default App;
