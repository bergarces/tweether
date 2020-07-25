const defaults = require('../data/defaults')

const Tweether = artifacts.require("Tweether");

module.exports = function(deployer) {
  deployer.deploy(Tweether, defaults.MAX_BYTES, defaults.MAX_MENTIONS);
};
