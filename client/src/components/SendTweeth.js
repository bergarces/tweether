import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import Web3ProviderContext from '../contexts/Web3ProviderContext'

function SendTweeth() {
  const { account, contract } = useContext(Web3ProviderContext)
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    console.log(formData)

    contract.methods.sendTweeth(formData.text, []).send({ from: account })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="text" ref={register({ required: true })} />
      {errors.text && <span>This field is required</span>}
      <br />
      <br />
      <input type="submit" />
    </form>
  )
}

export default SendTweeth
