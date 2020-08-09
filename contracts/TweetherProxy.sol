// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// Code based on
// https://fravoll.github.io/solidity-patterns/proxy_delegate.html
// https://medium.com/better-programming/solidity-0-6-x-features-fallback-and-receive-functions-69895e3ffe
contract TweetherProxy {

  address internal delegate;
  address owner = msg.sender;

  /** @dev Update delegate contract
    * @param newDelegateAddress New address for the delegate contract
    */
  function upgradeDelegate(address newDelegateAddress) public {
    require(msg.sender == owner);
    delegate = newDelegateAddress;
  }

  fallback() external payable {
    address addr = delegate;

    assembly {
      calldatacopy(0, 0, calldatasize())
      let result := delegatecall(gas(), addr, 0, calldatasize(), 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 { revert(0, returndatasize()) }
      default { return(0, returndatasize()) }
    }
  }
}