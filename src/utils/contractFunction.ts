"use client";
import {
  classroomFactoryAbi,
  CONTRACT_ADDRESS,
} from "@/src/utils/constants";
import { ethers } from "ethers"
export async function FactoryContractInstance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
    const signer = provider.getSigner();
    const FactoryContract = new ethers.Contract(CONTRACT_ADDRESS, classroomFactoryAbi, signer);
    const classroomAddresses = await FactoryContract.getClassrooms();
    return { FactoryContract, classroomAddresses };
  }
}
// export async function useTeacherContract() {
//   const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
//   const signer = provider.getSigner();
//   // const teacherAddress = await signer.getAddress();
//   // const teacherClass = await useFactoryContractInstance().getTeacherClasses(teacherAddress);
// }
