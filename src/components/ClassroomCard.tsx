import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

import Link from "next/link";

interface Classroom {
  address: string;
  name: string;
  symbol: string;
  price: string;
}

interface ClassroomCardProps {
  classroom: Classroom;
}

export default function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700 text-white hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl mb-2 text-purple-300">
          {classroom.name}
        </CardTitle>
        <CardDescription>{classroom.symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Price: {classroom.price} ETH
        </p>
        {/* [TODO]: Removed Material's from the  */}
        {/* <p className="text-sm font-medium mb-2">Materials:</p> */}
        {/* <div className="flex flex-wrap gap-2">
          {classroom.materials.map((material, index) => (
            <Badge key={index} variant="secondary">
              {material}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          variant="outline"
          asChild
        >
          <Link href={`/dashboard/${classroom.address}`}>Edit</Link>
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          variant="outline"
          asChild
        >
          <Link href={`/view-classroom/${classroom.address}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
