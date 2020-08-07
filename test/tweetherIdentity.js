const TweetherIdentity = artifacts.require("TweetherIdentity")
const defaults = require('../data/defaults')
const truffleAssert = require('truffle-assertions')

contract("TweetherIdentity", accounts => {
  let tweetherIdentity

  before(async () => {
    tweetherIdentity = await TweetherIdentity.deployed()
  })

  describe("maxBioBytes", () => {
    const newMaxBioBytes = defaults.MAX_BYTES_BIO * 2

    after(async () => {
      await tweetherIdentity.setMaxBioBytes(defaults.MAX_BYTES_BIO, { from: accounts[0] })
    })

    it("should deploy with the default value", async () => {
      const maxBioBytes = await tweetherIdentity.maxBioBytes()

      assert.equal(maxBioBytes, defaults.MAX_BYTES_BIO, "MaxBioBytes default value not correct after deployment")
    })
  
    it("should be able to update MaxBioBytes value", async () => {
      await tweetherIdentity.setMaxBioBytes(newMaxBioBytes, { from: accounts[0] })
  
      const maxBioBytes = await tweetherIdentity.maxBioBytes()
      assert.equal(maxBioBytes, newMaxBioBytes, "MaxBioBytes value not correct after changing")
    })
  
    it("should not be possible to update MaxBioBytes value with a non-owner account", async () => {
      await truffleAssert.fails(
        tweetherIdentity.setMaxBioBytes(newMaxBioBytes, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })

  describe("setBio", () => {
    it("should set a new bio correctly", async () => {
      await tweetherIdentity.setBio("This is my bio", { from: accounts[1] })

      const bio = await tweetherIdentity.bio(accounts[1])
      assert.equal(bio, "This is my bio", "Wrong bio")
    })

    it("should fail to set a bio over the maximum number of bytes", async () => {
      const bio = "x".repeat(defaults.MAX_BYTES_BIO + 1)

      await truffleAssert.fails(
        tweetherIdentity.setBio(bio, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      )
    })
  })
})