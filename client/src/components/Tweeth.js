import React, { useContext, useEffect, useState } from 'react'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function Tweeth(props) {
  const { contract } = useContext(Web3ProviderContext)
  const [tweeth, setTweeth] = useState(undefined)

  const { account, nonce } = props

  useEffect(() => {
    const init = async () => {
      if (contract && account) {
        const fetchedTweeth = await contract.methods
          .getTweeth(account, nonce)
          .call()
        console.log(fetchedTweeth)

        setTweeth(fetchedTweeth)
      }
    }

    init()
  }, [contract, account, nonce])

  return (
    <li>
      <label>Tweeth Content:</label> {tweeth?.text}
      <br />
      <br />
      <label>From:</label> {tweeth?.owner}
      <br />
      <br />
      <label>Nonce:</label> {tweeth?.nonce}
    </li>
  )
}

export default Tweeth
