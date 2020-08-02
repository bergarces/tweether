import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import UserTweeths from './UserTweeths'

function SearchTweeths({ account, maxTweeths }) {
  const [searchQuery, setSearchQuery] = useState(account)
  const { register, handleSubmit, errors } = useForm()

  React.useEffect(() => {
    setSearchQuery(account)
  }, [account])

  const onSubmit = async (formData) => {
    setSearchQuery(formData.searchQuery)
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
      <UserTweeths searchQuery={searchQuery} maxTweeths={maxTweeths} />
    </>
  )
}

export default SearchTweeths
