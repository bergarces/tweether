# Tweether

Tweether is a censorship-resistant microblogging Dapp that allows the user to send messages to the Ethereum network.

The Dapp has the following features:
 - Button to enable the ethereum provider as per the [current recommendation](https://docs.metamask.io/guide/getting-started.html#basic-considerations)
 - Send Tweeths from the connected account.
 - View your own Tweeths
 - Search for other user Tweeths either via their address or by their ENS name.
 - Change your bio details for others to read.
 - View the bio details of other users.

# Requirements

 - Node 10
 - Browser with Metamask installed (preferably Chrome)

# Set Up
In order to set the project up on for local development. Node 10 is needed. Dependencies such as truffle and ganache-cli are installed in the project and npm scripts are provided so that there are no version issues.

The setup process consists on starting a local blockchain, deploy contracts and starting the client.

Start by cloning the code locally and moving to the root directory, and install dependencies with:

`npm i`

Then start a local blockchain with a **predefined seed** and on **Chain Id 777** with:

`npm ganache`

The predefined seed allows you to always import the same private accounts to Metamask for testing. It is possible to create different seeds each time, but then different accounts will need to be imported to Metamask.

Finally, run the following command to deploy contracts, which include a local ENS registry and name setup for contracts, as well as the first two predefined account for ganache.

`npm migrate`

Once the previous step is completed successfully, move into the client directory and start the React app:
```
cd client
npm start
```

If everything started successfully, the Dapp should open on `localhost:3000`. Ensure that the browser used has Metamask installed.

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

# TODO
 - Add reverse name resolution.
 - Select numbers of tweeths to display and add pagination.
 - Add support for avatars.
 - Add support for threads.
 - Add support for mentions.
 - Add support for hashtags.
 - Review UI/UX.