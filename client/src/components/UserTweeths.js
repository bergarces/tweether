import React, { useContext, useEffect, useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import Tweeth from './Tweeth'

function UserTweeths({ address, maxTweeths }) {
  const { web3Provider, contract } = useContext(Web3ProviderContext)
  const [tweethNonces, setTweethNonces] = useState([])

  useEffect(() => {
    const init = async () => {
      if (contract && address) {
        contract.events.TweethSent({
          fromBlock: await web3Provider.eth.getBlockNumber() + 1,
          filter: { address: address }
        })
        .on('data', () => { fetchTweeths(contract, address, maxTweeths, setTweethNonces) })
        .on('changed', (event) => { console.log('Changed event. Needs reviewing.', event) })
        .on('error', console.error)

        fetchTweeths(contract, address, maxTweeths, setTweethNonces)
      }
    }

    init()
  }, [web3Provider, contract, address, maxTweeths])

  return (
    <ListGroup>
      {tweethNonces.map((nonce) => (
        <Tweeth key={nonce.toString()} address={address} nonce={nonce} />
      ))}
    </ListGroup>
  )
}

async function fetchTweeths(contract, address, maxTweeths, setTweethNonces) {
  const userNonce = await contract.methods.nonceCounter(address).call()

  const firstNonce = Math.max(userNonce - maxTweeths, 0)
  const lastNonce = userNonce - 1

  const tweethNonces = Array.from(
    { length: lastNonce - firstNonce + 1 },
    (v, k) => k + firstNonce
  )

  setTweethNonces(tweethNonces.reverse())
}

export default UserTweeths
