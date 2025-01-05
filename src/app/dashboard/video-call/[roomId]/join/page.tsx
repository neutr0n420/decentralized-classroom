'use client';
import RemotePeer from "@/src/components/RemotePeer";
import { useLocalAudio, useLocalVideo, usePeerIds, useLocalScreenShare, useRoom } from "@huddle01/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Mic, Video, ScreenShare, PhoneMissed } from "lucide-react";
import { useRouter, useParams } from "next/navigation";


import { useEffect, useRef } from "react";


const Join = () => {
    // console.log("accessToken", accessToken);
    const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
    const { enableAudio, isAudioOn, disableAudio } = useLocalAudio();
    const { state } = useRoom();
    const { address } = useAppKitAccount();
    const { startScreenShare, stopScreenShare, shareStream } =
        useLocalScreenShare();
    const { peerIds } = usePeerIds();
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { roomId } = useParams();
    const accessToken = JSON.stringify(localStorage.getItem("teacher-access-token"));
    console.log("Access token", accessToken)
    useEffect(() => {
        console.log("join");
        if (state === "idle" || state === "failed" || state === "closed" || state === "left") {
            console.log(state)
            router.push(`/dashboard/video-call/${roomId}`);
        }
        // router.push(`/dashboard/video-call/${router.query.roomId}`);
    }, [state]);
    console.log("state", state);
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    // share screen implementation
    useEffect(() => {
        if (shareStream && screenRef.current) {
            screenRef.current.srcObject = shareStream;
        }
    }, [shareStream]);
    console.log("peerIds", peerIds);
    return (
        <div className="text-white pt-16">



            <div className="w-full mt-8 flex gap-4 justify-between items-stretch">
                <div className="flex-1 justify-between items-center flex flex-col">
                    <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                        <div className="relative flex gap-2">
                            {isVideoOn ? (
                                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">

                                    <video
                                        ref={videoRef}
                                        className="aspect-video rounded-xl"
                                        autoPlay
                                        muted
                                    />

                                </div>

                            ) : (
                                <div className="mx-auto px-16 py-48 border-2 text-center rounded-xl border-blue-400">
                                    <div className="bg rounded-xl  ">{address} <br /> you</div>
                                </div>
                            )
                            }


                            {shareStream && (
                                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">
                                    <video
                                        ref={screenRef}
                                        className="aspect-video rounded-xl"
                                        autoPlay
                                        muted
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="mt-8 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                        {peerIds.map((peerId) =>
                            peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
                        )}
                    </div>
                </div>

                {/* {state === "connected" && <ChatBox />} */}
            </div>
            <div className="flex justify-center ">
                <button className={`border mx-4 rounded-full px-4 py-4 border-purple-400 ${isVideoOn ? "bg-blue-600" : "bg-red-600"}`} onClick={() => {
                    return isVideoOn ? disableVideo() : enableVideo();
                }}> <Video size={36} /> </button>
                <button className={`border rounded-full mx-4 p-4 border-purple-400 ${isAudioOn ? "bg-blue-600" : "bg-red-600"}`} onClick={() => {
                    return isAudioOn ? disableAudio() : enableAudio();
                }}><Mic size={36} /></button>
                <button className={`border rounded-full mx-4 p-4 border-purple-400 ${shareStream ? "bg-blue-600" : "bg-red-600"}`} onClick={async () => {
                    return shareStream ? await stopScreenShare() : await startScreenShare();
                }}><ScreenShare size={36} /></button>
                <button className="border rounded-full mx-4 p-4 border-purple-400 bg-red-600" onClick={async () => router.push('/dashboard/manage-classes')}><PhoneMissed size={36} /></button>
            </div>


            <div className="ml-[500px] t-[600px]  ">

            </div>
        </div >
    )
}
export default Join;