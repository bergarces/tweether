const Tweether = artifacts.require("Tweether")
const defaults = require('../data/defaults')
const truffleAssert = require('truffle-assertions')

contract("Tweether", accounts => {
  const bytes32Zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

  let tweether

  before(async () => {
    tweether = await Tweether.deployed()
  })

  describe("maxTweethBytes", () => {
    const newMaxTweethBytes = defaults.MAX_BYTES_TWEETH * 2

    after(async () => {
      await tweether.setMaxTweethBytes(defaults.MAX_BYTES_TWEETH, { from: accounts[0] })
    })

    it("should deploy with the default value", async () => {
      const maxTweethBytes = await tweether.maxTweethBytes()

      assert.equal(maxTweethBytes, defaults.MAX_BYTES_TWEETH, "MaxTweethBytes default value not correct after deployment")
    })
  
    it("should be able to update MaxTweethBytes value", async () => {
      await tweether.setMaxTweethBytes(newMaxTweethBytes, { from: accounts[0] })
  
      const maxTweethBytes = await tweether.maxTweethBytes()
      assert.equal(maxTweethBytes, newMaxTweethBytes, "MaxTweethBytes value not correct after changing")
    })
  
    it("should not be possible to update MaxTweethBytes value with a non-owner account", async () => {
      await truffleAssert.fails(
        tweether.setMaxTweethBytes(newMaxTweethBytes, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })

  describe("sendTweeth", () => {
    it("should send a tweeth correctly", async () => {
      await tweether.sendTweeth("This is a Tweeth", web3.utils.hexToBytes(bytes32Zero), { from: accounts[1] })

      const nonce = await tweether.nonceCounter(accounts[1]) - 1
      const tweeth = await tweether.getTweeth(accounts[1], nonce)
      assert.equal(tweeth.sender, accounts[1], "Wrong sender")
      assert.equal(tweeth.nonce, nonce, "Wrong nonce")
      assert.equal(tweeth.replyTo, bytes32Zero, "Wrong reply hash")
      assert.equal(tweeth.message, "This is a Tweeth", "Wrong message")
      assert.isOk(tweeth.timestamp, "No timestamp")
    })

    it("should be possible to reply to an existing tweeth", async () => {
      const tweethHash = await tweether.getTweethHash(accounts[1], 0)

      await tweether.sendTweeth("This is a reply to a Tweeth", web3.utils.hexToBytes(tweethHash), { from: accounts[2] })
      const nonce = await tweether.nonceCounter(accounts[2]) - 1
      const tweeth = await tweether.getTweeth(accounts[2], nonce)
      assert.equal(tweeth.sender, accounts[2], "Wrong sender")
      assert.equal(tweeth.nonce, nonce, "Wrong nonce")
      assert.equal(tweeth.replyTo, tweethHash, "Wrong reply hash")
      assert.equal(tweeth.message, "This is a reply to a Tweeth", "Wrong message")
      assert.isOk(tweeth.timestamp, "No timestamp")
    })

    it("should fail to send a tweeth over the maximum number of bytes", async () => {
      const message = "x".repeat(defaults.MAX_BYTES_TWEETH + 1)

      await truffleAssert.fails(
        tweether.sendTweeth(message, web3.utils.hexToBytes(bytes32Zero), { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT,
        "Maximum byte length for tweeth exceeded."
      )
    })
  })

  describe("toggleCircuitBreaker", () => {
    it("should prevent sending new tweeths after it's been toggled", async () => {
      await tweether.toggleCircuitBreaker()

      const circuitBreakerStatus = await tweether.circuitBreaker()

      assert.isOk(circuitBreakerStatus)
      await truffleAssert.fails(
        tweether.sendTweeth("Test tweeth", web3.utils.hexToBytes(bytes32Zero), { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("should be possible to enable sending new tweeths again", async () => {
      await tweether.toggleCircuitBreaker()

      const circuitBreakerStatus = await tweether.circuitBreaker()

      assert.isNotOk(circuitBreakerStatus)
      await tweether.sendTweeth("Test tweeth", web3.utils.hexToBytes(bytes32Zero), { from: accounts[1] })
    })
  })
})