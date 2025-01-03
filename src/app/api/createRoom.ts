"use server";
export const createRoom = async () => {
    const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "ak_ahfxioeifeusrvlx"
        },
        body: JSON.stringify({
            title: "Huddle01 Room"
        }),
        cache: "no-cache"
    })
    const data = await response.json();
    const roomId = data.data.roomId;
    return roomId;
}