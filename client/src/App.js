import React from 'react'

import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'

import Dapp from './components/Dapp'
import { ethEnabled } from './utils/ethEnabled'

import './App.scss'

function App() {
  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 align="center">Tweether</h1>
        {ethEnabled() ? (
          <Dapp />
        ) : (
          <div class="alert alert-danger" role="alert">
            <h2 className="header">No web3 provider found.</h2>
          </div>
        )}
      </Jumbotron>
    </Container>
  )
}

export default App
