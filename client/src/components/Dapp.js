import React, { useEffect, useState } from 'react'
import * as Web3 from 'web3'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'
import TweetherArtifact from '../contracts/Tweether.json'
import TweetherIdentityArtifact from '../contracts/TweetherIdentity.json'
import ENSRegistryArtifact from '../contracts/ENSRegistry.json'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'
import SearchTweeths from './SearchTweeths'

function Dapp() {
  const [showSendModal, setShowSendModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [displayOwnTweeths, setDisplayOwnTweeths] = useState(true)

  const [web3Provider, setWeb3Provider] = useState(undefined)
  const [account, setAccount] = useState(undefined)
  const [tweetherContract, setTweetherContract] = useState(undefined)
  const [tweetherIdentityContract, setTweetherIdentityContract] = useState(
    undefined
  )

  useEffect(() => {
    const init = async () => {
      window.ethereum.autoRefreshOnNetworkChange = false
      const web3Provider = new Web3(window.ethereum)

      const accounts = await web3Provider.eth.getAccounts()
      const account = accounts[0]

      const networkId = await web3Provider.eth.net.getId()
      if (networkId === 777) {
        web3Provider.eth.ens.registryAddress =
          ENSRegistryArtifact.networks[networkId].address

        const account1 = await web3Provider.eth.ens.getAddress('account1.eth')
        const account2 = await web3Provider.eth.ens.getAddress('account2.eth')
        const tweether = await web3Provider.eth.ens.getAddress('tweether.eth')
        const profile = await web3Provider.eth.ens.getAddress(
          'profile.tweether.eth'
        )
        console.log('ENS TEST', { account1, account2, tweether, profile })
      }

      const tweetherProxyAddress = await web3Provider.eth.ens.getAddress(
        'tweether.eth'
      )
      const tweetherContract = new web3Provider.eth.Contract(
        TweetherArtifact.abi,
        tweetherProxyAddress
      )

      const tweetherIdentityAddress = await web3Provider.eth.ens.getAddress(
        'profile.tweether.eth'
      )
      const tweetherIdentityContract = new web3Provider.eth.Contract(
        TweetherIdentityArtifact.abi,
        tweetherIdentityAddress
      )

      setWeb3Provider(web3Provider)
      setTweetherContract(tweetherContract)
      setTweetherIdentityContract(tweetherIdentityContract)
      setAccount(account)
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
          <Alert variant="info">Connected from account {account}</Alert>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowSendModal(true)}>
            Send a Tweeth
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setDisplayOwnTweeths(true)}>
            My Tweeths
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowProfileModal(true)}>
            My Profile
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <SearchTweeths
            displayOwnTweeths={displayOwnTweeths}
            cancelDisplayOwnTweeths={() => setDisplayOwnTweeths(false)}
            maxTweeths={10}
          />
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
