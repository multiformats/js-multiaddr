import { IpNet } from '@chainsafe/netmask'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { registry } from './registry.js'
import type { Multiaddr } from './index.ts'

export function convertToIpNet (multiaddr: Multiaddr): IpNet {
  let mask: string | undefined
  let addr: string | undefined

  multiaddr.getComponents().forEach(component => {
    if (component.name === 'ip4' || component.name === 'ip6') {
      addr = component.value
    }
    if (component.name === 'ipcidr') {
      mask = component.value
    }
  })

  if (mask == null || addr == null) {
    throw new Error('Invalid multiaddr')
  }

  return new IpNet(addr, mask)
}

/**
 * converts (serializes) addresses
 *
 * @deprecated Will be removed in a future release
 */
export function convert (proto: string, a: string): Uint8Array
export function convert (proto: string, a: Uint8Array): string
export function convert (proto: string, a: string | Uint8Array): Uint8Array | string {
  if (a instanceof Uint8Array) {
    return convertToString(proto, a)
  } else {
    return convertToBytes(proto, a)
  }
}

/**
 * Convert [code, Uint8Array] to string
 *
 * @deprecated Will be removed in a future release
 */
export function convertToString (proto: number | string, buf: Uint8Array): string {
  const protocol = registry.getProtocol(proto)

  return protocol.bytesToValue?.(buf) ?? uint8ArrayToString(buf, 'base16')  // no clue. convert to hex
}

/**
 * Convert [code, string] to Uint8Array
 *
 * @deprecated Will be removed in a future release
 */
export function convertToBytes (proto: string | number, str: string): Uint8Array {
  const protocol = registry.getProtocol(proto)

  return protocol.valueToBytes?.(str) ?? uint8ArrayFromString(str, 'base16') // no clue. convert from hex
}
