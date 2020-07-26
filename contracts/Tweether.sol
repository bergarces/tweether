// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tweether is Ownable {
  event TweethSent(
    address indexed _owner,
    uint256 indexed _nonce,
    string _text,
    address[] mentions
  );

  struct Tweeth {
    address owner;
    uint256 nonce;
    string text;
    address[] mentions;
  }

  uint256 public maxBytes;
  uint256 public maxMentions;

  mapping(bytes32 => Tweeth) public tweeths;
  mapping(address => uint256) public nonceCounter;

  constructor(uint256 _maxBytes, uint256 _maxMentions) public {
    maxBytes = _maxBytes;
    maxMentions = _maxMentions;
  }

  function setMaxCharacters(uint256 _maxBytes) public onlyOwner {
    maxBytes = _maxBytes;
  }

  function setMaxMentions(uint256 _maxMentions) public onlyOwner {
    maxMentions = _maxMentions;
  }

  function sendTweeth(string memory text, address[] memory mentions) public {
    require(bytes(text).length <= maxBytes, "Maximum bytes exceeded");
    require(mentions.length <= maxMentions, "Maximum mentions exceeded");

    uint256 nonce = nonceCounter[msg.sender]++;
    Tweeth storage newTweeth = tweeths[keccak256(abi.encodePacked(msg.sender, nonce))];

    newTweeth.owner = msg.sender;
    newTweeth.nonce = nonce;
    newTweeth.text = text;
    newTweeth.mentions = mentions;

    emit TweethSent(msg.sender, nonce, text, mentions);
  }

  function getTweeth(address owner, uint256 nonce) public view returns (Tweeth memory) {
    return tweeths[keccak256(abi.encodePacked(owner, nonce))];
  }
}
