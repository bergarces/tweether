// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tweether is Ownable {
  struct Tweeth {
    uint256 nonce;
    address owner;
    string text;
    address[] mentions;
  }

  mapping(bytes32 => Tweeth) public tweeths;

  mapping(address => uint256) public nonceCounter;

  function sendTweeth(string memory text, address[] memory mentions) public {
      uint256 nonce = nonceCounter[msg.sender]++;
      Tweeth storage newTweeth = tweeths[keccak256(abi.encodePacked(msg.sender, nonce))];

      newTweeth.nonce = nonce;
      newTweeth.owner = msg.sender;
      newTweeth.text = text;
      newTweeth.mentions = mentions;
  }

  function getTweeth(address owner, uint256 nonce) public view returns (Tweeth memory) {
      return tweeths[keccak256(abi.encodePacked(owner, nonce))];
  }
}
