import React, { useEffect, useState } from 'react'
import * as Web3 from 'web3'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'
import TweetherArtifact from '../contracts/Tweether.json'

import SendTweethModal from './SendTweethModal'
import SearchTweeths from './SearchTweeths'

function Dapp() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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

      web3Provider.eth.ens.registryAddress = '0xD05eb4322Be68A45a5F82Bc69E552047c51078b4'
      const account1 = await web3Provider.eth.ens.getAddress('account1.test')
      const tweether = await web3Provider.eth.ens.getAddress('tweether.test')
      console.log({account1, tweether})
    }

    init()
  }, [])

  return (
    <Web3ProviderContext.Provider value={{ web3Provider, account, contract }}>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <Button variant="primary" onClick={handleShow}>
            Send a Tweeth!
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <SearchTweeths account={account} maxTweeths={10} />
        </Col>
      </Row>

      <SendTweethModal show={show} handleClose={handleClose} />
    </Web3ProviderContext.Provider>
  )
}

export default Dapp
