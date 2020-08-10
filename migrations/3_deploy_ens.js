// Code based on the snippet provided on the ENS documentation page
// https://docs.ens.domains/deploying-ens-on-a-private-chain#migration-file-example

const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");
const FIFSRegistrar = artifacts.require("@ensdomains/ens/FIFSRegistrar");
const ReverseRegistrar = artifacts.require("@ensdomains/ens/ReverseRegistrar");
const PublicResolver = artifacts.require("@ensdomains/resolver/PublicResolver");
const TweetherProxy = artifacts.require("TweetherProxy");
const TweetherIdentity = artifacts.require("TweetherIdentity");

const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const tld = "eth";

const TWEETHER_LABEL = "tweether"
const TWEETHER_ROOT_LABEL = `${TWEETHER_LABEL}.${tld}`
const TWEETHER_NODE = namehash.hash(TWEETHER_ROOT_LABEL)

const PROFILE_LABEL = "identity"
const PROFILE_ROOT_LABEL = `${PROFILE_LABEL}.${TWEETHER_LABEL}.${tld}`
const PROFILE_NODE = namehash.hash(PROFILE_ROOT_LABEL)

const ACCOUNT1_LABEL = "account1"
const ACCOUNT1_ROOT_LABEL = `${ACCOUNT1_LABEL}.${tld}`
const ACCOUNT1_NODE = namehash.hash(ACCOUNT1_ROOT_LABEL)

const ACCOUNT2_LABEL = "account2"
const ACCOUNT2_ROOT_LABEL = `${ACCOUNT2_LABEL}.${tld}`
const ACCOUNT2_NODE = namehash.hash(ACCOUNT2_ROOT_LABEL)

module.exports = function(deployer, network, accounts) {
  if(deployer.network_id < 10){
    return
  }

  let ens;
  let resolver;
  let registrar;

  // Registry
  deployer.deploy(ENS)
  // Resolver
  .then(function(ensInstance) {
    ens = ensInstance;
    return deployer.deploy(PublicResolver, ens.address);
  })
  .then(function(resolverInstance) {
    resolver = resolverInstance;
    return setupResolver(ens, resolver, accounts);
  })
  // Registrar
  .then(function() {
    return deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(tld));
  })
  .then(function(registrarInstance) {
    registrar = registrarInstance;
    return setupRegistrar(ens, registrar);
  })
  // Reverse Registrar
  .then(function() {
    return deployer.deploy(ReverseRegistrar, ens.address, resolver.address);
  })
  .then(function(reverseRegistrarInstance) {
    return setupReverseRegistrar(ens, resolver, reverseRegistrarInstance, accounts);
  })
  .then(function() {
    return setupAddresses(registrar, resolver, ens, accounts)
  })
};

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = utils.sha3("resolver");

  await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);
}

async function setupRegistrar(ens, registrar) {
  await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", utils.sha3(tld), registrar.address);
}

async function setupReverseRegistrar(ens, resolver, reverseRegistrar, accounts) {
  await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", utils.sha3("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), utils.sha3("addr"), reverseRegistrar.address);
}

async function setupAddresses(registrar, resolver, ens, accounts) {
  const tweetherProxy = await TweetherProxy.deployed()
  const profile = await TweetherIdentity.deployed()

  await registrar.register(utils.sha3(ACCOUNT1_LABEL), accounts[0])
  await ens.setResolver(ACCOUNT1_NODE, resolver.address)
  await resolver.setAddr(ACCOUNT1_NODE, accounts[0])

  await registrar.register(utils.sha3(ACCOUNT2_LABEL), accounts[0])
  await ens.setResolver(ACCOUNT2_NODE, resolver.address)
  await resolver.setAddr(ACCOUNT2_NODE, accounts[1])

  await registrar.register(utils.sha3(TWEETHER_LABEL), accounts[0])
  await ens.setResolver(TWEETHER_NODE, resolver.address)
  await resolver.setAddr(TWEETHER_NODE, tweetherProxy.address)

  await ens.setSubnodeOwner(TWEETHER_NODE, utils.sha3(PROFILE_LABEL), accounts[0]);
  await ens.setResolver(PROFILE_NODE, resolver.address)
  await resolver.setAddr(PROFILE_NODE, profile.address)
}