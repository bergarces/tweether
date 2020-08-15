import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function IdentityModal({ address, show, handleClose }) {
  const { tweetherIdentityContract, account } = useContext(Web3ProviderContext)
  const { register, handleSubmit, errors } = useForm()
  const [bio, setBio] = useState(undefined)
  const [edit, setEdit] = useState(false)
  const [waitingForTx, setWaitingForTx] = useState(false)

  const canEdit = address === account

  const onSubmit = async (formData) => {
    setEdit(false)
    setWaitingForTx(true)

    try {
      const result = await tweetherIdentityContract.methods
        .setBio(formData.bio)
        .send({ from: address })
      setBio(result.events['BioChanged'].returnValues._bio)
    } catch (error) {
      console.error(error)
    }

    setWaitingForTx(false)
  }

  useEffect(() => {
    const init = async () => {
      if (tweetherIdentityContract && address && show) {
        const fetchedBio = await tweetherIdentityContract.methods
          .bio(address)
          .call()
        setBio(fetchedBio)
      } else {
        setBio(undefined)
      }
    }
    init()
  }, [tweetherIdentityContract, address, show])

  const setEditor = (event) => {
    if (!edit) {
      event.preventDefault()
      setEdit(true)
    }
  }

  const closeEditor = () => {
    setEdit(false)
    handleClose()
  }

  const isValidSize = (bio) => new Blob([bio]).size < 1000

  return (
    <Modal show={show} onHide={closeEditor}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Account Identity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Address: {address}
          <br />
          Bio:{' '}
          {edit ? (
            <>
              <textarea
                name="bio"
                rows="4"
                cols="50"
                defaultValue={bio}
                ref={register({ validate: isValidSize })}
              />
              {errors.bio?.type === 'validate' && (
                <span>Length of the field exceeds 1000 bytes</span>
              )}
            </>
          ) : waitingForTx ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            bio
          )}
        </Modal.Body>
        <Modal.Footer>
          {canEdit && (
            <Button
              variant="primary"
              type="submit"
              onClick={setEditor}
              disabled={waitingForTx}
            >
              {edit || waitingForTx ? (
                <>
                  {waitingForTx && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  Save Changes
                </>
              ) : (
                'Edit'
              )}
            </Button>
          )}

          <Button variant="primary" onClick={closeEditor}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default IdentityModal
