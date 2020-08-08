import React, { useContext, useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function Tweeth({ address, name, nonce }) {
  const { tweetherContract } = useContext(Web3ProviderContext)
  const [tweeth, setTweeth] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      if (tweetherContract && address) {
        const fetchedTweeth = await tweetherContract.methods
          .getTweeth(address, nonce)
          .call()

        setTweeth(fetchedTweeth)
      }
    }

    init()
  }, [tweetherContract, address, name, nonce])

  return (
    <ListGroup.Item>
      <Card>
        <Card.Body>
          <Card.Title>{name || address}</Card.Title>
          <Card.Text>{tweeth?.message}</Card.Text>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  )
}

export default Tweeth
