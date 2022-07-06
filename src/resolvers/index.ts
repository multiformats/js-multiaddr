import { getProtocol } from '../protocols-table.js'
import Resolver from './dns.js'
import type { AbortOptions, Multiaddr } from '../index.js'

const { code: dnsaddrCode } = getProtocol('dnsaddr')

/**
 * Resolver for dnsaddr addresses.
 */
export async function dnsaddrResolver (addr: Multiaddr, options: AbortOptions = {}) {
  const resolver = new Resolver()

  if (options.signal != null) {
    options.signal.addEventListener('abort', () => {
      resolver.cancel()
    })
  }

  const peerId = addr.getPeerId()
  const [, hostname] = addr.stringTuples().find(([proto]) => proto === dnsaddrCode) ?? []

  if (hostname == null) {
    throw new Error('No hostname found in multiaddr')
  }

  const records = await resolver.resolveTxt(`_dnsaddr.${hostname}`)

  let addresses = records.flat().map((a) => a.split('=')[1])

  if (peerId != null) {
    addresses = addresses.filter((entry) => entry.includes(peerId))
  }

  return addresses
}
