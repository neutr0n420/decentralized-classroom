"use client";
import { CONTRACT_ADDRESS, classroomFactoryAbi } from "./constants";
import { useRpcProviders } from "@dynamic-labs/sdk-react-core";
import { evmProvidersSelector } from '@dynamic-labs/ethereum-core';
import { ethers } from "ethers";

export function useContractInstance() {
    // const evmProvider = useRpcProviders(evmProvidersSelector);
    // const provider = evmProvidersSelector().providers();
    // const sign = provider.signer;
    // console.log(contractInstance);
    // return contractInstance;
}