import React, { useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'

function Tweeth({ tweeth, setSearchQuery }) {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  return (
    <ListGroup.Item>
      <Card>
        <Card.Body>
          <Card.Title>
            {tweeth.senderName
              ? `${tweeth.senderName} (${tweeth.sender})`
              : tweeth.sender}
          </Card.Title>
          <Card.Subtitle>
            <Alert variant="info">{tweeth.message}</Alert>
          </Card.Subtitle>
          <Card.Text>
            Block Timestamp:{' '}
            {new Date(tweeth?.timestamp * 1000).toLocaleString()}
            <br />
            Hash: {tweeth.hash}
            {tweeth.replyTo !==
              '0x0000000000000000000000000000000000000000000000000000000000000000' && (
              <>
                <br />
                Replying To: {tweeth.replyTo}
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
            onClick={() => setSearchQuery({ hash: tweeth.hash })}
            className="mr-1"
          >
            View Replies
          </Button>
          {tweeth?.replyTo !==
            '0x0000000000000000000000000000000000000000000000000000000000000000' && (
            <Button
              variant="primary"
              onClick={() => setSearchQuery({ hash: tweeth.replyTo })}
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
      <IdentityModal
        address={tweeth.sender}
        addressName={tweeth.senderName}
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
      />
      <SendTweethModal
        replyTo={tweeth.hash}
        show={showSendModal}
        handleClose={() => setShowSendModal(false)}
        setSearchQuery={setSearchQuery}
      />
    </ListGroup.Item>
  )
}

export default Tweeth
