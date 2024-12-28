"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ClassroomPurchaseProps {
  id: string;
  title: string;
  symbol: string;
  price: string;
  buyAccess: () => void;
}

export default function ClassroomPurchase({
  title,
  price,

  symbol,
  buyAccess,
}: ClassroomPurchaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access this classroom</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{title}</p>
        <p className="text-2xl font-bold">
          {symbol}: {price} eth
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={buyAccess}>
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
