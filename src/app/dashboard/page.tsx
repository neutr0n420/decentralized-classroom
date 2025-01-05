"use client";
import React, { useEffect, useState } from "react";
import { FactoryContractInstance } from "@/src/utils/contractFunction";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { classroomABI } from "@/src/utils/constants";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/src/components/ui/table"

const Page = () => {
  interface StudentData {
    students: string[];
    timestamps: string[];
  }
  const [classroomAddress, setClassroomAddress] = React.useState<string[]>([]);
  const [totalEnrolledStudents, setTotalEnrolledStudents] = useState<number>(0);
  const [studentData, setStudentData] = useState<StudentData>({ students: [], timestamps: [] });

  // const [studentData, setStudentData] = React.useState<Student[]>([]);


  const { isConnected } = useAppKitAccount();
  useEffect(() => {
    FactoryContractInstance().then((res) => {
      setClassroomAddress(res?.classroomAddresses);
    });

    const getStudentDetails = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        const ClassOwner = await signer.getAddress();
        if (ClassOwner.toLowerCase() === (await signer.getAddress()).toLowerCase()) {
          classroomAddress.map(async (classAddress) => {
            const ClassroomContract = new ethers.Contract(classAddress, classroomABI, signer);
            if (ClassOwner.toLowerCase() === await ClassroomContract.owner()) {
              const studentDetails = await ClassroomContract.getStudentsWithTimestamps();
              setStudentData(studentDetails);
              const studentCount = await ClassroomContract.getTotalEnrolledStudents()
              console.log("Student Count", Number(studentCount._hex));
              setTotalEnrolledStudents(Number(studentCount._hex));
            }
          })
        }
      }
    }

    getStudentDetails()
  }, [isConnected, classroomAddress]);


  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "-";
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // getStudentDetails()
  return (

    <div className="text-white">
      {totalEnrolledStudents === 0 ? (<div className="text-center">No Student Enrolled</div>) : <div className="bg-indigo-500 w-1/5 text-center mx-8 rounded-xl">Total Enrolled Student: {totalEnrolledStudents}</div>}
      {totalEnrolledStudents === 0 ? (<div className="text-center text-2xl mt-16">You will get information about the students here after someone join the class!</div>) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No</TableHead>
              <TableHead>Student Address</TableHead>
              <TableHead>Enrollment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* <TableHead>Enrolled Student Data</TableHead> */}
            {studentData !== undefined && studentData.students !== undefined && studentData.students.length > 0 && studentData.students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="font-mono">
                    {student}
                  </div>
                </TableCell>
                <TableCell>
                  {formatTimestamp(studentData.timestamps[index])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

    </div>
  );
};

export default Page;
