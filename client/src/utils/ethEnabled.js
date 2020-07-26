export const ethEnabled = () => {
  if (window.ethereum) {
    window.ethereum.enable()
    return true
  }
  return false
}
