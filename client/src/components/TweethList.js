import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'

import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import Tweeth from './Tweeth'

function TweethList({ searchQuery, setSearchQuery }) {
  const { tweetherContract } = useContext(Web3ProviderContext)
  const [tweeths, setTweeths] = useState([])

  useEffect(() => {
    setTweeths([])

    let subscription
    if (searchQuery.address) {
      subscription = tweetherContract.events
        .TweethSent({
          fromBlock: 0,
          filter: { _sender: searchQuery.address },
        })
        .on('data', (event) => {
          fetchTweethBySender(
            event.returnValues._sender,
            event.returnValues._nonce,
            tweetherContract
          )
            .then((tweeth) =>
              setTweeths((previousTweeths) =>
                orderTweeths([...previousTweeths, tweeth])
              )
            )
            .catch(console.error)
        })
        .on('error', console.error)
    } else if (searchQuery.hash) {
      fetchTweethByHash(searchQuery.hash, tweetherContract)
        .then((tweeth) => {
          setTweeths((previousTweeths) =>
            orderTweeths([...previousTweeths, tweeth], searchQuery.hash)
          )
        })
        .catch(console.error)

      subscription = tweetherContract.events
        .TweethSent({
          fromBlock: 0,
          filter: { _replyTo: searchQuery.hash },
        })
        .on('data', (event) => {
          fetchTweethBySender(
            event.returnValues._sender,
            event.returnValues._nonce,
            tweetherContract
          )
            .then((tweeth) =>
              setTweeths((previousTweeths) =>
                orderTweeths([...previousTweeths, tweeth], searchQuery.hash)
              )
            )
            .catch(console.error)
        })
        .on('error', console.error)
    }

    if (subscription) {
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [searchQuery, tweetherContract])

  return (
    <ListGroup>
      {tweeths.map((tweeth) => (
        <Tweeth
          key={tweeth.hash}
          tweeth={tweeth}
          setSearchQuery={setSearchQuery}
        />
      ))}
    </ListGroup>
  )
}

const orderTweeths = (tweeths, mainTweethHash) => {
  return mainTweethHash
    ? _.orderBy(
        tweeths,
        ['timestamp', 'sender', 'nonce'],
        ['asc', 'asc', 'asc']
      )
    : _.orderBy(
        tweeths,
        ['timestamp', 'sender', 'nonce'],
        ['desc', 'asc', 'desc']
      )
}

const fetchTweethBySender = async (sender, nonce, tweetherContract) => {
  const fetchedHash = await tweetherContract.methods
    .getTweethHash(sender, nonce)
    .call()

  return fetchTweethByHash(fetchedHash, tweetherContract)
}

const fetchTweethByHash = async (hash, tweetherContract) => {
  const fetchedTweeth = await tweetherContract.methods.tweeths(hash).call()

  return {
    hash: hash,
    sender: fetchedTweeth.sender,
    nonce: fetchedTweeth.nonce,
    replyTo: fetchedTweeth.replyTo,
    message: fetchedTweeth.message,
    timestamp: fetchedTweeth.timestamp,
  }
}

export default TweethList
