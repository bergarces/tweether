const fetchEnsName = async (address, ens) => {
  try {
    const name = await ens.reverse(address).name()
    const nameAddress = await ens.resolver(name).addr()

    return address.toLowerCase() === nameAddress.toLowerCase()
      ? name
      : undefined
  } catch (error) {
    return undefined
  }
}

export default fetchEnsName
