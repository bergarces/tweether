import React, { useContext, useEffect, useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import Tweeth from './Tweeth'

function UserTweeths({ searchQuery, maxTweeths }) {
  const { contract } = useContext(Web3ProviderContext)
  const [tweethNonces, setTweethNonces] = useState([])

  useEffect(() => {
    console.log(`Searching tweeths for: ${searchQuery}`)
    const init = async () => {
      if (contract && searchQuery) {
        const userNonce = await contract.methods.nonceCounter(searchQuery).call()

        const firstNonce = Math.max(userNonce - maxTweeths, 0)
        const lastNonce = userNonce - 1

        const tweethNonces = Array.from(
          { length: lastNonce - firstNonce + 1 },
          (v, k) => k + firstNonce
        )

        setTweethNonces(tweethNonces)
      }
    }

    init()
  }, [contract, searchQuery, maxTweeths])

  return (
    <ListGroup>
      {tweethNonces.map((nonce) => (
        <Tweeth key={nonce.toString()} account={searchQuery} nonce={nonce} />
      ))}
    </ListGroup>
  )
}

export default UserTweeths
