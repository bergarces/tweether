import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import UserTweeths from './UserTweeths'

function SearchTweeths({
  displayOwnTweeths,
  cancelDisplayOwnTweeths,
  maxTweeths,
}) {
  const { web3Provider, account } = useContext(Web3ProviderContext)
  const [address, setAddress] = useState(
    '0x0000000000000000000000000000000000000000'
  )
  const [name, setName] = useState(undefined)
  const [repliesTo, setRepliesTo] = useState(undefined)
  const { register, handleSubmit } = useForm()

  React.useEffect(() => {
    if (displayOwnTweeths) {
      setAddress(account)
      setName(undefined)
      document.getElementById('search-form').reset()
    }
  }, [displayOwnTweeths, account])

  const onSubmit = async (formData) => {
    const ensRegEx = /^.*\.(test|eth)$/
    const addressRegEx = /^0x[0-9a-fA-F]{40}$/
    const hashRegEx = /^0x[0-9a-fA-F]{64}$/

    if (ensRegEx.test(formData.searchQuery)) {
      try {
        const addressFromEns = await web3Provider.eth.ens.getAddress(
          formData.searchQuery
        )
        setAddress(addressFromEns)
        setName(formData.searchQuery)
        setRepliesTo(undefined)
      } catch (error) {
        setAddress('0x0000000000000000000000000000000000000000')
        setName(undefined)
        setRepliesTo(undefined)
      }
    } else if (addressRegEx.test(formData.searchQuery)) {
      setAddress(formData.searchQuery)
      setName(undefined)
      setRepliesTo(undefined)
    } else if (hashRegEx.test(formData.searchQuery)) {
      setAddress(undefined)
      setName(undefined)
      setRepliesTo(formData.searchQuery)
    } else {
      setAddress('0x0000000000000000000000000000000000000000')
      setName(undefined)
      setRepliesTo(undefined)
    }

    cancelDisplayOwnTweeths()
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-inline justify-content-center pb-2"
        id="search-form"
      >
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by sender or tweeth hash"
          ref={register({ required: true })}
          className="mr-1"
          style={{ width: '500px' }}
        />
        <Button variant="outline-primary" type="submit" size="sm">
          Search
        </Button>
      </form>
      {!displayOwnTweeths && address && (
        <Alert variant="primary">Searching tweeths for {name || address}</Alert>
      )}
      {!displayOwnTweeths && repliesTo && (
        <Alert variant="primary">
          Searching replies for tweeth {repliesTo}
        </Alert>
      )}
      <UserTweeths
        address={address}
        name={name}
        repliesTo={repliesTo}
        setAddress={setAddress}
        setName={setName}
        setRepliesTo={setRepliesTo}
        cancelDisplayOwnTweeths={cancelDisplayOwnTweeths}
        maxTweeths={maxTweeths}
      />
    </>
  )
}

export default SearchTweeths
