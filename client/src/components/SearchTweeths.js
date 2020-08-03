import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

import UserTweeths from './UserTweeths'

function SearchTweeths({ account, maxTweeths }) {
  const { web3Provider } = useContext(Web3ProviderContext)
  const [searchQuery, setSearchQuery] = useState(account)
  const { register, handleSubmit } = useForm()

  React.useEffect(() => {
    setSearchQuery(account)
  }, [account])

  const onSubmit = async (formData) => {
    const ensRegEx = /^.*\.(test|eth)$/
    const addressRegEx = /^0x[0-9a-fA-F]{20}$/

    if (ensRegEx.test(formData.searchQuery)) {
      try {
        const account = await web3Provider.eth.ens.getAddress(formData.searchQuery)
        console.log(account)
        setSearchQuery(account)
      } catch (error) {
        console.log('Name cannot be resolved')
        setSearchQuery("0x0000000000000000000000000000000000000000")
      }
    }
    else if (addressRegEx.test(formData.searchQuery)) {
      setSearchQuery(formData.searchQuery)
    }
    else {
      console.log('NO MATCH')
      setSearchQuery("0x0000000000000000000000000000000000000000")
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
      <Alert variant="primary">
        Searching tweeths for {searchQuery}
      </Alert>
      <UserTweeths address={searchQuery} maxTweeths={maxTweeths} />
    </>
  )
}

export default SearchTweeths
