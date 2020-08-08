import React, { useEffect, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

import Dapp from './components/Dapp'

import './App.scss'

function App() {
  const [web3Defined, setWeb3Defined] = useState(false)
  const [web3Enabled, setWeb3Enabled] = useState(false)

  useEffect(() => {
    const init = async () => {
      const defined = typeof window.ethereum !== 'undefined'
      setWeb3Defined(defined)

      if (defined) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setWeb3Enabled(accounts.length > 0)

        window.ethereum.on('chainChanged', () => window.location.reload())
        window.ethereum.on('accountsChanged', () => window.location.reload())
      }
    }
    init()
  })

  const enableEthereum = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setWeb3Enabled(true)
  }

  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 align="center">Tweether</h1>
        {web3Defined ? (
          web3Enabled ? (
            <Dapp />
          ) : (
            <Row className="justify-content-md-center mb-4">
              <Col md="auto">
                <Button variant="primary" onClick={() => enableEthereum()}>
                  Enable Ethereum
                </Button>
              </Col>
            </Row>
          )
        ) : (
          <Row className="justify-content-md-center mb-4">
            <Col md="auto">
              <Alert variant="danger">No web3 provider found.</Alert>
            </Col>
          </Row>
        )}
      </Jumbotron>
    </Container>
  )
}

export default App
