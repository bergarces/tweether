const path = require("path");
// const fs = require('fs');
// const HDWalletProvider = require('@truffle/hdwallet-provider');

// const infuraKey = fs.readFileSync(".infura_key").toString().trim();
// const mnemonic = fs.readFileSync(".address_mnemonic").toString().trim();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
    },
    // rinkeby: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
    //   network_id: 4,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    // },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "^0.6.0",
    },
  },
};
