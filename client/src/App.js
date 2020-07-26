import React from 'react'
import Dapp from './components/Dapp'
import { ethEnabled } from './utils/ethEnabled'

function App() {
  return (
    <div>
      <h1>Tweether</h1>
      {ethEnabled() ? <Dapp /> : <h2>No web3 provider found.</h2>}
    </div>
  )
}

export default App
