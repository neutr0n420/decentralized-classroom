"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { classroomABI } from "../utils/constants";

interface ClassroomPurchaseProps {
  id: string;
  title: string;
  symbol: string;
  buyAccess: () => void;
}

export default function ClassroomPurchase({
  id,
  title,
  symbol,
  buyAccess,
}: ClassroomPurchaseProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access this classroom</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{symbol}</p>
      </CardContent>
      <CardFooter>
        {!isPurchased ? (
          <Button
            className="w-full"
            onClick={buyAccess}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Purchasing...
              </>
            ) : (
              "Purchase NFT Access"
            )}
          </Button>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            Access Granted
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
