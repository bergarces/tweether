// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Proxy contract for Tweether */
contract TweetherProxy is Ownable {
  // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"

  /** @dev Constructor
    * @param _initialisingData Call mimicking the constructor to initialise the storage of the proxy
    * @param _contractLogic Address of the Tweether contract logic
    */
  constructor(bytes memory _initialisingData, address _contractLogic) public {
    assembly {
      sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, _contractLogic)
    }
    (bool success, ) = _contractLogic.delegatecall(_initialisingData);
    require(success, "Initialisation failed");
  }

  fallback() external payable {
    assembly {
      let contractLogic := sload(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7)
      calldatacopy(0x0, 0x0, calldatasize())
      let success := delegatecall(sub(gas(), 10000), contractLogic, 0x0, calldatasize(), 0, 0)
      let retSz := returndatasize()
      returndatacopy(0, 0, retSz)
      switch success
      case 0 {
        revert(0, retSz)
      }
      default {
        return(0, retSz)
      }
    }
  }
}