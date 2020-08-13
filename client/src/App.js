import React, { useEffect, useState } from 'react'
import * as Web3 from 'web3'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

import './App.scss'
import Dapp from './components/Dapp'
import Web3ProviderContext from './contexts/Web3ProviderContext'
import fetchContracts from './fetchContracts'

function App() {
  const [web3Defined, setWeb3Defined] = useState(false)
  const [web3Provider, setWeb3Provider] = useState(undefined)
  const [contracts, setContracts] = useState({})
  const [account, setAccount] = useState(undefined)

  const setMainAccount = accounts => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
      window.ethereum.on('accountsChanged', account => window.location.reload())
    }
  }

  useEffect(() => {
    const web3Defined = typeof window.ethereum !== 'undefined'

    setWeb3Defined(web3Defined)

    if (web3Defined) {
      window.ethereum.autoRefreshOnNetworkChange = false
      window.ethereum.on('chainChanged', () => window.location.reload())

      const web3Provider = new Web3(window.ethereum)
      setWeb3Provider(web3Provider)

      fetchContracts(web3Provider)
        .then(contracts => {
          setContracts(contracts)

          return window.ethereum.request({ method: 'eth_accounts' })
        })
        .then(setMainAccount)
        .catch(console.error)
    }
  }, [])

  const enableEthereum = async () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(setMainAccount)
      .catch(console.error)
  }

  const preDappRenderTemplate = content => {
    return (
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          {content}
        </Col>
      </Row>
    )
  }

  let displayElement
  if (!web3Defined) {
    // Render web3 provider alert
    displayElement = preDappRenderTemplate(
      (<Alert variant="danger">No web3 provider found.</Alert>)
    )
  }
  else if (!contracts.tweetherContract?._address || !contracts.tweetherIdentityContract?._address) {
    // Render contracts not found for this network alert
    displayElement = preDappRenderTemplate(
      (<Alert variant="danger">Tweether contracts not available in this network.</Alert>)
    )
  }
  else if (!account) {
    // Render button to enable ethereum
    displayElement = preDappRenderTemplate(
      (<Button variant="primary" onClick={() => enableEthereum()}>Enable Ethereum</Button>)
    )
  }
  else {
   // Render Dapp
   displayElement = (
      <Web3ProviderContext.Provider value={{ web3Provider, ...contracts, account}}>
        <Dapp />
      </Web3ProviderContext.Provider>
    ) 
  }

  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 align="center">Tweether</h1>
        {displayElement}
      </Jumbotron>
    </Container>
  )
}

export default App
