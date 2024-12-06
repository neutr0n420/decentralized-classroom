export const classroomFactoryAddress =
  "0xad1B2B07B4667396C2A60Da298250853089E784E";

export const classroomFactoryAbi = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_maxStudents", type: "uint256" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "createClassroom",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getClassroomCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_classroomId", type: "uint256" },
    ],
    name: "getClassroom",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "classroomAddress",
            type: "address",
          },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "teacher", type: "address" },
          { internalType: "uint256", name: "maxStudents", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
        ],
        internalType: "struct ClassroomFactory.ClassroomInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const classroomAbi = [
  {
    inputs: [],
    name: "enroll",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "enrolledStudents",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "teacher",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
