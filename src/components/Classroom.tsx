"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { classroomABI } from "../utils/constants";

interface ClassroomProps {
  address: string;
  index: number;
  onView: (address: string) => void;
}

export const Classroom = ({ address }: ClassroomProps) => {
  const [materials, setMaterials] = useState<string[]>([]);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [materialType, setMaterialType] = useState("");

  const addMaterial = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const classroomContract = new ethers.Contract(
      address,
      classroomABI,
      signer
    );

    try {
      const tx = await classroomContract.addMaterial(ipfsHash, materialType);
      await tx.wait();
      alert("Material added successfully!");
    } catch (err) {
      console.error("Error adding material:", err);
    }
  };

  const fetchMaterials = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const classroomContract = new ethers.Contract(
      address,
      classroomABI,
      provider
    );

    try {
      const allMaterials = await classroomContract.getAllMaterials();
      setMaterials(allMaterials);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  return (
    <div>
      <h1>Classroom</h1>
      <div>
        <input
          placeholder="IPFS Hash"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
        />
        <input
          placeholder="Material Type"
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
        />
        <button onClick={addMaterial}>Add Material</button>
      </div>
      <button onClick={fetchMaterials}>Fetch Materials</button>
      <div>
        {materials.map((material, index) => (
          <div key={index}>
            <p>IPFS Hash: {material}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
