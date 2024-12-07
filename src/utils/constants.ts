export const CONTRACT_ADDRESS = "0xE8044333d0A862a7232543e5635DAD2DCE494DC3";

export const classroomFactoryAbi = [
  {
    inputs: [],
    name: "getClassrooms",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "createClassroom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const classroomABI = [
  {
    inputs: [{ internalType: "string", name: "ipfsHash", type: "string" }],
    name: "addMaterial",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaterials",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
];
