// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Set up bio. */
contract TweetherIdentity is Ownable {
  event BioChanged(
    address indexed _owner,
    string _bio
  );

  uint256 public maxBioBytes;

  mapping(address => string) public bio;

  /** @dev Constructor
    * @param _maxBioBytes Maximum number of bytes.
    */
  constructor(uint256 _maxBioBytes) public {
    maxBioBytes = _maxBioBytes;
  }

  /** @dev Set the maximum amount of bytes that bios can have.
    * @param _maxBioBytes Maximum number of bytes.
    */
  function setMaxBioBytes(uint256 _maxBioBytes) public onlyOwner {
    maxBioBytes = _maxBioBytes;
  }

  /** @dev Sets the bio of the sender.
    * @param _bio Bio that will replace the existing one.
    */
  function setBio(string memory _bio) public {
    require(bytes(_bio).length <= maxBioBytes, "Maximum byte length for bio exceeded");

    bio[msg.sender] = _bio;

    emit BioChanged(msg.sender, _bio);
  }
}
