import React, { useEffect, useState } from 'react'
import * as Web3 from 'web3'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'
import TweetherArtifact from '../contracts/Tweether.json'
import TweetherIdentityArtifact from '../contracts/TweetherIdentity.json'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'
import SearchTweeths from './SearchTweeths'

function Dapp() {
  const [showSendModal, setShowSendModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const [web3Provider, setWeb3Provider] = useState(undefined)
  const [account, setAccount] = useState(undefined)
  const [tweetherContract, setTweetherContract] = useState(undefined)
  const [tweetherIdentityContract, setTweetherIdentityContract] = useState(
    undefined
  )

  useEffect(() => {
    const init = async () => {
      const web3Provider = new Web3(window.ethereum)

      const accounts = await web3Provider.eth.getAccounts()
      const account = accounts[0]

      const networkId = await web3Provider.eth.net.getId()
      const tweetherAddress = TweetherArtifact.networks[networkId].address
      const tweetherContract = new web3Provider.eth.Contract(
        TweetherArtifact.abi,
        tweetherAddress
      )

      const tweetherIdentityAddress =
        TweetherIdentityArtifact.networks[networkId].address
      const tweetherIdentityContract = new web3Provider.eth.Contract(
        TweetherIdentityArtifact.abi,
        tweetherIdentityAddress
      )

      console.log({ tweetherContract, tweetherIdentityContract })

      setWeb3Provider(web3Provider)
      setTweetherContract(tweetherContract)
      setTweetherIdentityContract(tweetherIdentityContract)
      setAccount(account)

      web3Provider.eth.ens.registryAddress =
        '0x0D3813917F0374B1644083bAd4ea844CFB6cAac5'
      const account1 = await web3Provider.eth.ens.getAddress('account1.test')
      const tweether = await web3Provider.eth.ens.getAddress('tweether.test')
      const profile = await web3Provider.eth.ens.getAddress(
        'profile.tweether.test'
      )
      console.log('ENS TEST', { account1, tweether, profile })
    }

    init()
  }, [])

  return (
    <Web3ProviderContext.Provider
      value={{
        web3Provider,
        account,
        tweetherContract,
        tweetherIdentityContract,
      }}
    >
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowSendModal(true)}>
            Send a Tweeth!
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowProfileModal(true)}>
            Your Profile
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <SearchTweeths maxTweeths={10} />
        </Col>
      </Row>

      <SendTweethModal
        show={showSendModal}
        handleClose={() => setShowSendModal(false)}
      />
      <IdentityModal
        address={account}
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
      />
    </Web3ProviderContext.Provider>
  )
}

export default Dapp
