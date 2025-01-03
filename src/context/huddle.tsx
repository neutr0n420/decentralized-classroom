"use client"
import { HuddleClient as HuddleClientSDK, HuddleProvider } from "@huddle01/react";
import React from "react";

const HuddleClientComponent = ({ children }: { children: React.ReactNode }) => {
    const huddleClient = new HuddleClientSDK({
        projectId: "ak_ahfxioeifeusrvlx"
    });

    return (
        <HuddleProvider client={huddleClient}>
            {children}
        </HuddleProvider>
    );
}
export default HuddleClientComponent;