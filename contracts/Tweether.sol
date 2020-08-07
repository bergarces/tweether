// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tweether is Ownable {
  event TweethSent(
    address indexed _owner,
    uint256 indexed _nonce,
    string _message,
    address[] mentions
  );

  struct Tweeth {
    address owner;
    uint256 nonce;
    string message;
    address[] mentions;
  }

  uint256 public maxTweethBytes;
  uint256 public maxMentions;

  mapping(bytes32 => Tweeth) public tweeths;
  mapping(address => uint256) public nonceCounter;

  constructor(uint256 _maxTweethBytes, uint256 _maxMentions) public {
    maxTweethBytes = _maxTweethBytes;
    maxMentions = _maxMentions;
  }

  function setMaxTweethBytes(uint256 _maxTweethBytes) public onlyOwner {
    maxTweethBytes = _maxTweethBytes;
  }

  function setMaxMentions(uint256 _maxMentions) public onlyOwner {
    maxMentions = _maxMentions;
  }

  function sendTweeth(string memory _message, address[] memory _mentions) public {
    require(bytes(_message).length <= maxTweethBytes, "Maximum byte length for tweeth exceeded");
    require(_mentions.length <= maxMentions, "Maximum mentions exceeded");

    uint256 nonce = nonceCounter[msg.sender]++;
    Tweeth storage newTweeth = tweeths[keccak256(abi.encodePacked(msg.sender, nonce))];

    newTweeth.owner = msg.sender;
    newTweeth.nonce = nonce;
    newTweeth.message = _message;
    newTweeth.mentions = _mentions;

    emit TweethSent(msg.sender, nonce, _message, _mentions);
  }

  function getTweeth(address _owner, uint256 _nonce) public view returns (Tweeth memory) {
    return tweeths[keccak256(abi.encodePacked(_owner, _nonce))];
  }
}
