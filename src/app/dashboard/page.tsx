"use client";
import React, { useEffect } from "react";
import { FactoryContractInstance } from "@/src/utils/contractFunction";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { classroomABI } from "@/src/utils/constants";
import { Table, TableBody, TableCaption, TableCell, TableRow, TableHead, TableHeader } from "@/src/components/ui/table"

const Page = () => {
  const [classroomAddress, setClassroomAddress] = React.useState<string[]>([]);
  const [studentData, setStudentData] = React.useState<any[]>([]);
  const { isConnected } = useAppKitAccount();
  useEffect(() => {
    FactoryContractInstance().then((res) => {
      console.log(res?.classroomAddresses);
      setClassroomAddress(res?.classroomAddresses);
    });

    const getStudentDetails = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        const ClassOwner = await signer.getAddress();
        console.log(ClassOwner);
        if (ClassOwner.toLowerCase() === (await signer.getAddress()).toLowerCase()) {
          classroomAddress.map(async (classAddress) => {
            const ClassroomContract = new ethers.Contract(classAddress, classroomABI, signer);
            const studentDetails = await ClassroomContract.getEnrolledStudents();
            console.log("This is student details", studentDetails);
            setStudentData(studentDetails)
          })
        }
      }
    }
    getStudentDetails()
  }, [isConnected])

  console.log(studentData)
  // getStudentDetails()
  return (
    // <div className="flex  justify-center  items-center text-white">
    //   MANAGE CLASSROOMS/ Courses PAGE
    // </div>
    <div className="text-white">
      <Table>
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No</TableHead>
            <TableHead>Student Address</TableHead>
            <TableHead>Enrollment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <TableHead>Enrolled Student Data</TableHead> */}
          {studentData.map((student, index) => (
            <tr key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
