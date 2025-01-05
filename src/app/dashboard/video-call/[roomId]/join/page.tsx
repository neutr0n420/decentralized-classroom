'use client';
import RemotePeer from "@/src/components/RemotePeer";
import { useLocalAudio, useLocalVideo, usePeerIds, useLocalScreenShare, useRoom } from "@huddle01/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef } from "react";


const Join = () => {
    // console.log("accessToken", accessToken);
    const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
    const { enableAudio, isAudioOn, disableAudio } = useLocalAudio();
    const { state } = useRoom();
    const { startScreenShare, stopScreenShare, shareStream } =
        useLocalScreenShare();
    const { peerIds } = usePeerIds();
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { roomId } = useParams();
    useEffect(() => {
        router.push(`/dashboard/video-call/${roomId}`);
        // router.push(`/dashboard/video-call/${router.query.roomId}`);
    }, [state]);
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
                            {isVideoOn && (
                                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">
                                    <video
                                        ref={videoRef}
                                        className="aspect-video rounded-xl"
                                        autoPlay
                                        muted
                                    />

                                </div>

                            )}

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
            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                        if (isVideoOn) {
                            await disableVideo();
                        } else {
                            await enableVideo();
                        }
                    }}
                >
                    {isVideoOn ? "Disable Video" : "Enable Video"}
                </button>
                <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                        if (isAudioOn) {
                            await disableAudio();
                        } else {
                            await enableAudio();
                        }
                    }}
                >
                    {isAudioOn ? "Disable Audio" : "Enable Audio"}
                </button>
                <button
                    type="button"
                    className="bg-blue-500 p-2 mx-2 rounded-lg"
                    onClick={async () => {
                        if (shareStream) {
                            await stopScreenShare();
                        } else {
                            await startScreenShare();
                        }
                    }}
                >
                    {shareStream ? "Disable Screen" : "Enable Screen"}
                </button>
            </div>
            {/* <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                    const status = isRecording
                        ? await fetch(
                            `/api/stopRecording?roomId=${router.query.roomId}`
                        )
                        : await fetch(
                            `/api/startRecording?roomId=${router.query.roomId}`
                        );

                    const data = await status.json();
                    console.log({ data });
                    setIsRecording(!isRecording);
                }}
            > */}
            {/* {isRecording ? "Stop Recording" : "Start Recording"} */}
            {/* </button > */}
        </div>
    )
}
export default Join;