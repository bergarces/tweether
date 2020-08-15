import React, { useContext, useEffect, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function SearchBar({ searchQuery, setSearchQuery }) {
  const { ens, account } = useContext(Web3ProviderContext)
  const [searchField, setSearchField] = useState('')
  const [searchMessage, setSearchMessage] = useState(undefined)

  useEffect(() => {
    let message
    if (searchQuery.name) {
      message = `Searching tweeths from ${searchQuery.name} (${searchQuery.address})`
    } else if (searchQuery.address) {
      if (searchQuery.address === account) {
        message = `Displaying your tweeths`
      } else {
        message = `Searching tweeths from ${searchQuery.address}`
      }
    } else if (searchQuery.hash) {
      message = `Searching tweeth and replies for hash ${searchQuery.hash}`
    }

    setSearchMessage({ type: 'info', message })
  }, [searchQuery, account])

  const newSearch = async () => {
    const ensRegEx = /^.*\.(test|eth)$/
    const addressRegEx = /^0x[0-9a-fA-F]{40}$/
    const hashRegEx = /^0x[0-9a-fA-F]{64}$/

    if (ensRegEx.test(searchField)) {
      try {
        const address = await ens.resolver(searchField).addr()
        setSearchQuery({ address, name: searchField })
      } catch (error) {
        console.error(error)
        setSearchMessage({ type: 'danger', message: 'Cannot resolve ENS name' })
      }
    } else if (addressRegEx.test(searchField)) {
      setSearchQuery({ address: searchField })
    } else if (hashRegEx.test(searchField)) {
      setSearchQuery({ hash: searchField })
    } else {
      setSearchMessage({
        type: 'danger',
        message:
          'Search does not match an ethereum address, ENS name or tweeth hash',
      })
    }
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <input
            type="text"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            placeholder="Search by sender address, sender ENS name or tweeth hash"
            className="mr-1 mb-2"
            style={{ width: '600px' }}
          />
          <Button variant="outline-primary" size="sm" onClick={newSearch}>
            Search
          </Button>
        </Col>
      </Row>

      {searchMessage && (
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Alert variant={searchMessage.type}>{searchMessage.message}</Alert>
          </Col>
        </Row>
      )}
    </>
  )
}

export default SearchBar
