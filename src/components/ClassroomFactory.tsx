"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { classroomFactoryAbi } from "../utils/constants";
import { classroomFactoryAddress } from "../utils/constants";

const ClassroomFactory: React.FC = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const createClassroom = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(
      classroomFactoryAddress,
      classroomFactoryAbi,
      signer
    );

    try {
      const tx = await factoryContract.createClassroom(
        name,
        symbol,
        maxStudents,
        ethers.utils.parseEther(price.toString())
      );
      await tx.wait();
      alert("Classroom created successfully!");
    } catch (err) {
      console.error("Error creating classroom:", err);
    }
  };

  const fetchClassrooms = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      classroomFactoryAddress,
      classroomFactoryAbi,
      provider
    );

    try {
      const count = await factoryContract.getClassroomCount();
      const classroomData = [];
      for (let i = 1; i <= count; i++) {
        const info = await factoryContract.getClassroom(i);
        classroomData.push(info);
      }
      setClassrooms(classroomData);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Classroom Factory
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              placeholder="Max Students"
              type="number"
              value={maxStudents}
              onChange={(e) => setMaxStudents(parseInt(e.target.value))}
            />
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              placeholder="Price (ETH)"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={createClassroom}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Classroom
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={fetchClassrooms}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fetch Classrooms
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {classroom.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex justify-between">
                  <span>Teacher:</span>
                  <span className="text-gray-900">{classroom.teacher}</span>
                </p>
                <p className="flex justify-between">
                  <span>Max Students:</span>
                  <span className="text-gray-900">{classroom.maxStudents}</span>
                </p>
                <p className="flex justify-between">
                  <span>Price:</span>
                  <span className="text-gray-900">
                    {ethers.utils.formatEther(classroom.price)} ETH
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassroomFactory;
