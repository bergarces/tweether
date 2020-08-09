const defaults = require('../data/defaults')

const TweetherProxy = artifacts.require("TweetherProxy");
const Tweether = artifacts.require("Tweether");
const TweetherIdentity = artifacts.require("TweetherIdentity");

module.exports = function(deployer) {
  let tweetherProxy;

  deployer.deploy(TweetherProxy)
  .then(function(tweetherProxyInstance) {
    tweetherProxy = tweetherProxyInstance;
    return deployer.deploy(Tweether, defaults.MAX_BYTES_TWEETH);
  })
  .then(function(tweetherInstance) {
    return setupProxy(tweetherProxy, tweetherInstance);
  });

  deployer.deploy(TweetherIdentity, defaults.MAX_BYTES_BIO);
};

async function setupProxy(proxy, delegate) {
  await proxy.upgradeDelegate(delegate.address)
}
