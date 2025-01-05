// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Classroom.sol";

contract ClassroomFactory {
    address[] public classrooms; 
    Classroom public _classroom;

     struct ClassroomInfo {
        address classroomAddress;
        string name;
        string symbol;
        uint256 price;
        bool hasCompletionNFT;
    }


    event ClassroomCreated(address indexed classroomAddress, address indexed teacher);

    function createClassroom(
        string memory _name,
        string memory _symbol,
        uint256 _price
    )  external {
        Classroom newClassroom = new Classroom(msg.sender, _name, _symbol, _price);
        classrooms.push(address(newClassroom));
        emit ClassroomCreated(address(newClassroom), msg.sender);

    }
    function getClassrooms() external view returns (address[] memory) {
        return classrooms;
    }
 function getStudentClassroomDetails(address student) external view returns (ClassroomInfo[] memory) {
        uint256 enrolledCount = 0;
        
        // First pass: count enrolled classes
        for (uint256 i = 0; i < classrooms.length; i++) {
            Classroom classroom = Classroom(classrooms[i]);
            if (classroom.balanceOf(student) > 0) {
                enrolledCount++;
            }
        }
        
        // Create array of correct size
        ClassroomInfo[] memory enrolledClassrooms = new ClassroomInfo[](enrolledCount);
        
        // Second pass: populate array with classroom details
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < classrooms.length; i++) {
            Classroom classroom = Classroom(classrooms[i]);
            if (classroom.balanceOf(student) > 0) {
                enrolledClassrooms[currentIndex] = ClassroomInfo({
                    classroomAddress: classrooms[i],
                    name: classroom.name(),
                    symbol: classroom.symbol(),
                    price: classroom.nftPrice(),
                    hasCompletionNFT: classroom.hasReceivedCompletionNFT(student)
                });
                currentIndex++;
            }
        }
        
        return enrolledClassrooms;
    }
}
