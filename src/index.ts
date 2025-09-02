/**
 * @packageDocumentation
 *
 * A standard way to represent addresses that
 *
 * - support any standard network protocol
 * - have a binary packed format
 * - have a nice string representation
 * - encapsulate well
 *
 * @example
 *
 * ```TypeScript
 * import { multiaddr } from '@multiformats/multiaddr'
 *
 * const addr = multiaddr('/ip4/127.0.0.1/udp/1234')
 * // Multiaddr(/ip4/127.0.0.1/udp/1234)
 *
 * addr.bytes
 * // <Uint8Array 04 7f 00 00 01 11 04 d2>
 *
 * addr.toString()
 * // '/ip4/127.0.0.1/udp/1234'
 *
 * addr.getComponents()
 * // [
 * //   { code: 4, name: 'ip4', value: '127.0.0.1' },
 * //   { code: 273, name: 'udp', value: '1234' }
 * // ]
 *
 * addr.encapsulate('/sctp/5678')
 * // Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
 * ```
 *
 * @example Adding custom protocols
 *
 * To add application-specific or experimental protocols, add a protocol codec
 * to the protocol registry:
 *
 * ```ts
 * import { registry, V, multiaddr } from '@multiformats/multiaddr'
 * import type { ProtocolCodec } from '@multiformats/multiaddr'
 *
 * const maWithCustomTuple = '/custom-protocol/hello'
 *
 * // throws UnknownProtocolError
 * multiaddr(maWithCustomTuple)
 *
 * const protocol: ProtocolCodec = {
 *   code: 2059,
 *   name: 'custom-protocol',
 *   size: V
 *   // V means variable length, can also be 0, a positive integer (e.g. a fixed
 *   // length or omitted
 * }
 *
 * registry.addProtocol(protocol)
 *
 * // does not throw UnknownProtocolError
 * multiaddr(maWithCustomTuple)
 *
 * // protocols can also be removed
 * registry.removeProtocol(protocol.code)
 * ```
 */

import { Multiaddr as MultiaddrClass, symbol } from './multiaddr.js'
import { registry, V } from './registry.ts'
import type { ProtocolCodec } from './registry.ts'

/**
 * The protocol registry stores protocol codecs that allow transformation of
 * multiaddr tuples from bytes to string and back again, and also validation of
 * the address values.
 */
export interface Registry {
  /**
   * Retrieve a protocol definition by it's code or name
   */
  getProtocol (key: string | number): ProtocolCodec

  /**
   * Add a new protocol definition
   */
  addProtocol (codec: ProtocolCodec): void

  /**
   * Remove a protocol definition by it's code
   */
  removeProtocol (code: number): void
}

/**
 * These types can be parsed into a {@link Multiaddr} object
 */
export type MultiaddrInput = string | Multiaddr | Uint8Array | null | Component[]

/**
 * A Component is a section of a multiaddr with a name/code, possibly with a
 * value.
 *
 * Component names/codes are defined in the protocol table.
 *
 * @see https://github.com/multiformats/multiaddr/blob/master/protocols.csv
 */
export interface Component {
  /**
   * The code of the component as defined in the protocol table
   */
  code: number

  /**
   * The name of the component as defined in the protocol table
   */
  name: string

  /**
   * The component value, if one is present
   */
  value?: string

  /**
   * The bytes that make up the component. This will be set if the multiaddr
   * was parsed from a `Uint8Array`, or if `.bytes` has been accessed on it.
   */
  bytes?: Uint8Array
}

export interface Multiaddr {
  bytes: Uint8Array

  /**
   * Returns Multiaddr as a String
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').toString()
   * // '/ip4/127.0.0.1/tcp/4001'
   * ```
   */
  toString(): string

  /**
   * Returns Multiaddr as a JSON encoded object
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * JSON.stringify(multiaddr('/ip4/127.0.0.1/tcp/4001'))
   * // '/ip4/127.0.0.1/tcp/4001'
   * ```
   */
  toJSON(): string

  /**
   * Returns the components that make up this Multiaddr
   *
   * @example
   * ```ts
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').getComponents()
   * // [{ name: 'ip4', code: 4, value: '127.0.0.1' }, { name: 'tcp', code: 6, value: '4001' }]
   * ```
   */
  getComponents(): Component[]

  /**
   * Encapsulates a Multiaddr in another Multiaddr
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/8.8.8.8/tcp/1080')
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080)
   *
   * const mh2 = multiaddr('/ip4/127.0.0.1/tcp/4001')
   * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
   *
   * const mh3 = mh1.encapsulate(mh2)
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080/ip4/127.0.0.1/tcp/4001)
   *
   * mh3.toString()
   * // '/ip4/8.8.8.8/tcp/1080/ip4/127.0.0.1/tcp/4001'
   * ```
   *
   * @param {MultiaddrInput} addr - Multiaddr to add into this Multiaddr
   */
  encapsulate(addr: MultiaddrInput): Multiaddr

  /**
   * Decapsulates a Multiaddr from another Multiaddr
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/8.8.8.8/tcp/1080')
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080)
   *
   * const mh2 = multiaddr('/ip4/127.0.0.1/tcp/4001')
   * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
   *
   * const mh3 = mh1.encapsulate(mh2)
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080/ip4/127.0.0.1/tcp/4001)
   *
   * mh3.decapsulate(mh2).toString()
   * // '/ip4/8.8.8.8/tcp/1080'
   * ```
   *
   * @param {Multiaddr | string} addr - Multiaddr to remove from this Multiaddr
   */
  decapsulate(addr: Multiaddr | string): Multiaddr

  /**
   * A more reliable version of `decapsulate` if you are targeting a specific
   * code, such as 421 (the `p2p` protocol code). The last index of the code
   * will be removed from the `Multiaddr`, and a new instance will be returned.
   * If the code is not present, the original `Multiaddr` is returned.
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const addr = multiaddr('/ip4/0.0.0.0/tcp/8080/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
   * // Multiaddr(/ip4/0.0.0.0/tcp/8080/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC)
   *
   * addr.decapsulateCode(421).toString()
   * // '/ip4/0.0.0.0/tcp/8080'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/8080').decapsulateCode(421).toString()
   * // '/ip4/127.0.0.1/tcp/8080'
   * ```
   */
  decapsulateCode(code: number): Multiaddr

  /**
   * Checks if two Multiaddrs are the same
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/8.8.8.8/tcp/1080')
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080)
   *
   * const mh2 = multiaddr('/ip4/127.0.0.1/tcp/4001')
   * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
   *
   * mh1.equals(mh1)
   * // true
   *
   * mh1.equals(mh2)
   * // false
   * ```
   */
  equals(addr: { bytes: Uint8Array }): boolean
}

/**
 * Check if object is a {@link Multiaddr} instance
 *
 * @example
 *
 * ```js
 * import { isMultiaddr, multiaddr } from '@multiformats/multiaddr'
 *
 * isMultiaddr(5)
 * // false
 * isMultiaddr(multiaddr('/ip4/127.0.0.1'))
 * // true
 * ```
 */
export function isMultiaddr (value: any): value is Multiaddr {
  return Boolean(value?.[symbol])
}

/**
 * A function that takes a {@link MultiaddrInput} and returns a {@link Multiaddr}
 *
 * @example
 * ```js
 * import { multiaddr } from '@libp2p/multiaddr'
 *
 * multiaddr('/ip4/127.0.0.1/tcp/4001')
 * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
 * ```
 *
 * @param {MultiaddrInput} [addr] - If String or Uint8Array, needs to adhere to the address format of a [multiaddr](https://github.com/multiformats/multiaddr#string-format)
 */
export function multiaddr (addr?: MultiaddrInput): Multiaddr {
  return new MultiaddrClass(addr)
}

/**
 * Export all table.csv codes. These are all named exports so can be tree-shaken
 * out by bundlers.
 */
export * from './constants.ts'
export { registry, V }
export type { ProtocolCodec }
