'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

import { Video, Clock, Hash } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';


const LectureCard = ({ data }) => {
    console.log(data)
    // console.log("data reached to the component", classItem)
    // // Convert hex to decimal
    // const timestampValue = parseInt(timestamp, 16);
    // const indexValue = parseInt(index, 16);

    // // Convert timestamp to readable format (assuming it's in milliseconds)
    // const date = new Date(timestampValue);
    // const formattedDate = date.toLocaleString();
    // // console.log(url[0])
    // // console.log(title)
    const isActive = true;

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="truncate">Advance blockchain lecture 01</span>
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm truncate">http://localhost:3000/dashboard/video-call/laz-gdge-yqj</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">6/1/25 2:28AM</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <span className="text-sm">Lecture #{1}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="http://localhost:3000/dashboard/video-call/laz-gdge-yqj">
                        Join Video Call
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LectureCard;

