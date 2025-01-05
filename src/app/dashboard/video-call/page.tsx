"use client";
import { createRoom } from "@/src/app/api/createRoom";
import { useRouter } from "next/navigation";
// import { BookOpen, Calendar, Hourglass, Loader2, Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { MultiStepLoader } from "@/src/components/ui/multi-step-loader";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
// import { Label } from "@/src/components/ui/label";
// import { Input } from "@/src/components/ui/input";
import { ethers } from "ethers";
import { FactoryContractInstance } from "@/src/utils/contractFunction";
import { classroomABI } from "@/src/utils/constants";
import { Plus } from "lucide-react";

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
    // const { joinRoom, state } = useRoom({
    //     onJoin: () => {
    //         console.log("Joined Room");
    //     },
    //     onLeave: () => {
    //         console.log("Left Room");
    //     }
    // });
    // const [className, setClassName] = useState("");
    // const [timeDate, setTimeDate] = useState("");
    // const [duration, setDuration] = useState("");
    const [contractAddress, setContractAddress] = useState<string[]>([]);

    useEffect(() => {
        FactoryContractInstance().then((res) => {
            setContractAddress(res?.classroomAddresses)
        })
    }, [])
    const roomCreate = async () => {
        if (!window.ethereum) {
            console.error("Ethereum provider not found");
            setLoading(false);
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        const contractOwner = await signer.getAddress();
        contractAddress.map(async (classAddress) => {
            const classroomContract = new ethers.Contract(classAddress, classroomABI, signer);
            if (contractOwner.toLowerCase() === classroomContract.owner()) {

            }
        })
        setLoading(true);
        const roomId = await createRoom();
        const { push } = router;
        push(`/dashboard/video-call/${roomId}`);
        setLoading(false);
    };
    // const { stream, enableVideo, disableVideo, isVideoOn } = useLocalVideo();
    // const handleClick = async () => {
    //     console.log("Creating Room");
    //     const roomId = await createRoom();
    //     console.log(roomId);
    // }
    // const videoRef = useRef<HTMLVideoElement>(null);
    // console.log("stream", stream);
    // useEffect(() => {
    //     if (stream && videoRef.current) {
    //         videoRef.current.srcObject = stream;
    //     }
    // }, [stream]);
    return (
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
            {/* <Card className="bg-gray-800 border-gray-700 text-white shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Create a new class
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
                                onChange={e => setClassName(e.target.name)}
                                placeholder="e.g., Advanced Blockchain Development"
                                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="symbol" className="text-gray-300">
                            Time & Date of the class
                        </Label>
                        <div className="relative">
                            <Calendar
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                size={18}
                            />
                            <Input
                                id="symbol"
                                onChange={e => setTimeDate(e.target.name)}
                                placeholder="1/1/2025 12:12pm"
                                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
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
            </Card> */}

            <Button
                onClick={() => roomCreate()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
                {" "}
                <Plus />
                New Room
            </Button>
        </div>

        // <div className="text-white">
        //     <h1>Video Call</h1>
        //     <button onClick={() => {
        //         joinRoom({
        //             roomId: "ubf-adsb-oru",
        //             token: "eyJhbGciOiJSUzI1NiJ9.eyJwZWVySWQiOiJwZWVySWQtWTBTcm1hcTJJQnROZkZzSGFyM1U5IiwicHVycG9zZSI6IlNESyIsInJvb21JbmZvIjp7InJvb21UeXBlIjoiVklERU8iLCJyb29tTG9ja2VkIjpmYWxzZSwibXV0ZU9uRW50cnkiOmZhbHNlLCJ2aWRlb09uRW50cnkiOmZhbHNlfSwicm9vbUlkIjoidWJmLWFkc2Itb3J1IiwibXV0ZU9uRW50cnkiOmZhbHNlLCJ2aWRlb09uRW50cnkiOmZhbHNlLCJyb29tVHlwZSI6IlZJREVPIiwicm9sZSI6Imhvc3QiLCJwZXJtaXNzaW9ucyI6eyJhZG1pbiI6dHJ1ZSwiY2FuQ29uc3VtZSI6dHJ1ZSwiY2FuUHJvZHVjZSI6dHJ1ZSwiY2FuUHJvZHVjZVNvdXJjZXMiOnsiY2FtIjp0cnVlLCJtaWMiOnRydWUsInNjcmVlbiI6dHJ1ZX0sImNhblNlbmREYXRhIjp0cnVlLCJjYW5SZWN2RGF0YSI6dHJ1ZSwiY2FuVXBkYXRlTWV0YWRhdGEiOnRydWV9LCJpYXQiOjE3MzU4OTM3OTEsImlzcyI6Ikh1ZGRsZTAxIiwiZXhwIjoxNzM1OTA0NTkxfQ.eBOMEDMV-6wPL7zulgNO8__ahKtzv5KkYfuoFChVbNcGZ4kYDtaPXueW683J_meGH2NYpn0VbQWhZ_ii5hQBFFEk39GmEYyNbIss012jWod9irp9plgQ3gdOXpDRG46_yaDqF97owAz_-VwnhNhiOLHNourZUOAIDWnTJMxPs4PuPvVFctoYOFLh4SmwBekUZyncbMw65zyfCsFdiwsLLIIQLfWlRnVE8Nymncd9UsFBuTGn6FZqgYOHqdcN-XRJfbXtRWN5WLUzXBoeWQCC-IUQJM6HXq6--9TZHVO7OCQzAopr_Eb0HHJMpLHnXPyJDdpQmmVjd2bTWYVOt5NQqeKD3WL4squu8GMcfJW6AnyNECtcL_-l0-2EtMhZprtkkdn9xDIHzQ5Yijb3K8wXs378CLTDNNLfuUvbrcyvMvE97oSvnrlZs2MpECIQVKTMmUsXGeXxb9PNiqalBS4ey-QuRNDXrs7-zOzwaZvpb5_t2MYxc7ur92ea6nECdcjiBojWgcmrhboakFp0952Or9sCT-uRlRZqQjilP_2MyTFrl6n15hS2iF6t2kz_ZqzHcPUUbhpeCdiY0gBbYj-cUs-n4rNAukaHxusFx97L051J-AuVBcEiek5hKW4cJr6CHysTyWMQg8IMaoOUvuuImNf8XsrJqgFE3U5Y3eh95ZI"
        //         })

        //     }}>Join Room</button>
        //     <div>Current State: {state}</div>
        //     <button onClick={() => {
        //         return isVideoOn ? disableVideo() : enableVideo();
        //     }}> Check video</button>

        //     <video ref={videoRef} autoPlay className="w-1/2 mx-auto border-2 rounded-xl border-blue-400" />
        // </div>
    );
};
export default App;
