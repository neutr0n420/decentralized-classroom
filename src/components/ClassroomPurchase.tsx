"use client";

import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface ClassroomPurchaseProps {
  price: string;
  id: string;
  title: string;
  symbol: string;
  buyAccess: () => Promise<void>;
  isTeacher?: boolean;
  distributeCompletionNFTs?: () => void;
  isDistributingNFTs?: boolean;
}

const ClassroomPurchase = ({
  price,
  // id,
  title,
  symbol,
  buyAccess,
  isTeacher,
  distributeCompletionNFTs,
  isDistributingNFTs,
}: ClassroomPurchaseProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 text-purple-400">
        Purchase Access
      </h2>
      <p className="text-gray-300 mb-2">Title: {title}</p>
      <p className="text-gray-300 mb-2">Symbol: {symbol}</p>
      <p className="text-gray-300 mb-4">Price: {price} ETH</p>
      {isTeacher ? (
        <Button
          onClick={distributeCompletionNFTs}
          disabled={isDistributingNFTs}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-2"
        >
          {isDistributingNFTs ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Distributing...
            </>
          ) : (
            <>
              <Award size={20} />
              Distribute Completion NFTs
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={buyAccess}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          Buy Access
        </Button>
      )}
    </motion.div>
  );
};

export default ClassroomPurchase;
