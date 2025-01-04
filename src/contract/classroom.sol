// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Classroom is ERC721, Ownable {
    uint256 public nftPrice;
    uint256 public nextTokenId;
    string[] public materials;
    address[] private enrolledStudents;
    mapping(address => bool) private isEnrolled;
    mapping(address => uint256) private enrollmentTimestamps; // New mapping for timestamps

    event MaterialAdded(string indexed ipfsHash);
    event FundsWithdrawn(address indexed teacher, uint256 amount);
    event StudentEnrolled(address indexed student, uint256 timestamp);

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
        require(!isEnrolled[msg.sender], "Already enrolled");

        _mint(msg.sender, nextTokenId);
        enrolledStudents.push(msg.sender);
        isEnrolled[msg.sender] = true;
        enrollmentTimestamps[msg.sender] = block.timestamp; // Store enrollment timestamp

        emit StudentEnrolled(msg.sender, block.timestamp);
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

    function getEnrolledStudents() external view returns (address[] memory) {
        return enrolledStudents;
    }

    function getTotalEnrolledStudents() external view returns (uint256) {
        return enrolledStudents.length;
    }

    // New function to get enrollment timestamp of a specific student
    function getEnrollmentTimestamp(
        address student
    ) external view returns (uint256) {
        require(isEnrolled[student], "Student not enrolled");
        return enrollmentTimestamps[student];
    }

    // New function to get all students with their enrollment timestamps
    function getStudentsWithTimestamps()
        external
        view
        returns (address[] memory students, uint256[] memory timestamps)
    {
        uint256 totalStudents = enrolledStudents.length;
        students = new address[](totalStudents);
        timestamps = new uint256[](totalStudents);

        for (uint256 i = 0; i < totalStudents; i++) {
            students[i] = enrolledStudents[i];
            timestamps[i] = enrollmentTimestamps[enrolledStudents[i]];
        }

        return (students, timestamps);
    }
}
