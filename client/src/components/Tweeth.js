import React, { useContext, useEffect, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'

function Tweeth({
  address,
  name,
  nonce,
  setAddress,
  setName,
  setRepliesTo,
  cancelDisplayOwnTweeths,
}) {
  const { tweetherContract } = useContext(Web3ProviderContext)
  const [tweeth, setTweeth] = useState(undefined)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (tweetherContract && address) {
        const fetchedTweeth = await tweetherContract.methods
          .getTweeth(address, nonce)
          .call()

        const fetchedHash = await tweetherContract.methods
          .getTweethHash(address, nonce)
          .call()

        setTweeth({
          hash: fetchedHash,
          sender: fetchedTweeth.sender,
          nonce: fetchedTweeth.nonce,
          replyTo: fetchedTweeth.replyTo,
          message: fetchedTweeth.message,
          timestamp: fetchedTweeth.timestamp,
        })
      }
    }

    init()
  }, [tweetherContract, address, name, nonce])

  const viewReplies = (hash) => {
    setAddress(undefined)
    setName(undefined)
    setRepliesTo(hash)
    cancelDisplayOwnTweeths()
  }

  return (
    <>
      <ListGroup.Item>
        <Card>
          <Card.Body>
            <Card.Title>{name || address}</Card.Title>
            <Card.Text>
              <Alert variant="info">{tweeth?.message}</Alert>
              Block Timestamp:{' '}
              {tweeth?.timestamp
                ? new Date(tweeth?.timestamp * 1000).toLocaleString('en-GB')
                : ''}
              <br />
              Tweeth Hash: {tweeth?.hash}
              {tweeth?.replyTo !==
                '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                <>
                  <br />
                  Reply To: {tweeth?.replyTo}
                </>
              )}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="primary"
              onClick={() => setShowProfileModal(true)}
              className="mr-1"
            >
              View Profile
            </Button>
            <Button
              variant="primary"
              onClick={() => viewReplies(tweeth?.hash)}
              className="mr-1"
            >
              View Replies
            </Button>
            {tweeth?.replyTo !==
              '0x0000000000000000000000000000000000000000000000000000000000000000' && (
              <Button
                variant="primary"
                onClick={() => viewReplies(tweeth?.replyTo)}
                className="mr-1"
              >
                View Parent
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => setShowSendModal(true)}
              className="mr-1"
            >
              Reply
            </Button>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
      <IdentityModal
        address={address}
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
      />
      <SendTweethModal
        replyTo={tweeth?.hash}
        show={showSendModal}
        handleClose={() => setShowSendModal(false)}
      />
    </>
  )
}

export default Tweeth
