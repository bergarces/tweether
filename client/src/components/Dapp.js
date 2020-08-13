import React, { useContext, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'
import SearchTweeths from './SearchTweeths'

function Dapp() {
  const { account } = useContext(Web3ProviderContext)

  const [showSendModal, setShowSendModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [displayOwnTweeths, setDisplayOwnTweeths] = useState(true)

  return (
    <>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <Alert variant="info">Connected from account {account}</Alert>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowSendModal(true)}>
            Send a Tweeth
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setDisplayOwnTweeths(true)}>
            My Tweeths
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowProfileModal(true)}>
            My Profile
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-4">
        <Col md="auto">
          <SearchTweeths
            displayOwnTweeths={displayOwnTweeths}
            cancelDisplayOwnTweeths={() => setDisplayOwnTweeths(false)}
            maxTweeths={10}
          />
        </Col>
      </Row>

      <SendTweethModal
        show={showSendModal}
        handleClose={() => setShowSendModal(false)}
      />
      <IdentityModal
        address={account}
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
      />
    </>
  )
}

export default Dapp
