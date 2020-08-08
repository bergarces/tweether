import React, { useContext, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import IdentityModal from './IdentityModal'

function Tweeth({ address, name, nonce }) {
  const { tweetherContract } = useContext(Web3ProviderContext)
  const [tweeth, setTweeth] = useState(undefined)
  const [showProfileModal, setShowProfileModal] = useState(false)

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
    <>
      <ListGroup.Item>
        <Card>
          <Card.Body>
            <Card.Title>{name || address}</Card.Title>
            <Card.Text>{tweeth?.message}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={() => setShowProfileModal(true)}>
              View Profile
            </Button>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
      <IdentityModal
        address={address}
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
      />
    </>
  )
}

export default Tweeth
