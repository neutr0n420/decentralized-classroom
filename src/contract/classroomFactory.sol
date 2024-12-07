// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Classroom.sol";

contract ClassroomFactory {
    address[] public classrooms; 

    event ClassroomCreated(address indexed classroomAddress, address indexed teacher);

  
    function createClassroom(
        string memory _name,
        string memory _symbol,
        uint256 _price
    ) external {
        Classroom newClassroom = new Classroom(msg.sender, _name, _symbol, _price);
        classrooms.push(address(newClassroom));
        emit ClassroomCreated(address(newClassroom), msg.sender);
    }

    function getClassrooms() external view returns (address[] memory) {
        return classrooms;
    }
}
