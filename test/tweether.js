const Tweether = artifacts.require("Tweether")
const defaults = require('../data/defaults')
const truffleAssert = require('truffle-assertions')

contract("Tweether", accounts => {
  let tweether

  before(async () => {
    tweether = await Tweether.deployed()
  })

  describe("maxBytes", () => {
    const newMaxBytes = defaults.MAX_BYTES * 2

    after(async () => {
      await tweether.setMaxBytes(defaults.MAX_BYTES, { from: accounts[0] })
    })

    it("should deploy with the default value", async () => {
      const maxBytes = await tweether.maxBytes()

      assert.equal(maxBytes, defaults.MAX_BYTES, "MaxBytes default value not correct after deployment")
    })
  
    it("should be able to update MaxBytes value", async () => {
      await tweether.setMaxBytes(newMaxBytes, { from: accounts[0] })
  
      const maxBytes = await tweether.maxBytes()
      assert.equal(maxBytes, newMaxBytes, "MaxBytes value not correct after changing")
    })
  
    it("should not be possible to update MaxBytes value with a non-owner account", async () => {
      await truffleAssert.fails(
        tweether.setMaxBytes(newMaxBytes, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })

  describe("maxMentions", () => {
    const newMaxMentions = defaults.MAX_MENTIONS * 2

    after(async () => {
      await tweether.setMaxMentions(defaults.MAX_MENTIONS, { from: accounts[0] })
    })

    it("should deploy with the default values", async () => {
      const maxMentions = await tweether.maxMentions()

      assert.equal(maxMentions, defaults.MAX_MENTIONS, "MaxMentions default value not correct after deployment")
    })

    it("should be able to update MaxMentions value", async () => {
      await tweether.setMaxMentions(newMaxMentions, { from: accounts[0] })
  
      const maxMentions = await tweether.maxMentions()
      assert.equal(maxMentions, maxMentions, "MaxMentions value not correct after changing")
    })
  
    it("should not be possible to update MaxMentions value with a non-owner account", async () => {
      await truffleAssert.fails(
        tweether.setMaxMentions(newMaxMentions, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })

  describe("sendTweeth", () => {
    it("should send a tweeth correctly", async () => {
      await tweether.sendTweeth("This is a Tweeth", [accounts[0], accounts[2]], { from: accounts[1] })

      const nonce = await tweether.nonceCounter(accounts[1]) - 1
      const tweeth = await tweether.getTweeth(accounts[1], 0)
      assert.equal(tweeth.owner, accounts[1], "Wrong owner")
      assert.equal(tweeth.nonce, nonce, "Wrong nonce")
      assert.equal(tweeth.text, "This is a Tweeth", "Wrong text")
      assert.deepEqual(tweeth.mentions, [accounts[0], accounts[2]], "Wrong mentions")
    })

    it("should fail to send a tweeth over the maximum number of bytes", async () => {
      const message = "x".repeat(defaults.MAX_BYTES + 1)

      await truffleAssert.fails(
        tweether.sendTweeth(message, [], { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("should fail to send a tweeth over the maximum number of mentions", async () => {
      const mentions = Array.from(Array(defaults.MAX_MENTIONS + 1).keys()).map(i => accounts[i])

      await truffleAssert.fails(
        tweether.sendTweeth("Test message", mentions, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })
})