import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import UserTweeths from './UserTweeths'

function SearchTweeths({ maxTweeths }) {
  const { web3Provider, account } = useContext(Web3ProviderContext)
  const [address, setAddress] = useState(account)
  const [name, setName] = useState(undefined)
  const { register, handleSubmit } = useForm()

  React.useEffect(() => {
    setAddress(account)
  }, [account])

  const onSubmit = async (formData) => {
    const ensRegEx = /^.*\.(test|eth)$/
    const addressRegEx = /^0x[0-9a-fA-F]{20}$/

    if (ensRegEx.test(formData.searchQuery)) {
      try {
        const addressFromEns = await web3Provider.eth.ens.getAddress(
          formData.searchQuery
        )
        setAddress(addressFromEns)
        setName(formData.searchQuery)
      } catch (error) {
        setAddress('0x0000000000000000000000000000000000000000')
        setName(undefined)
      }
    } else if (addressRegEx.test(formData.searchQuery)) {
      setAddress(formData.searchQuery)
      setName(undefined)
    } else {
      setAddress('0x0000000000000000000000000000000000000000')
      setName(undefined)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-inline justify-content-center pb-2"
      >
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by sender"
          ref={register({ required: true })}
          className="mr-1"
          style={{ width: '500px' }}
        />
        <Button variant="outline-primary" type="submit" size="sm">
          Search
        </Button>
      </form>
      <Alert variant="primary">Searching tweeths for {name || address}</Alert>
      <UserTweeths address={address} name={name} maxTweeths={maxTweeths} />
    </>
  )
}

export default SearchTweeths
