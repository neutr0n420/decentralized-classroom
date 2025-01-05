"use client"
import { createRoom } from "@/src/app/api/createRoom";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const App = () => {
    const router = useRouter();
    const roomCreate = async () => {
        const roomId = await createRoom();
        const { push } = router;
        push(`/dashboard/video-call/${roomId}`);

    }

    return (
        <div className="text-white text-center mt-32">
            <p className="text-lg bg-gradient-to-r from-purple-400 bg-clip-text text-transparent to-pink-600"> Create a new room</p>
            <button onClick={() => roomCreate()} className="inline"> <Plus />New Room</button>
        </div>



    );
}
export default App;