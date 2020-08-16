const Tweether = artifacts.require("Tweether")
const TweetherProxy = artifacts.require("TweetherProxy")
const defaults = require('../data/defaults')
const truffleAssert = require('truffle-assertions')

contract("TweetherProxy", accounts => {
  const bytes32Zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

  let tweetherProxy
  let tweether

  before(async () => {
    tweetherProxy = await TweetherProxy.deployed()
    tweether = await Tweether.at(tweetherProxy.address)
  })

  describe("maxTweethBytes", () => {
    const newMaxTweethBytes = defaults.MAX_BYTES_TWEETH * 2

    after(async () => {
      await tweether.setMaxTweethBytes(defaults.MAX_BYTES_TWEETH, { from: accounts[0] })
    })
  
    it("should update setMaxTweethBytes from the proxy", async () => {
      await tweether.setMaxTweethBytes(newMaxTweethBytes, { from: accounts[0] })
  
      const maxTweethBytes = await tweether.maxTweethBytes()
      assert.equal(maxTweethBytes, newMaxTweethBytes, "MaxTweethBytes value not correct after changing")
    })
  })

  describe("sendTweeth", () => {
    it("should send a tweeth from proxy", async () => {
      await tweether.sendTweeth("This is a Tweeth", web3.utils.hexToBytes(bytes32Zero), { from: accounts[1] })

      const nonce = await tweether.nonceCounter(accounts[1]) - 1
      const tweeth = await tweether.getTweeth(accounts[1], nonce)
      assert.equal(tweeth.sender, accounts[1], "Wrong sender")
      assert.equal(tweeth.nonce, nonce, "Wrong nonce")
      assert.equal(tweeth.replyTo, bytes32Zero, "Wrong reply hash")
      assert.equal(tweeth.message, "This is a Tweeth", "Wrong message")
      assert.isOk(tweeth.timestamp, "No timestamp")
    })
  })

  describe("toggleCircuitBreaker", () => {
    it("should toggle circuit breaker from proxy", async () => {
      await tweether.toggleCircuitBreaker({ from: accounts[0] })
      assert.isOk(await tweether.circuitBreaker())

      await tweether.toggleCircuitBreaker({ from: accounts[0] })
      assert.isNotOk(await tweether.circuitBreaker())
    })
  })

  describe("updateCodeAddress", () => {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    const contractLogicField = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    let tweetherV1
    let tweetherV2
    let tweetherProxy

    before(async () => {
      // Deploys two versions of Tweether
      tweetherV1 = await Tweether.new(defaults.MAX_BYTES_TWEETH)
      tweetherV2 = await Tweether.new(defaults.MAX_BYTES_TWEETH)

      // Deploys proxy using TweetherV1
      const methodAbi = Tweether.abi.find(f => f.name === "setMaxTweethBytes")
      const encodeConstructorCall = web3.eth.abi.encodeFunctionCall(methodAbi, [defaults.MAX_BYTES_TWEETH])
      const tweetherProxyAddress = (await TweetherProxy.new(encodeConstructorCall, tweetherV1.address)).address
      tweetherProxy = await Tweether.at(tweetherProxyAddress)
    })

    it("should upgrade the proxy contract", async () => {
      // Asserts that address of the contract logic is TweetherV1
      let delegateAddress
      delegateAddress = await web3.eth.getStorageAt(tweetherProxy.address, contractLogicField)
      assert.equal(delegateAddress.toLowerCase(), tweetherV1.address.toLowerCase())

      // Updates proxy contract using TweetherV2
      await tweetherProxy.updateImplementation(tweetherV2.address, { from: accounts[0] })

      // Asserts that address of the contract logic is TweetherV2
      delegateAddress = await web3.eth.getStorageAt(tweetherProxy.address, contractLogicField)
      assert.equal(delegateAddress.toLowerCase(), tweetherV2.address.toLowerCase())
    })

    it("should fail to upgrade from a non-owner account", async () => {
      await truffleAssert.fails(
        tweetherProxy.updateImplementation(tweetherV2.address, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })
})