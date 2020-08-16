const defaults = require('../data/defaults')

const TweetherProxy = artifacts.require("TweetherProxy");
const Tweether = artifacts.require("Tweether");
const TweetherIdentity = artifacts.require("TweetherIdentity");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(Tweether, defaults.MAX_BYTES_TWEETH)
    const tweether = await Tweether.deployed()

    const methodAbi = Tweether.abi.find(f => f.name === "setMaxTweethBytes")
    const encodeConstructorCall = web3.eth.abi.encodeFunctionCall(methodAbi, [defaults.MAX_BYTES_TWEETH])
    await deployer.deploy(TweetherProxy, encodeConstructorCall, tweether.address)

    await deployer.deploy(TweetherIdentity, defaults.MAX_BYTES_BIO)
  })
};
