import React, { useContext, useEffect, useState } from 'react'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import Tweeth from './Tweeth'

function UserTweeths(props) {
  const { contract } = useContext(Web3ProviderContext)
  const [tweethNonces, setTweethNonces] = useState([])

  const { account, maxTweeths } = props

  useEffect(() => {
    const init = async () => {
      if (contract && account) {
        const userNonce = await contract.methods.nonceCounter(account).call()

        const firstNonce = Math.max(userNonce - maxTweeths, 0)
        const lastNonce = userNonce - 1

        const tweethNonces = Array.from(
          { length: lastNonce - firstNonce + 1 },
          (v, k) => k + firstNonce
        )

        console.log(tweethNonces)

        setTweethNonces(tweethNonces)
      }
    }

    init()
  }, [contract, account, maxTweeths])

  return (
    <ul>
      {tweethNonces.map((nonce) => (
        <Tweeth key={nonce.toString()} account={account} nonce={nonce} />
      ))}
    </ul>
  )
}

export default UserTweeths
