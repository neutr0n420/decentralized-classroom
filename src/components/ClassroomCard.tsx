import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface Classroom {
  address: string;
  name: string;
  symbol: string;
  price: string;
  materials: string[];
}

interface ClassroomCardProps {
  classroom: Classroom;
}

export default function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{classroom.name}</CardTitle>
        <CardDescription>{classroom.symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Price: {classroom.price} ETH
        </p>
        <p className="text-sm font-medium mb-2">Materials:</p>
        <div className="flex flex-wrap gap-2">
          {classroom.materials.map((material, index) => (
            <Badge key={index} variant="secondary">
              {material}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/edit-classroom/${classroom.address}`}>Edit</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/view-classroom/${classroom.address}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
