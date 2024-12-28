"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock, FileText } from "lucide-react";

interface Material {
  id: number;
  hash: string;
}

interface ClassroomMaterialsProps {
  materials: string[];
}

export default function ClassroomMaterials({
  materials,
}: ClassroomMaterialsProps) {
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  console.log("materialns", materials);

  useEffect(() => {
    const checkAccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAccessGranted(true);
    };
    checkAccess();
  }, []);

  const formattedMaterials: Material[] = materials.map((hash, index) => ({
    id: index,
    hash: hash,
  }));

  console.log(formattedMaterials);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Materials</CardTitle>
      </CardHeader>
      <CardContent>
        {formattedMaterials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4" />
              <span className="ml-2">Material #{material.id + 1}</span>
            </div>
            {isAccessGranted ? (
              <Button
                size="sm"
                onClick={() =>
                  window.open(`https://ipfs.io/ipfs/${material.hash}`, "_blank")
                }
              >
                Access
              </Button>
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
        {!isAccessGranted && (
          <p className="text-sm text-gray-500 mt-4">
            Purchase the classroom NFT to unlock all materials.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
