"use client";

import { useState, useEffect, use } from "react";
import { Plus } from "lucide-react";
import { ethers } from "ethers";
import { classroomABI } from "../../../utils/constants";
import { Web3Error } from "@/src/types/errors";
import { useAppKitAccount } from "@reown/appkit/react";
import { Badge } from "@/src/components/ui/badge";
import ClassroomPurchase from "@/src/components/ClassroomPurchase";
import ClassroomMaterials from "@/src/components/ClassroomMaterials";
import { Button } from "@/src/components/ui/button";
import { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import { PinataSDK } from "pinata-web3";
import { motion } from "framer-motion";

interface PageProps {
  params: Promise<{
    address: string;
  }>;
}

export type EthereumProviderType = ExternalProvider & {
  request: JsonRpcFetchFunc;
  selectedAddress?: string;
  isMetaMask?: boolean;
};

const pinata = new PinataSDK({
  pinataJwt:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyOGJmOGI3OS00OThiLTRjODctYTIwYy03OGVkZjZmODhkNmEiLCJlbWFpbCI6ImFyeWFuYnJhbWhhbmUxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNTNjZmZkODdiMjdmOGY5NTE0OCIsInNjb3BlZEtleVNlY3JldCI6Ijc3ZDk1NTRjZjE3NDgwNWU5YjQzN2Q0YjJjMzIyNjdkODRjMDI2NjZhMGQxY2RlODQ1ODNlZWQwYzg1Njc0MjIiLCJleHAiOjE3NjczNDUyNjR9.6MSUSZzWOpn4IQfRnM8w5AVlqF-6va9x1FccJ6jNe8w",
  pinataGateway: "plum-abstract-tern-191.mypinata.cloud",
});

const ClassroomPage = ({ params }: PageProps) => {
  const { address } = use(params);
  const [materials, setMaterials] = useState<string[]>([]);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [classroomSymbol, setClassroomSymbol] = useState("");
  const [classroomPrice, setClassroomPrice] = useState("");
  const [uploadComplete, setUploadComplete] = useState(true);
  const [contractBalance, setContractBalance] = useState(0);
  const [ipfsHash, setIpfsHash] = useState("");
  const { address: userAddress } = useAppKitAccount();

  const [isDistributingNFTs, setIsDistributingNFTs] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  console.log("is teacher", isTeacher);
  useEffect(() => {
    fetchClassroomDetails(address).then((details) => {
      setClassroomName(details.name);
      setClassroomSymbol(details.symbol);
      setClassroomPrice(details.price);
    });
    fetchMaterials();
    checkIfTeacher(); // Add this line to check if current user is teacher
  }, [address]);

  const checkIfTeacher = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as EthereumProviderType
      );
      const signer = provider.getSigner();
      const classroomContract = new ethers.Contract(
        address,
        classroomABI,
        signer
      );
      const owner = await classroomContract.owner();
      setIsTeacher(owner.toLowerCase() === userAddress?.toLowerCase());
    } catch (error) {
      console.error("Error checking teacher status:", error);
    }
  };

  const RedeemBalance = async () => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as EthereumProviderType
    );
    const signer = provider.getSigner();
    const classroomContract = new ethers.Contract(
      address,
      classroomABI,
      signer
    );
    // const owner = await classroomContract.owner();
    const tx = await classroomContract.withdrawFunds();
    console.log(await tx.wait());
    setContractBalance(0);
  };

  const SettlePayment = async () => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as EthereumProviderType
    );
    const signer = provider.getSigner();
    const classroomContract = new ethers.Contract(
      address,
      classroomABI,
      signer
    );
    const owner = await classroomContract.owner();
    const contractBalance = await classroomContract.balanceOf(owner);
    setContractBalance(Number(contractBalance._hex));
    // console.log("Classroom balance", await classroomContract.balanceOf(owner));
  };
  SettlePayment();
  const distributeCompletionNFTs = async () => {
    if (!userAddress || !isTeacher) {
      alert("Only the teacher can distribute completion NFTs");
      return;
    }

    setIsDistributingNFTs(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as EthereumProviderType
      );
      const signer = provider.getSigner();
      const classroomContract = new ethers.Contract(
        address,
        classroomABI,
        signer
      );

      const tx = await classroomContract.distributeCompletionNFTs();
      await tx.wait();
      alert("Completion NFTs distributed successfully!");
    } catch (error) {
      console.error("Error distributing completion NFTs:", error);
      alert("Error distributing completion NFTs. Please try again.");
    } finally {
      setIsDistributingNFTs(false);
    }
  };

  const fetchClassroomDetails = async (classroomAddress: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as EthereumProviderType
      );
      const signer = provider.getSigner();
      const classroomContract = new ethers.Contract(
        classroomAddress,
        classroomABI,
        signer
      );
      const name = await classroomContract.name();
      const symbol = await classroomContract.symbol();
      const price = await classroomContract.nftPrice();

      return {
        name,
        symbol,
        price: ethers.utils.formatEther(price),
      };
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      return {
        name: "Unnamed Classroom",
        symbol: "???",
        price: "0",
      };
    }
  };

  const uploadMaterial = async (userFile: File) => {
    try {
      // If userFile is already a File object, use it directly
      if (userFile instanceof File) {
        setUploadComplete(false);
        const upload = await pinata.upload.file(userFile);
        console.log("This is the upload", upload);
        setIpfsHash(upload.IpfsHash);

        setUploadComplete(true);

        return;
      }

      // If userFile is raw data, create a new File
      const file = new File([userFile], "filename.txt", { type: "text/plain" });
      const upload = await pinata.upload.file(file);

      console.log("This is the upload", upload.IpfsHash);
      console.log("This is the ipfs hash from upload Material", ipfsHash);
      console.log("Hello");
    } catch (error) {
      console.error("Error uploading material:", error);
    }
  };

  // const retiveMaterial = async () => {
  //   const data = await pinata.gateways.get("QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848zNzdng")
  //   console.log(data)
  // }

  const fetchMaterials = async () => {
    if (address) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as EthereumProviderType
        );
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const classroomContract = new ethers.Contract(
          address,
          classroomABI,
          signer
        );
        const balance = await classroomContract.balanceOf(userAddress);
        if (balance.toNumber() === 0) {
          const price = await classroomContract.nftPrice();
          const buyAccess = await classroomContract.buyAccess({ value: price });
          await buyAccess.wait();
        }
        const materials = await classroomContract.viewMaterials();
        setMaterials(Array.isArray(materials) ? materials : []);
      } catch (error: unknown) {
        console.error("Error fetching materials:", error);
        if (error && typeof error === "object" && "code" in error) {
          const web3Error = error as Web3Error;
          if (web3Error.code === 4001) {
            alert("Please connect your wallet to view materials");
          } else if (web3Error.code === -32000) {
            alert(
              "You need to purchase access to view materials. Please buy access first."
            );
          }
        } else {
          alert(
            "Error loading materials. Please make sure you have purchased access."
          );
        }
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  };

  const addMaterial = async () => {
    console.log("IPFS Hash", ipfsHash);
    if (!ipfsHash) {
      alert("Please enter an IPFS hash");
      return;
    }

    setAddingMaterial(true);
    try {
      if (userAddress) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as EthereumProviderType
        );
        const signer = provider.getSigner();
        const classroomContract = new ethers.Contract(
          address,
          classroomABI,
          signer
        );

        const tx = await classroomContract.addMaterial(ipfsHash);
        await tx.wait();
        setIpfsHash("");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Error adding material. Please try again.");
    } finally {
      setAddingMaterial(false);
    }
  };

  const buyAccess = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as EthereumProviderType
        );
        const signer = provider.getSigner();
        const classroomContract = new ethers.Contract(
          address,
          classroomABI,
          signer
        );

        const price = await classroomContract.nftPrice();
        const tx = await classroomContract.buyAccess({ value: price });
        await tx.wait();
        alert("Access purchased successfully!");
        fetchMaterials();
      } catch (error) {
        console.error("Error buying access:", error);
        alert("Error purchasing access. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white ">
      <div className="container mx-auto px-4 py-12 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-8 md:grid-cols-[3fr_1fr]"
        >
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-lg">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {classroomName}
              </h1>
              <Badge className="bg-purple-600 text-white">
                {classroomSymbol}
              </Badge>
            </div>

            <p className="mt-4 text-gray-300">Address: {address}</p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                Course Materials
              </h2>

              {isTeacher && (
                <div className="flex flex-col items-center gap-4 mb-4">
                  {/* <Input
                  placeholder="Enter IPFS Hash"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className="bg-gray-700 text-white border-purple-500"
                /> */}
                  <input
                    type="file"
                    hidden
                    id="browse"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        uploadMaterial(e.target.files[0]);
                        console.log(e.target.files);
                      }
                    }}
                    accept=".pdf,.docx,.pptx,.txt,.xlsx, .jpg, .jpeg, .png"
                    multiple
                  />
                  <label
                    htmlFor="browse"
                    className="border-2 border-dashed p-36  cursor-pointer  text-gray-300 bg-gray-800 bg-opacity-50 rounded-xl flex flex-col items-center justify-center"
                  >
                    <Plus size={64} opacity={60} />
                    {uploadComplete ? (
                      <p>Upload Material</p>
                    ) : (
                      <p>Uploading...</p>
                    )}
                  </label>
                  <Button
                    onClick={addMaterial}
                    disabled={addingMaterial}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    {addingMaterial ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
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
                        Adding...
                      </>
                    ) : (
                      "Add Material"
                    )}
                  </Button>
                </div>
              )}
              <ClassroomMaterials materials={materials} />
              {isTeacher ? (
                <div>
                  <h3 className="text-purple-300 font-bold text-2xl my-6">
                    Current Balance:$EDU {contractBalance}{" "}
                  </h3>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-2"
                    onClick={() => RedeemBalance()}
                  >
                    Redeem Balance
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-purple-300 font-bold text-2xl my-6">
                    Price: $EDU {classroomPrice}{" "}
                  </h3>
                </div>
              )}
            </div>
          </div>
          <div>
            <ClassroomPurchase
              price={classroomPrice.toString()}
              id={address}
              title={classroomName}
              symbol={classroomSymbol}
              buyAccess={buyAccess}
              isTeacher={isTeacher}
              distributeCompletionNFTs={distributeCompletionNFTs}
              isDistributingNFTs={isDistributingNFTs}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassroomPage;
