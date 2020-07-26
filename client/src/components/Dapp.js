import React, { useEffect, useState } from 'react'
import * as Web3 from 'web3'

import Web3ProviderContext from '../contexts/Web3ProviderContext'
import TweetherArtifact from '../contracts/Tweether.json'

import SendTweeth from './SendTweeth'
import Tweeth from './Tweeth'
import UserTweeths from './UserTweeths'

function Dapp() {
  const [web3Provider, setWeb3Provider] = useState(undefined)
  const [account, setAccount] = useState(undefined)
  const [contract, setContract] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      const web3Provider = new Web3(window.ethereum)

      const accounts = await web3Provider.eth.getAccounts()
      const account = accounts[0]

      const networkId = await web3Provider.eth.net.getId()
      const contractAddress = TweetherArtifact.networks[networkId].address
      const contract = new web3Provider.eth.Contract(
        TweetherArtifact.abi,
        contractAddress,
        {
          from: account,
        }
      )

      setWeb3Provider(web3Provider)
      setContract(contract)
      setAccount(account)
    }

    init()
  }, [])

  return (
    <Web3ProviderContext.Provider value={{ web3Provider, account, contract }}>
      <div>
        <SendTweeth />
        <br />
        <br />
        <UserTweeths account={account} maxTweeths={10} />
      </div>
    </Web3ProviderContext.Provider>
  )
}

export default Dapp
