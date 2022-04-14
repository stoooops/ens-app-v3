import { networkIdReactive } from '@app/apollo/reactiveVars'
import { emptyAddress } from '@app/utils/utils'
import { getWeb3 } from '@ensdomains/ui'
import { Contract, utils } from 'ethers'

const ENSTokenABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'delegates',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const contractAddress = '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'

export default async function getShouldDelegate(
  address: string | undefined | null,
) {
  const provider = await getWeb3()
  if (!provider) return false
  // if no address for connection
  if (!address) return false
  // if user isn't on mainnet
  if ((await networkIdReactive()) !== 1) return false
  try {
    const ENSTokenContract = new Contract(
      contractAddress,
      ENSTokenABI,
      provider,
    )
    const balanceOf = await ENSTokenContract.balanceOf(address)
    // if address has no balance
    if (!balanceOf.gt(0)) return false
    const delegates = await ENSTokenContract.delegates(address)
    // if address already delegated
    if (delegates !== emptyAddress) return false
    return utils.formatEther(balanceOf)
  } catch (e) {
    console.log('error getting delegated amount', e)
  }
}