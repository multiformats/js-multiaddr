/**
 * @packageDocumentation
 *
 * A standard way to represent addresses that
 *
 * - support any standard network protocol
 * - are self-describing
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
 * addr.protos()
 * // [
 * //   {code: 4, name: 'ip4', size: 32},
 * //   {code: 273, name: 'udp', size: 16}
 * // ]
 *
 * // gives you an object that is friendly with what Node.js core modules expect for addresses
 * addr.nodeAddress()
 * // {
 * //   family: 4,
 * //   port: 1234,
 * //   address: "127.0.0.1"
 * // }
 *
 * addr.encapsulate('/sctp/5678')
 * // Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
 * ```
 *
 * ## Resolving DNSADDR addresses
 *
 * [DNSADDR](https://github.com/multiformats/multiaddr/blob/master/protocols/DNSADDR.md) is a spec that allows storing a TXT DNS record that contains a Multiaddr.
 *
 * To resolve DNSADDR addresses, call the `.resolve()` function the multiaddr, optionally passing a `DNS` resolver.
 *
 * DNSADDR addresses can resolve to multiple multiaddrs, since there is no limit to the number of TXT records that can be stored.
 *
 * @example Resolving DNSADDR Multiaddrs
 *
 * ```TypeScript
 * import { multiaddr, resolvers } from '@multiformats/multiaddr'
 * import { dnsaddrResolver } from '@multiformats/multiaddr/resolvers'
 *
 * resolvers.set('dnsaddr', dnsaddrResolver)
 *
 * const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
 *
 * // resolve with a 5s timeout
 * const resolved = await ma.resolve({
 *   signal: AbortSignal.timeout(5000)
 * })
 *
 * console.info(resolved)
 * // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
 * ```
 *
 * @example Using a custom DNS resolver to resolve DNSADDR Multiaddrs
 *
 * See the docs for [@multiformats/dns](https://www.npmjs.com/package/@multiformats/dns) for a full breakdown of how to specify multiple resolvers or resolvers that can be used for specific TLDs.
 *
 * ```TypeScript
 * import { multiaddr } from '@multiformats/multiaddr'
 * import { dns } from '@multiformats/dns'
 * import { dnsJsonOverHttps } from '@multiformats/dns/resolvers'
 *
 * const resolver = dns({
 *   resolvers: {
 *     '.': dnsJsonOverHttps('https://cloudflare-dns.com/dns-query')
 *   }
 * })
 *
 * const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
 * const resolved = await ma.resolve({
 *  dns: resolver
 * })
 *
 * console.info(resolved)
 * // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
 * ```
 */

import { Multiaddr as MultiaddrClass, symbol } from './multiaddr.js'
import { getProtocol } from './protocols-table.js'
import type { Resolver } from './resolvers/index.js'
import type { DNS } from '@multiformats/dns'

/**
 * Protocols are present in the protocol table
 */
export interface Protocol {
  code: number
  size: number
  name: string
  resolvable?: boolean | undefined
  path?: boolean | undefined
}

/**
 * A plain JavaScript object representation of a {@link Multiaddr}
 */
export interface MultiaddrObject {
  family: 4 | 6
  host: string
  transport: 'tcp' | 'udp'
  port: number
}

/**
 * A NodeAddress is an IPv4/IPv6 address/TCP port combination
 */
export interface NodeAddress {
  family: 4 | 6
  address: string
  port: number
}

/**
 * These types can be parsed into a {@link Multiaddr} object
 */
export type MultiaddrInput = string | Multiaddr | Uint8Array | null

/**
 * A code/value pair
 */
export type Tuple = [number, Uint8Array?]

/**
 * A code/value pair with the value as a string
 */
export type StringTuple = [number, string?]

/**
 * Allows aborting long-lived operations
 */
export interface AbortOptions {
  signal?: AbortSignal
}

/**
 * All configured {@link Resolver}s
 */
export const resolvers = new Map<string, Resolver>()

export type { Resolver }

export { MultiaddrFilter } from './filter/multiaddr-filter.js'

export interface ResolveOptions extends AbortOptions {
  /**
   * An optional DNS resolver
   */
  dns?: DNS

  /**
   * When resolving DNSADDR Multiaddrs that resolve to other DNSADDR Multiaddrs,
   * limit how many times we will recursively resolve them.
   *
   * @default 32
   */
  maxRecursiveDepth?: number
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
   * Returns Multiaddr as a convinient options object to be used with net.createConnection
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').toOptions()
   * // { family: 4, host: '127.0.0.1', transport: 'tcp', port: 4001 }
   * ```
   */
  toOptions(): MultiaddrObject

  /**
   * Returns the protocols the Multiaddr is defined with, as an array of objects, in
   * left-to-right order. Each object contains the protocol code, protocol name,
   * and the size of its address space in bits.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').protos()
   * // [ { code: 4, size: 32, name: 'ip4' },
   * //   { code: 6, size: 16, name: 'tcp' } ]
   * ```
   */
  protos(): Protocol[]

  /**
   * Returns the codes of the protocols in left-to-right order.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').protoCodes()
   * // [ 4, 6 ]
   * ```
   */
  protoCodes(): number[]

  /**
   * Returns the names of the protocols in left-to-right order.
   * [See list of protocols](https://github.com/multiformats/multiaddr/blob/master/protocols.csv)
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').protoNames()
   * // [ 'ip4', 'tcp' ]
   * ```
   */
  protoNames(): string[]

  /**
   * Returns a tuple of parts
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').tuples()
   * // [ [ 4, <Buffer 7f 00 00 01> ], [ 6, <Buffer 0f a1> ] ]
   * ```
   */
  tuples(): Tuple[]

  /**
   * Returns a tuple of string/number parts
   * - tuples[][0] = code of protocol
   * - tuples[][1] = contents of address
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').stringTuples()
   * // [ [ 4, '127.0.0.1' ], [ 6, '4001' ] ]
   * ```
   */
  stringTuples(): StringTuple[]

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
   * A more reliable version of `decapsulate` if you are targeting a
   * specific code, such as 421 (the `p2p` protocol code). The last index of the code
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
   * Extract the peerId if the multiaddr contains one
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/8.8.8.8/tcp/1080/ipfs/QmValidBase58string')
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080/ipfs/QmValidBase58string)
   *
   * // should return QmValidBase58string or null if the id is missing or invalid
   * const peerId = mh1.getPeerId()
   * ```
   */
  getPeerId(): string | null

  /**
   * Extract the path if the multiaddr contains one
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/8.8.8.8/tcp/1080/unix/tmp/p2p.sock')
   * // Multiaddr(/ip4/8.8.8.8/tcp/1080/unix/tmp/p2p.sock)
   *
   * // should return utf8 string or null if the id is missing or invalid
   * const path = mh1.getPath()
   * ```
   */
  getPath(): string | null

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

  /**
   * Resolve multiaddr if containing resolvable hostname.
   *
   * @example
   * ```js
   * import { multiaddr, resolvers } from '@multiformats/multiaddr'
   *
   * resolvers.set('dnsaddr', resolverFunction)
   * const mh1 = multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')
   * const resolvedMultiaddrs = await mh1.resolve()
   * // [
   * //   Multiaddr(/ip4/147.75.83.83/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb),
   * //   Multiaddr(/ip4/147.75.83.83/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb),
   * //   Multiaddr(/ip4/147.75.83.83/udp/4001/quic/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb)
   * // ]
   * ```
   */
  resolve(options?: ResolveOptions): Promise<Multiaddr[]>

  /**
   * Gets a Multiaddrs node-friendly address object. Note that protocol information
   * is left out: in Node (and most network systems) the protocol is unknowable
   * given only the address.
   *
   * Has to be a ThinWaist Address, otherwise throws error
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * multiaddr('/ip4/127.0.0.1/tcp/4001').nodeAddress()
   * // {family: 4, address: '127.0.0.1', port: 4001}
   * ```
   */
  nodeAddress(): NodeAddress

  /**
   * Returns if a Multiaddr is a Thin Waist address or not.
   *
   * Thin Waist is if a Multiaddr adheres to the standard combination of:
   *
   * `{IPv4, IPv6}/{TCP, UDP}`
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * const mh1 = multiaddr('/ip4/127.0.0.1/tcp/4001')
   * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
   * const mh2 = multiaddr('/ip4/192.168.2.1/tcp/5001')
   * // Multiaddr(/ip4/192.168.2.1/tcp/5001)
   * const mh3 = mh1.encapsulate(mh2)
   * // Multiaddr(/ip4/127.0.0.1/tcp/4001/ip4/192.168.2.1/tcp/5001)
   * const mh4 = multiaddr('/ip4/127.0.0.1/tcp/2000/wss/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2a')
   * // Multiaddr(/ip4/127.0.0.1/tcp/2000/wss/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2a)
   * mh1.isThinWaistAddress()
   * // true
   * mh2.isThinWaistAddress()
   * // true
   * mh3.isThinWaistAddress()
   * // false
   * mh4.isThinWaistAddress()
   * // false
   * ```
   */
  isThinWaistAddress(addr?: Multiaddr): boolean
}

/**
 * Creates a Multiaddr from a node-friendly address object
 *
 * @example
 * ```js
 * import { fromNodeAddress } from '@multiformats/multiaddr'
 *
 * fromNodeAddress({address: '127.0.0.1', port: '4001'}, 'tcp')
 * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
 * ```
 */
export function fromNodeAddress (addr: NodeAddress, transport: string): Multiaddr {
  if (addr == null) {
    throw new Error('requires node address object')
  }
  if (transport == null) {
    throw new Error('requires transport protocol')
  }
  let ip: string | undefined
  let host = addr.address
  switch (addr.family) {
    case 4:
      ip = 'ip4'
      break
    case 6:
      ip = 'ip6'

      if (host.includes('%')) {
        const parts = host.split('%')

        if (parts.length !== 2) {
          throw Error('Multiple ip6 zones in multiaddr')
        }

        host = parts[0]
        const zone = parts[1]
        ip = `/ip6zone/${zone}/ip6`
      }
      break
    default:
      throw Error('Invalid addr family, should be 4 or 6.')
  }
  return new MultiaddrClass('/' + [ip, host, transport, addr.port].join('/'))
}

/**
 * Returns if something is a {@link Multiaddr} that is a resolvable name
 *
 * @example
 *
 * ```js
 * import { isName, multiaddr } from '@multiformats/multiaddr'
 *
 * isName(multiaddr('/ip4/127.0.0.1'))
 * // false
 * isName(multiaddr('/dns/ipfs.io'))
 * // true
 * ```
 */
export function isName (addr: Multiaddr): boolean {
  if (!isMultiaddr(addr)) {
    return false
  }

  // if a part of the multiaddr is resolvable, then return true
  return addr.protos().some((proto) => proto.resolvable)
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

export { getProtocol as protocols }
