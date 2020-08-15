import React, { useContext, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import IdentityModal from './IdentityModal'
import SendTweethModal from './SendTweethModal'
import SearchBar from './SearchBar'
import TweethList from './TweethList'

function Dapp() {
  const { account } = useContext(Web3ProviderContext)

  const [showSendModal, setShowSendModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const [searchQuery, setSearchQuery] = useState({ address: account })

  return (
    <>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Alert variant="info">Connected from account {account}</Alert>
        </Col>
      </Row>
      <Row className="justify-content-md-center mb-5">
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowSendModal(true)}>
            Send a Tweeth
          </Button>
        </Col>
        <Col md="auto">
          <Button
            variant="primary"
            onClick={() => {
              setSearchQuery({ address: account })
            }}
          >
            My Tweeths
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowProfileModal(true)}>
            My Profile
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <TweethList
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
