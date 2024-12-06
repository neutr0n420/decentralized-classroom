// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Classroom is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    address public teacher;
    uint256 public maxStudents;
    uint256 public price;
    
    struct Material {
        string ipfsHash;
        string materialType;
        uint256 timestamp;
    }
    
    Material[] public materials;
    mapping(address => bool) public enrolledStudents;
    
    event MaterialAdded(string ipfsHash, string materialType, uint256 timestamp);
    event StudentEnrolled(address student, uint256 tokenId);
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _teacher,
        uint256 _maxStudents,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_teacher) {
        teacher = _teacher;
        maxStudents = _maxStudents;
        price = _price;
    }
    
    modifier onlyTeacher() {
        require(msg.sender == teacher, "Only teacher can call this function");
        _;
    }
    
    modifier onlyEnrolled() {
        require(enrolledStudents[msg.sender], "Only enrolled students can access");
        _;
    }
    
    function addMaterial(string memory _ipfsHash, string memory _materialType) 
        external 
        onlyTeacher 
    {
        materials.push(Material({
            ipfsHash: _ipfsHash,
            materialType: _materialType,
            timestamp: block.timestamp
        }));
        
        emit MaterialAdded(_ipfsHash, _materialType, block.timestamp);
    }
    
    function enroll() external payable {
        require(!enrolledStudents[msg.sender], "Already enrolled");
        require(msg.value == price, "Incorrect payment amount");
        require(_tokenIds.current() < maxStudents, "Class is full");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        enrolledStudents[msg.sender] = true;
        
        emit StudentEnrolled(msg.sender, newTokenId);
    }
    
    function getAllMaterials() external view onlyEnrolled returns (Material[] memory) {
        return materials;
    }
    
    function withdrawFunds() external onlyTeacher {
        payable(teacher).transfer(address(this).balance);
    }
}

contract ClassroomFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _classroomIds;
    
    struct ClassroomInfo {
        address classroomAddress;
        string name;
        address teacher;
        uint256 maxStudents;
        uint256 price;
    }
    
    mapping(uint256 => ClassroomInfo) public classrooms;
    
    event ClassroomCreated(
        uint256 indexed classroomId,
        address classroomAddress,
        string name,
        address teacher
    );
    
    function createClassroom(
        string memory _name,
        string memory _symbol,
        uint256 _maxStudents,
        uint256 _price
    ) external returns (address) {
        _classroomIds.increment();
        uint256 newClassroomId = _classroomIds.current();
        
        Classroom newClassroom = new Classroom(
            _name,
            _symbol,
            msg.sender,
            _maxStudents,
            _price
        );
        
        classrooms[newClassroomId] = ClassroomInfo({
            classroomAddress: address(newClassroom),
            name: _name,
            teacher: msg.sender,
            maxStudents: _maxStudents,
            price: _price
        });
        
        emit ClassroomCreated(
            newClassroomId,
            address(newClassroom),
            _name,
            msg.sender
        );
        
        return address(newClassroom);
    }
    
    function getClassroom(uint256 _classroomId) 
        external 
        view 
        returns (ClassroomInfo memory) 
    {
        return classrooms[_classroomId];
    }
    
    function getClassroomCount() external view returns (uint256) {
        return _classroomIds.current();
    }
}