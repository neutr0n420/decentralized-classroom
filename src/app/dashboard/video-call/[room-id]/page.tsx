"use client"
import { Video, Mic } from "lucide-react";
import { useLocalVideo, useLocalAudio, useRoom } from "@huddle01/react"
import { useAccessStore } from "@/src/store/store";
import { useEffect, useRef } from "react";
const Page = () => {
    const { stream, enableVideo, disableVideo, isVideoOn } = useLocalVideo();
    const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
    const videoRef = useRef<HTMLVideoElement>(null);
    const setAccessToken = useAccessStore((state) => state.setAccessToken);
    useEffect(() => {
        console.log("stream", stream);
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setAccessToken("token")
    }, [stream]);
    return (
        <div className="text-white flex items-start justify-center my-20">
            <div className="w-1/2">
                <video ref={videoRef} autoPlay className="w-full border-2 rounded-xl border-purple-400" />
                <div className="flex justify-center mt-4">
                    <button className={`border rounded-full px-4 py-4 border-purple-400 ${isVideoOn ? "bg-blue-600" : "bg-red-600"}`} onClick={() => {
                        return isVideoOn ? disableVideo() : enableVideo();
                    }}> <Video size={36} /> </button>
                    <button className={`border rounded-full p-4 border-purple-400 ${isAudioOn ? "bg-blue-600" : "bg-red-600"}`} onClick={() => {
                        return isAudioOn ? disableAudio() : enableAudio();
                    }}><Mic size={36} /></button>
                </div>
            </div>

            <div className="flex-col ml-12 justify-evenly text-center mt-24">
                {/* <h1 className="text-4xl font-extrabold mb-6" onClick={ }>Ready to Join? </h1> */}
                <h4 className="my-4">No one else in here</h4>
                <button className="bg-gradient-to-r from-purple-400 px-16 to-pink-600 py-4 rounded-lg">join now</button>
            </div>
        </div>

    )
}
export default Page;