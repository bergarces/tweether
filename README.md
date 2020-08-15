# Tweether

Tweether is a censorship-resistant microblogging Dapp that allows the user to send messages to the Ethereum network.

The Dapp has the following features:
 - Button to enable the ethereum provider as per the [current recommendation](https://docs.metamask.io/guide/getting-started.html#basic-considerations)
 - Send Tweeths from the connected account.
 - View your own Tweeths
 - Search for other user Tweeths either via their address or by their ENS name.
 - Change your bio details for others to read.
 - View the bio details of other users.

## Contracts

### TweetherIdentity

This contract just allows the user to set a bio/description for its account and fetch the bio of any other account. The bio has a limited number of bytes.

The reason we use bytes for the length instead of characters is because the solidity logic to get the length of characters would increase the cost of using it, since utf can have characters of multiple bytes. The length can be adjusted by the contract owner.

### Tweether

This contract allows the user to submit new tweeths, whether they are new ones or replies. It also allows to get the content of existing tweeths.

The tweeth message length is also limited by bytes length, and this length can be modified by the owner of the contract.

### TweetherProxy

In order to allow upgrades for the Tweether contract, a proxy upgrade pattern is being used. This is the contract that has the storage and it just delegates call to the Tweether contract, which can be changed by the owner at any given point.

# Requirements

 - Node 10
 - Browser with Metamask installed (preferably Chrome)

# Set Up
In order to set the project up on for local development. Node 10 is needed. Dependencies such as truffle and ganache-cli are installed in the project and npm scripts are provided so that there are no version issues.

The setup process consists on starting a local blockchain, deploy contracts and starting the client.

Start by cloning the code locally and moving to the root directory, and install dependencies with:

`npm i`

Then start a local blockchain with a **predefined seed** and on **Chain Id 777** with:

`npm run ganache`

The predefined seed allows you to always import the same private accounts to Metamask for testing. It is possible to create different seeds each time, but then different accounts will need to be imported to Metamask.

Finally, run the following command to deploy contracts, which include a local ENS registry and name setup for contracts, as well as the first two predefined account for ganache.

`npm run migrate`

Once the previous step is completed successfully, move into the client directory and start the React app:
```
cd client
npm i
npm start
```

If everything started successfully, the Dapp should open on `localhost:3000`. Ensure that the browser used has Metamask installed. And that **Metamask is network is set to localhost:8545**.

# Import Metamask accounts
In order to use the Dapp from a local setup, ensure Metamask netwrok is set to `localhost:8545`. Then import the following two accounts using the private keys (which are the ones generated with ganache):
 - `0x0421c41069a3076f8fa4e99539a1a5e41c9655f2f9232374ea868666ea0312bb`
 - `0x93b23ab99bf3c9ffb1dedbc99c50bbfb63e0b12e78414e0ab294b3ece8379032`

Each of these accounts should have a high amount of ether.

# ENS Names
The following domain names are set up during migration if the Chain Id is set to 777.
 - `tweether.eth` for the main contract.
 - `identity.tweether.eth` for the contract that keeps the user profile.
 - `account1.eth` for the first imported account.
 - `account2.eth` for the second imported account.

# Rinkeby

The contracts and ENS (for `tweether.eth` and `identity.tweether.eth` only) are deployed and set up on the Rinkeby network, so it should be possible to use it by switching Metamask network to Rinkeby.

# TODO
 - Add reverse name resolution.
 - Select numbers of tweeths to display and add pagination.
 - Add support for avatars.
 - Add support for threads.
 - Add support for mentions.
 - Add support for hashtags.
 - Review UI/UX.