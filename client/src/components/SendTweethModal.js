import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function SendTweethModal({ show, handleClose }) {
  const { account, contract } = useContext(Web3ProviderContext)
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    console.log(formData)

    contract.methods.sendTweeth(formData.text, []).send({ from: account })
    handleClose()
  }

  const isValidSize = (text) => new Blob([text]).size < 280

  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Tweeth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            name="text"
            rows="4"
            cols="50"
            ref={register({ required: true, validate: isValidSize })}
          />
          {errors.text?.type === 'required' && (
            <span>This field is required</span>
          )}
          {errors.text?.type === 'validate' && (
            <span>Length of the field exceeds 280 bytes</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="submit" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default SendTweethModal
