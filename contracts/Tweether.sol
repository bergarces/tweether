// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Send and view Tweeths */
contract Tweether is Ownable {
  event TweethSent(
    address indexed _owner,
    uint256 indexed _nonce,
    string _message
  );

  event TweethMention(
    address indexed _owner,
    uint256 indexed _nonce,
    address indexed _mention,
    string _message
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

  /** @dev Set the maximum amount of bytes that messages can have.
    * @param _maxTweethBytes Maximum number of bytes.
    */
  function setMaxTweethBytes(uint256 _maxTweethBytes) public onlyOwner {
    maxTweethBytes = _maxTweethBytes;
  }

  /** @dev Set the maximum amount of mentions that messages can have.
    * @param _maxMentions Maximum number of mentions.
    */
  function setMaxMentions(uint256 _maxMentions) public onlyOwner {
    maxMentions = _maxMentions;
  }

  /** @dev Sends a tweeth.
    * @param _message Message that will be sent.
    * @param _mentions Array of addresses that will be mentioned.
    */
  function sendTweeth(string memory _message, address[] memory _mentions) public {
    require(bytes(_message).length <= maxTweethBytes, "Maximum byte length for tweeth exceeded");
    require(_mentions.length <= maxMentions, "Maximum mentions exceeded");

    uint256 nonce = nonceCounter[msg.sender]++;
    Tweeth storage newTweeth = tweeths[keccak256(abi.encodePacked(msg.sender, nonce))];

    newTweeth.owner = msg.sender;
    newTweeth.nonce = nonce;
    newTweeth.message = _message;
    newTweeth.mentions = _mentions;

    emit TweethSent(msg.sender, nonce, _message);

    // Mentions are limited by design, so it shouldn't be possible to send enough to run out of gas.
    for (uint256 i = 0; i < _mentions.length; i++) {
      emit TweethMention(msg.sender, nonce, _mentions[i], _message);
    }
  }

  /** @dev Retrieves a tweeth from the address of the sender and the nonce.
    * @param _sender Sender of the tweeth.
    * @param _nonce Nonce of the tweeth.
    * @return Tweeth The corresponding tweeth for the _sender and _nonce.
    */
  function getTweeth(address _sender, uint256 _nonce) public view returns (Tweeth memory) {
    return tweeths[keccak256(abi.encodePacked(_sender, _nonce))];
  }
}
