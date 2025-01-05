"use client";
import { createRoom } from "@/src/app/api/createRoom";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { MultiStepLoader } from "@/src/components/ui/multi-step-loader";

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
  const roomCreate = async () => {
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
    <div className="text-white text-center mt-32">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={2000}
      />
      <p className="text-6xl font-semibold py-8 bg-gradient-to-r from-purple-400 bg-clip-text text-transparent to-pink-600">
        {" "}
        Create a new room
      </p>
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
