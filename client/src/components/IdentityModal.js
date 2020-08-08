import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function IdentityModal({ address, show, handleClose }) {
  const { web3Provider, tweetherIdentityContract, account } = useContext(
    Web3ProviderContext
  )
  const { register, handleSubmit, errors } = useForm()
  const [bio, setBio] = useState(undefined)
  const [edit, setEdit] = useState(false)
  const [waitingForTx, setWaitingForTx] = useState(false)

  const canEdit = address === account

  const onSubmit = async (formData) => {
    await tweetherIdentityContract.methods
      .setBio(formData.bio)
      .send({ from: address })
    setEdit(false)
    setWaitingForTx(true)
  }

  React.useEffect(() => {
    const init = async () => {
      if (tweetherIdentityContract && address) {
        tweetherIdentityContract.events
          .BioChanged({
            fromBlock: (await web3Provider.eth.getBlockNumber()) + 1,
            filter: { address },
          })
          .on('data', (data) => {
            setBio(data.returnValues._bio)
            setWaitingForTx(false)
          })
          .on('error', console.error)

        const fetchedBio = await tweetherIdentityContract.methods
          .bio(address)
          .call()
        setBio(fetchedBio)
      } else {
        setBio(undefined)
      }
    }
    init()
  }, [web3Provider, tweetherIdentityContract, address])

  const setEditor = (e) => {
    e.preventDefault()
    setEdit(true)
  }

  const isValidSize = (bio) => new Blob([bio]).size < 1000

  return (
    <Modal show={show} onHide={handleClose}>
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
                <span>Length of the field exceeds 280 bytes</span>
              )}
            </>
          ) : waitingForTx ? (
            'Waiting for bio to be updated'
          ) : (
            bio
          )}
        </Modal.Body>
        <Modal.Footer>
          {canEdit &&
            (edit ? (
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            ) : (
              <Button variant="primary" onClick={setEditor}>
                Edit
              </Button>
            ))}

          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default IdentityModal
