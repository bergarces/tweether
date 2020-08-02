import React, { useContext, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

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
