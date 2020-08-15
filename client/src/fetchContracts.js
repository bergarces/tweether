import TweetherArtifact from './contracts/Tweether.json'
import TweetherProxyArtifact from './contracts/TweetherProxy.json'
import TweetherIdentityArtifact from './contracts/TweetherIdentity.json'

const fetchContracts = async (web3Provider, ens, networkId) => {
  let tweetherProxyAddress
  try {
    tweetherProxyAddress = await ens.resolver('tweether.eth').addr()
  } catch (error) {
    console.error(
      'Cannot resolve TweetherProxy contract address using ENS',
      error
    )
    const deployedContract = TweetherProxyArtifact.networks[networkId]
    tweetherProxyAddress = deployedContract && deployedContract.address
  }

  const tweetherContract = new web3Provider.eth.Contract(
    TweetherArtifact.abi,
    tweetherProxyAddress
  )

  let tweetherIdentityAddress
  try {
    tweetherIdentityAddress = await ens.resolver('identity.tweether.eth').addr()
  } catch (error) {
    console.error(
      'Cannot resolve TweetherIdentity contract address using ENS',
      error
    )
    const deployedContract = TweetherIdentityArtifact.networks[networkId]
    tweetherIdentityAddress = deployedContract && deployedContract.address
  }

  const tweetherIdentityContract = new web3Provider.eth.Contract(
    TweetherIdentityArtifact.abi,
    tweetherIdentityAddress
  )

  return {
    tweetherContract,
    tweetherIdentityContract,
  }
}

export default fetchContracts
