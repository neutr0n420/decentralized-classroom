// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Classroom is ERC721, Ownable {
    uint256 public nftPrice;
    uint256 public nextTokenId;
    uint256 public nextCompletionTokenId = 1000000;
    string[] public materials;
    address[] private enrolledStudents;
    mapping(address => bool) private isEnrolled;
    mapping(address => bool) private hasCompletionNFT;
    mapping(uint256 => bool) public isCompletionNFT;

    // New live class structures
    struct LiveClass {
        string meetingUrl;
        string topic;
        uint256 startTime;
        uint256 duration;
        bool isActive;
    }

    LiveClass[] public liveClasses;
    mapping(string => uint256[]) private topicToLiveClasses;
    string[] private activeTopics;

    // Events
    event MaterialAdded(string indexed ipfsHash);
    event FundsWithdrawn(address indexed teacher, uint256 amount);
    event StudentEnrolled(address indexed student);
    event CompletionNFTsDistributed(uint256 count);
    event LiveClassScheduled(
        string topic,
        string meetingUrl,
        uint256 startTime,
        uint256 duration
    );
    event LiveClassCancelled(string topic, uint256 classIndex);

    constructor(
        address _teacher,
        string memory _name,
        string memory _symbol,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_teacher) {
        nftPrice = _price;
    }

    // New live class functions
    function scheduleLiveClass(
        string memory _meetingUrl,
        string memory _topic,
        uint256 _startTime,
        uint256 _duration
    ) external onlyOwner {
        require(bytes(_meetingUrl).length > 0, "Meeting URL cannot be empty");
        require(bytes(_topic).length > 0, "Topic cannot be empty");
        require(
            _startTime > block.timestamp,
            "Start time must be in the future"
        );
        require(_duration > 0, "Duration must be greater than 0");

        LiveClass memory newClass = LiveClass({
            meetingUrl: _meetingUrl,
            topic: _topic,
            startTime: _startTime,
            duration: _duration,
            isActive: true
        });

        liveClasses.push(newClass);
        uint256 classIndex = liveClasses.length - 1;
        topicToLiveClasses[_topic].push(classIndex);

        bool topicExists = false;
        for (uint i = 0; i < activeTopics.length; i++) {
            if (keccak256(bytes(activeTopics[i])) == keccak256(bytes(_topic))) {
                topicExists = true;
                break;
            }
        }
        if (!topicExists) {
            activeTopics.push(_topic);
        }

        emit LiveClassScheduled(_topic, _meetingUrl, _startTime, _duration);
    }

    function getLiveClassesByTopic(
        string memory _topic
    ) external view returns (LiveClass[] memory) {
        require(balanceOf(msg.sender) > 0, "You do not have access");

        uint256[] memory classIndices = topicToLiveClasses[_topic];
        LiveClass[] memory topicClasses = new LiveClass[](classIndices.length);

        for (uint i = 0; i < classIndices.length; i++) {
            topicClasses[i] = liveClasses[classIndices[i]];
        }

        return topicClasses;
    }

    function getActiveLiveClasses() external view returns (LiveClass[] memory) {
        require(balanceOf(msg.sender) > 0, "You do not have access");

        uint256 activeCount = 0;
        for (uint i = 0; i < liveClasses.length; i++) {
            if (
                liveClasses[i].isActive &&
                liveClasses[i].startTime +
                    (liveClasses[i].duration * 1 minutes) >
                block.timestamp
            ) {
                activeCount++;
            }
        }

        LiveClass[] memory activeClasses = new LiveClass[](activeCount);
        uint256 currentIndex = 0;

        for (uint i = 0; i < liveClasses.length; i++) {
            if (
                liveClasses[i].isActive &&
                liveClasses[i].startTime +
                    (liveClasses[i].duration * 1 minutes) >
                block.timestamp
            ) {
                activeClasses[currentIndex] = liveClasses[i];
                currentIndex++;
            }
        }

        return activeClasses;
    }

    function cancelLiveClass(uint256 _classIndex) external onlyOwner {
        require(_classIndex < liveClasses.length, "Invalid class index");
        require(liveClasses[_classIndex].isActive, "Class already inactive");

        liveClasses[_classIndex].isActive = false;
        emit LiveClassCancelled(liveClasses[_classIndex].topic, _classIndex);
    }

    // Existing functions
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(
            !isCompletionNFT[tokenId],
            "Completion NFTs cannot be transferred"
        );
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(
            !isCompletionNFT[tokenId],
            "Completion NFTs cannot be transferred"
        );
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function distributeCompletionNFTs() external onlyOwner {
        require(enrolledStudents.length > 0, "No enrolled students");
        uint256 distributedCount = 0;
        for (uint256 i = 0; i < enrolledStudents.length; i++) {
            address student = enrolledStudents[i];
            if (!hasCompletionNFT[student]) {
                _safeMint(student, nextCompletionTokenId);
                isCompletionNFT[nextCompletionTokenId] = true;
                hasCompletionNFT[student] = true;
                nextCompletionTokenId++;
                distributedCount++;
            }
        }
        emit CompletionNFTsDistributed(distributedCount);
    }

    function buyAccess() external payable {
        require(msg.value == nftPrice, "Incorrect price");
        require(!isEnrolled[msg.sender], "Already enrolled");
        _mint(msg.sender, nextTokenId);
        enrolledStudents.push(msg.sender);
        isEnrolled[msg.sender] = true;
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

    function hasReceivedCompletionNFT(
        address student
    ) external view returns (bool) {
        return hasCompletionNFT[student];
    }
}
