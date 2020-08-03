import React, { useContext, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function Tweeth(props) {
  const { contract } = useContext(Web3ProviderContext)
  const [tweeth, setTweeth] = useState(undefined)

  const { address, nonce } = props

  useEffect(() => {
    const init = async () => {
      if (contract && address) {
        const fetchedTweeth = await contract.methods
          .getTweeth(address, nonce)
          .call()

        setTweeth(fetchedTweeth)
      }
    }

    init()
  }, [contract, address, nonce])

  return (
    <ListGroup.Item>
      <Card>
        <Card.Body>
          <Card.Title>{tweeth?.owner}</Card.Title>
          <Card.Text>{tweeth?.text}</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  )
}

export default Tweeth
