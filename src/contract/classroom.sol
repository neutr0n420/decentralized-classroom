// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Classroom is ERC721, Ownable {
    uint256 public nftPrice;
    uint256 public nextTokenId;
    uint256 public nextCompletionTokenId = 1000000; 
    string[] public materials;
    address[] private enrolledStudents; // Array to store enrolled students
    mapping(address => bool) private isEnrolled; // Mapping to track enrollment status
    mapping(address => bool) private hasCompletionNFT; // Track who has received completion NFTs

    mapping(uint256 => bool) public isCompletionNFT;


    event MaterialAdded(string indexed ipfsHash);
    event FundsWithdrawn(address indexed teacher, uint256 amount);
    event StudentEnrolled(address indexed student);
    event CompletionNFTsDistributed(uint256 count);


    constructor(
        address _teacher,
        string memory _name,
        string memory _symbol,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_teacher) {
        nftPrice = _price;
    }

    
       function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(!isCompletionNFT[tokenId], "Completion NFTs cannot be transferred");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(!isCompletionNFT[tokenId], "Completion NFTs cannot be transferred");
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function distributeCompletionNFTs() external onlyOwner {
        require(enrolledStudents.length > 0, "No enrolled students");
        
        uint256 distributedCount = 0;
        
        for (uint256 i = 0; i < enrolledStudents.length; i++) {
            address student = enrolledStudents[i];
            
            // Check if student hasn't already received a completion NFT
            if (!hasCompletionNFT[student]) {
                _safeMint(student, nextCompletionTokenId);
                isCompletionNFT[nextCompletionTokenId] = true; // Mark as completion NFT
                hasCompletionNFT[student] = true;
                nextCompletionTokenId++;
                distributedCount++;
            }
        }
        
        emit CompletionNFTsDistributed(distributedCount);
    }

    function buyAccess() external payable {
        require(msg.value == nftPrice, "Incorrect price");
        _mint(msg.sender, nextTokenId);
        enrolledStudents.push(msg.sender);
        isEnrolled[msg.sender] = true;

        emit StudentEnrolled(msg.sender);
        nextTokenId++;
    }

    function addMaterial(string memory _ipfsHash) external onlyOwner {
        materials.push(_ipfsHash);
        emit MaterialAdded(_ipfsHash);
    }

    function viewMaterials() external view returns (string[] memory) {
        require(balanceOf(msg.sender) > 0, "You do not have access");
        return materials;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }

    // New function to get all enrolled students
    function getEnrolledStudents() external view returns (address[] memory) {
        return enrolledStudents;
    }

    // Optional: Get total number of enrolled students
    function getTotalEnrolledStudents() external view returns (uint256) {
        return enrolledStudents.length;
    }

      function hasReceivedCompletionNFT(address student) external view returns (bool) {
        return hasCompletionNFT[student];
    }
}
