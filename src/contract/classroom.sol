// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Classroom is ERC721, Ownable {
    uint256 public nftPrice;
    uint256 public nextTokenId;
    string[] public materials;
    address[] private enrolledStudents; // Array to store enrolled students
    mapping(address => bool) private isEnrolled; // Mapping to track enrollment status

    event MaterialAdded(string indexed ipfsHash);
    event FundsWithdrawn(address indexed teacher, uint256 amount);
    event StudentEnrolled(address indexed student);

    constructor(
        address _teacher,
        string memory _name,
        string memory _symbol,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_teacher) {
        nftPrice = _price;
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
}
