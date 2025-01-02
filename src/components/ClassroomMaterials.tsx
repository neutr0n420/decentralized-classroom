"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock, FileText } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 bg-opacity-50 border-purple-500 text-white backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Course Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formattedMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-400" />
                <span className="ml-3 text-gray-200">
                  Material #{material.id + 1}
                </span>
              </div>
              {isAccessGranted ? (
                <Button
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://ipfs.io/ipfs/${material.hash}`,
                      "_blank"
                    )
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Access
                </Button>
              ) : (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
            </motion.div>
          ))}
          {!isAccessGranted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm text-gray-400 mt-4"
            >
              Purchase the classroom NFT to unlock all materials.
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
