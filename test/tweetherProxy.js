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
  
    it("can update setMaxTweethBytes from the proxy", async () => {
      await tweether.setMaxTweethBytes(newMaxTweethBytes, { from: accounts[0] })
  
      const maxTweethBytes = await tweether.maxTweethBytes()
      assert.equal(maxTweethBytes, newMaxTweethBytes, "MaxTweethBytes value not correct after changing")
    })
  })

  describe("sendTweeth", () => {
    it("can send a tweeth from proxy", async () => {
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
    it("can toggle circuit breaker from proxy", async () => {
      await tweether.toggleCircuitBreaker()
      assert.isOk(await tweether.circuitBreaker())

      await tweether.toggleCircuitBreaker()
      assert.isNotOk(await tweether.circuitBreaker())
    })
  })

  describe("updateCodeAddress", () => {
    it("can upgrade the proxy contract", async () => {
      // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
      const contractLogicField = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"

      // Deploys first version of Tweether
      const tweetherV1 = await Tweether.new(defaults.MAX_BYTES_TWEETH)

      // Deploys proxy using TweetherV1
      const methodAbi = Tweether.abi.find(f => f.name === "setMaxTweethBytes")
      const encodeConstructorCall = web3.eth.abi.encodeFunctionCall(methodAbi, [defaults.MAX_BYTES_TWEETH])
      const tweetherProxyAddress = (await TweetherProxy.new(encodeConstructorCall, tweetherV1.address)).address
      const tweetherProxy = await Tweether.at(tweetherProxyAddress)
      
      // Asserts that address of the contract logic is TweetherV1
      let delegateAddress
      delegateAddress = await web3.eth.getStorageAt(tweetherProxy.address, contractLogicField)
      assert.equal(delegateAddress.toLowerCase(), tweetherV1.address.toLowerCase())

      // Deploys second version of Tweether
      const tweetherV2 = await Tweether.new(defaults.MAX_BYTES_TWEETH)

      // Updates proxy contract using TweetherV2
      await tweetherProxy.updateImplementation(tweetherV2.address)

      // Asserts that address of the contract logic is TweetherV2
      delegateAddress = await web3.eth.getStorageAt(tweetherProxy.address, contractLogicField)
      assert.equal(delegateAddress.toLowerCase(), tweetherV2.address.toLowerCase())
    })
  })
})