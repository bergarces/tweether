# Avoiding Common Attacks

The attacks come from the following list [https://swcregistry.io/](https://swcregistry.io/)

## SWC-118 Incorrect Constructor Name

[https://swcregistry.io/docs/SWC-118](https://swcregistry.io/docs/SWC-118)

This issue occurs when the name of contract is used for the constructor, as a typo could cause the constructor not to run and for an attacker to take advantage by calling the method as a normal function.

With the introduction of the `constructor` function on Solidity 0.4.22 this can be mitigated. This is the method used in this project to stop the attack.

One example of how this vulnerability can be exploited can be found on [Ethernaut exercise Fallout](https://ethernaut.openzeppelin.com/level/0x220beee334f1c1f8078352d88bcc4e6165b792f6)

## SWC-115 Authorization through tx.origin

[https://swcregistry.io/docs/SWC-115](https://swcregistry.io/docs/SWC-115)

There's a significant difference between tx.origin and msg.sender. The first one always refers to the originator of the transaction whilst, the second, refers to the user wallet or contract that called the method.

By using msg.sender instead of tx.origin we potentially prevent that a smart contract impersonates a user and sends a tweeth on their behalf if the user gets tricked into sending a transaction to the attacker contract.

## SWC-102 Outdated Compiler Version

[https://swcregistry.io/docs/SWC-102](https://swcregistry.io/docs/SWC-102)

Following the recommendation from the list of potential attacks. Version ^0.6.0 is being used.