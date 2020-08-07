const defaults = require('../data/defaults')

const Tweether = artifacts.require("Tweether");
const TweetherIdentity = artifacts.require("TweetherIdentity");

module.exports = function(deployer) {
  deployer.deploy(Tweether, defaults.MAX_BYTES_TWEETH, defaults.MAX_MENTIONS);
  deployer.deploy(TweetherIdentity, defaults.MAX_BYTES_BIO);
};
