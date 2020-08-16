// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Proxiable.sol";

/** @title Send and view Tweeths */
contract Tweether is Ownable, Proxiable {
  event TweethSent(
    address indexed _sender,
    uint256 indexed _nonce,
    bytes32 indexed _replyTo,
    string _message
  );

  struct Tweeth {
    address sender;
    uint256 nonce;
    bytes32 replyTo;
    string message;
    uint256 timestamp;
  }

  uint256 public maxTweethBytes;

  mapping(bytes32 => Tweeth) public tweeths;
  mapping(address => uint256) public nonceCounter;

  bool public circuitBreaker;

  /** @dev Constructor
    * @param _maxTweethBytes Maximum number of bytes.
    */
  constructor(uint256 _maxTweethBytes) public {
    maxTweethBytes = _maxTweethBytes;
  }

  /** @dev Toggles the circuit breaker to prevent sending new tweeths.
    */
  function toggleCircuitBreaker() public onlyOwner {
    circuitBreaker = !circuitBreaker;
  }

  /** @dev Set the maximum amount of bytes that messages can have.
    * @param _maxTweethBytes Maximum number of bytes.
    */
  function setMaxTweethBytes(uint256 _maxTweethBytes) public onlyOwner {
    maxTweethBytes = _maxTweethBytes;
  }

  /** @dev Sends a tweeth.
    * @param _message Message that will be sent.
    * @param _replyTo Hash of the tweeth this one replies to
    */
  function sendTweeth(string memory _message, bytes32 _replyTo) public {
    require(!circuitBreaker, "Circuit breaker activated, sending tweeths temporarily disallowed");
    require(bytes(_message).length <= maxTweethBytes, "Maximum byte length for tweeth exceeded");
    require(_replyTo == 0x0000000000000000000000000000000000000000000000000000000000000000
      || tweeths[_replyTo].sender != 0x0000000000000000000000000000000000000000, "The Tweeth referenced does not exist");

    uint256 nonce = nonceCounter[msg.sender]++;
    Tweeth storage newTweeth = tweeths[keccak256(abi.encodePacked(msg.sender, nonce))];

    newTweeth.sender = msg.sender;
    newTweeth.nonce = nonce;
    newTweeth.replyTo = _replyTo;
    newTweeth.message = _message;
    newTweeth.timestamp = block.timestamp;

    emit TweethSent(msg.sender, nonce, _replyTo, _message);
  }

  /** @dev Retrieves a tweeth from the address of the sender and the nonce.
    * @param _sender Sender of the tweeth.
    * @param _nonce Nonce of the tweeth.
    * @return Tweeth for the corresponding _sender and _nonce.
    */
  function getTweeth(address _sender, uint256 _nonce) public view returns (Tweeth memory) {
    return tweeths[keccak256(abi.encodePacked(_sender, _nonce))];
  }

  /** @dev Retrieves a tweeth hash from the address of the sender and the nonce.
    * @param _sender Sender of the tweeth.
    * @param _nonce Nonce of the tweeth.
    * @return Tweeth hash for the corresponding _sender and _nonce.
    */
  function getTweethHash(address _sender, uint256 _nonce) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(_sender, _nonce));
  }

  /**
    * Sets the address of the proxy contract
    * @param _newContractLogic The address of the new DocumentRegistry
    */
  function updateImplementation(address _newContractLogic) public onlyOwner {
    updateCodeAddress(_newContractLogic);
  }
}
