import ENSRegistryArtifact from './contracts/ENSRegistry.json'
import TweetherArtifact from './contracts/Tweether.json'
import TweetherProxyArtifact from './contracts/TweetherProxy.json'
import TweetherIdentityArtifact from './contracts/TweetherIdentity.json'

const fetchContracts = async web3Provider => {
  const networkId = await web3Provider.eth.net.getId()
  if (networkId > 10) {
    web3Provider.eth.ens.registryAddress =
      ENSRegistryArtifact.networks[networkId].address
  }

  let tweetherProxyAddress
  try {
    tweetherProxyAddress = await web3Provider.eth.ens.getAddress(
      'tweether.eth'
    )
  } catch (error) {
    const deployedContract = TweetherProxyArtifact.networks[networkId]
    tweetherProxyAddress = deployedContract && deployedContract.address
  }

  const tweetherContract = new web3Provider.eth.Contract(
    TweetherArtifact.abi,
    tweetherProxyAddress
  )

  let tweetherIdentityAddress
  try {
    tweetherIdentityAddress = await web3Provider.eth.ens.getAddress(
      'identity.tweether.eth'
    )
  } catch (error) {
    const deployedContract = TweetherIdentityArtifact.networks[networkId]
    tweetherIdentityAddress = deployedContract && deployedContract.address
  }

  const tweetherIdentityContract = new web3Provider.eth.Contract(
    TweetherIdentityArtifact.abi,
    tweetherIdentityAddress
  )

  return {
    tweetherContract,
    tweetherIdentityContract
  }
}

export default fetchContracts
