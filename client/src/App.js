import React, { useEffect, useState } from 'react'
import * as ENS from 'ethereum-ens'
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
import ENSRegistryArtifact from './contracts/ENSRegistry.json'
import fetchContracts from './fetchContracts'
import fetchEnsName from './fetchEnsName'

function App() {
  const [web3Provider, setWeb3Provider] = useState(undefined)
  const [ens, setEns] = useState(undefined)
  const [contracts, setContracts] = useState({})
  const [account, setAccount] = useState(undefined)
  const [accountName, setAccountName] = useState(undefined)

  const setMainAccount = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])

      window.ethereum.on('accountsChanged', (account) =>
        window.location.reload()
      )
    }
  }

  useEffect(() => {
    const init = async () => {
      const web3Defined = typeof window.ethereum !== 'undefined'

      if (web3Defined) {
        window.ethereum.autoRefreshOnNetworkChange = false
        window.ethereum.on('chainChanged', () => window.location.reload())

        const web3Provider = new Web3(window.ethereum)
        let ens

        const networkId = await web3Provider.eth.net.getId()
        if (networkId > 10) {
          // For private networks, load the ENSRegistry address from the deployed contract
          const ensRegistryAddress =
            ENSRegistryArtifact.networks[networkId].address
          ens = new ENS(web3Provider, ensRegistryAddress)
        } else {
          ens = new ENS(web3Provider)
        }

        setWeb3Provider(web3Provider)
        setEns(ens)

        try {
          const contracts = await fetchContracts(web3Provider, ens, networkId)
          setContracts(contracts)

          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          setMainAccount(accounts)
        } catch (error) {
          console.error(error)
        }
      }
    }
    init()
  }, [])

  useEffect(() => {
    const init = async () => {
      const mainAccountName = await fetchEnsName(account, ens)
      setAccountName(mainAccountName)
    }
    init()
  }, [ens, account])

  const enableEthereum = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setMainAccount(accounts)
    } catch (error) {
      console.error(error)
    }
  }

  const preDappRenderTemplate = (content) => {
    return (
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">{content}</Col>
      </Row>
    )
  }

  let displayElement
  if (!web3Provider) {
    // Render web3 provider alert
    displayElement = preDappRenderTemplate(
      <Alert variant="danger">No web3 provider found.</Alert>
    )
  } else if (
    !contracts.tweetherContract?._address ||
    !contracts.tweetherIdentityContract?._address
  ) {
    // Render contracts not found for this network alert
    displayElement = preDappRenderTemplate(
      <Alert variant="danger">
        Tweether contracts not available in this network.
      </Alert>
    )
  } else if (!account) {
    // Render button to enable ethereum
    displayElement = preDappRenderTemplate(
      <Button variant="primary" onClick={() => enableEthereum()}>
        Enable Ethereum
      </Button>
    )
  } else {
    // Render Dapp
    displayElement = (
      <Web3ProviderContext.Provider
        value={{ web3Provider, ens, ...contracts, account, accountName }}
      >
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
