import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function SendTweethModal({ show, handleClose }) {
  const { account, tweetherContract } = useContext(Web3ProviderContext)
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    tweetherContract.methods
      .sendTweeth(formData.message, [])
      .send({ from: account })
    handleClose()
  }

  const isValidSize = (message) => new Blob([message]).size < 280

  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Tweeth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            name="message"
            rows="4"
            cols="50"
            ref={register({ required: true, validate: isValidSize })}
          />
          {errors.message?.type === 'required' && (
            <span>This field is required</span>
          )}
          {errors.message?.type === 'validate' && (
            <span>Length of the field exceeds 280 bytes</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default SendTweethModal
