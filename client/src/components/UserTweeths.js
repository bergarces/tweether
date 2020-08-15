import React, { useContext, useEffect, useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import Tweeth from './Tweeth'

function UserTweeths({
  address,
  name,
  repliesTo,
  setAddress,
  setName,
  setRepliesTo,
  cancelDisplayOwnTweeths,
  maxTweeths,
}) {
  const { web3Provider, tweetherContract } = useContext(Web3ProviderContext)
  const [tweeths, setTweeths] = useState([])

  useEffect(() => {
    const init = async () => {
      if (!tweetherContract) {
        return
      }
      setTweeths([])

      let subscription
      if (address) {
        subscription = tweetherContract.events
          .TweethSent({
            fromBlock: (await web3Provider.eth.getBlockNumber()) + 1,
            filter: { _sender: address },
          })
          .on('data', () => {
            fetchTweethsByAddress(
              tweetherContract,
              address,
              maxTweeths,
              setTweeths
            )
          })
          .on('error', console.error)

        fetchTweethsByAddress(tweetherContract, address, maxTweeths, setTweeths)
      } else if (repliesTo) {
        subscription = tweetherContract.events
          .TweethSent({
            fromBlock: (await web3Provider.eth.getBlockNumber()) + 1,
            filter: { _replyTo: repliesTo },
          })
          .on('data', (event) => {
            fetchTweethsByThread(tweetherContract, repliesTo, setTweeths)
          })
          .on('error', console.error)

        fetchTweethsByThread(tweetherContract, repliesTo, setTweeths)
      }

      if (subscription) {
        return () => {
          subscription.unsubscribe()
        }
      }
    }

    init()
  }, [web3Provider, tweetherContract, address, name, repliesTo, maxTweeths])

  return (
    <ListGroup>
      {tweeths.map((tweeth, idx) => (
        <Tweeth
          key={idx}
          address={tweeth.address}
          name={name}
          nonce={tweeth.nonce}
          setAddress={setAddress}
          setName={setName}
          setRepliesTo={setRepliesTo}
          cancelDisplayOwnTweeths={cancelDisplayOwnTweeths}
        />
      ))}
    </ListGroup>
  )
}

async function fetchTweethsByAddress(
  contract,
  address,
  maxTweeths,
  setTweeths
) {
  const userNonce = await contract.methods.nonceCounter(address).call()

  const firstNonce = Math.max(userNonce - maxTweeths, 0)
  const lastNonce = userNonce - 1

  const tweethNonces = Array.from(
    { length: lastNonce - firstNonce + 1 },
    (v, k) => k + firstNonce
  )

  const temp = tweethNonces.reverse().map((nonce) => {
    return { address, nonce }
  })
  setTweeths(temp)
}

async function fetchTweethsByThread(contract, repliesTo, setTweeths) {
  const mainTweeth = await contract.methods.tweeths(repliesTo).call()

  const replyEvents = await contract.getPastEvents('TweethSent', {
    filter: { _replyTo: repliesTo },
    fromBlock: 0,
    toBlock: 'latest',
  })

  const replies = replyEvents.map((reply) => {
    return {
      address: reply.returnValues._sender,
      nonce: reply.returnValues._nonce,
    }
  })

  setTweeths([
    { address: mainTweeth.sender, nonce: mainTweeth.nonce },
    ...replies,
  ])
}

export default UserTweeths
