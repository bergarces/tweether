// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TweetherIdentity is Ownable {
  event BioChanged(
    address indexed _owner,
    string _bio
  );

  uint256 public maxBioBytes;

  mapping(address => string) public bio;

  constructor(uint256 _maxBioBytes) public {
    maxBioBytes = _maxBioBytes;
  }

  function setMaxBioBytes(uint256 _maxBioBytes) public onlyOwner {
    maxBioBytes = _maxBioBytes;
  }

  function setBio(string memory _bio) public {
    require(bytes(_bio).length <= maxBioBytes, "Maximum byte length for bio exceeded");

    bio[msg.sender] = _bio;

    emit BioChanged(msg.sender, _bio);
  }
}
