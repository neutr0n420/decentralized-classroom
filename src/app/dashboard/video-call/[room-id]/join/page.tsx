'use client';
import { useAccessStore } from "@/src/store/store";
const Join = () => {
    const accessToken = useAccessStore((state) => state.accessToken);
    console.log("accessToken", accessToken);
    return (
        <div>Join page</div>
    )
}
export default Join;