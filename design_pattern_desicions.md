# Dessign Patterns Used

## Circuit Breaker

As per project requirements, a circuit breaker has been added on the Tweether contract that prevents users from submitting new tweeths. This could be useful to pause the contract activity if a bug is found or whilst the contract is being upgraded. However, I would be reluctant to add such a mechanism on a final version of the product, as the idea behind this service is to be censorship resistant.

## Upgradable Contract

The Tweether contract has been deployed with an upgradable proxy. This way, if any new features such as additional Tweeth fields are added to the contract, e.g. mentions, hashtags or to create threads, it should be possible to upgrade the contract and keep the existing data intact.

The tweeth data stays in the proxy contract, which just delegates the execution of the calls to the delegate contract. The delegate contract can be changed as long as the storage layout is compatible with the previous one.

It is possible to implement upgradable contracts using the OpenZeppelin framework, but for this case I have used a method I'm already familiar with, in which it's not necessary to modify the layout of the main contract since we used a predefined storage slot for the contract logic, that being keccak256("PROXIABLE").

Since we are using an upgradable contract, a non-constructor method is used to initialise the proxy contract.

## Restricting Access

Both Tweether and TweetherIdentity implement the Ownable contract from OpenZeppelin in order to limit the methods the users have access to. Only the contract owner can change the maximum size of the string data that can be stored, toggle the circuit breaker and change the delegate for the proxy contract.