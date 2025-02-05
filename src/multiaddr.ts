/* eslint-disable complexity */
import { base58btc } from 'multiformats/bases/base58'
import { CID } from 'multiformats/cid'
import { equals as uint8ArrayEquals } from 'uint8arrays/equals'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { bytesToMultiaddrParts, stringToMultiaddrParts, type MultiaddrParts, tuplesToBytes } from './codec.js'
import { getProtocol, names } from './protocols-table.js'
import { isMultiaddr, multiaddr, resolvers } from './index.js'
import type { MultiaddrInput, Multiaddr as MultiaddrInterface, MultiaddrObject, Protocol, StringTuple, Tuple, NodeAddress, ResolveOptions } from './index.js'

const inspect = Symbol.for('nodejs.util.inspect.custom')
export const symbol = Symbol.for('@multiformats/js-multiaddr/multiaddr')

const DNS_CODES = [
  getProtocol('dns').code,
  getProtocol('dns4').code,
  getProtocol('dns6').code,
  getProtocol('dnsaddr').code
]

class NoAvailableResolverError extends Error {
  constructor (message = 'No available resolver') {
    super(message)
    this.name = 'NoAvailableResolverError'
  }
}

/**
 * Creates a {@link Multiaddr} from a {@link MultiaddrInput}
 */
export class Multiaddr implements MultiaddrInterface {
  public bytes: Uint8Array
  readonly #string: string
  readonly #tuples: Tuple[]
  readonly #stringTuples: StringTuple[]
  readonly #path: string | null

  [symbol]: boolean = true

  constructor (addr?: MultiaddrInput) {
    // default
    if (addr == null) {
      addr = ''
    }

    let parts: MultiaddrParts
    if (addr instanceof Uint8Array) {
      parts = bytesToMultiaddrParts(addr)
    } else if (typeof addr === 'string') {
      if (addr.length > 0 && addr.charAt(0) !== '/') {
        throw new Error(`multiaddr "${addr}" must start with a "/"`)
      }
      parts = stringToMultiaddrParts(addr)
    } else if (isMultiaddr(addr)) { // Multiaddr
      parts = bytesToMultiaddrParts(addr.bytes)
    } else {
      throw new Error('addr must be a string, Buffer, or another Multiaddr')
    }

    this.bytes = parts.bytes
    this.#string = parts.string
    this.#tuples = parts.tuples
    this.#stringTuples = parts.stringTuples
    this.#path = parts.path
  }

  toString (): string {
    return this.#string
  }

  toJSON (): string {
    return this.toString()
  }

  toOptions (): MultiaddrObject {
    let family: 4 | 6 | undefined
    let transport: 'tcp' | 'udp' | undefined
    let host: string | undefined
    let port: number | undefined
    let zone = ''

    const tcp = getProtocol('tcp')
    const udp = getProtocol('udp')
    const ip4 = getProtocol('ip4')
    const ip6 = getProtocol('ip6')
    const dns6 = getProtocol('dns6')
    const ip6zone = getProtocol('ip6zone')

    for (const [code, value] of this.stringTuples()) {
      if (code === ip6zone.code) {
        zone = `%${value ?? ''}`
      }

      // default to https when protocol & port are omitted from DNS addrs
      if (DNS_CODES.includes(code)) {
        transport = tcp.name === 'tcp' ? 'tcp' : 'udp'
        port = 443
        host = `${value ?? ''}${zone}`
        family = code === dns6.code ? 6 : 4
      }

      if (code === tcp.code || code === udp.code) {
        transport = getProtocol(code).name === 'tcp' ? 'tcp' : 'udp'
        port = parseInt(value ?? '')
      }

      if (code === ip4.code || code === ip6.code) {
        transport = getProtocol(code).name === 'tcp' ? 'tcp' : 'udp'
        host = `${value ?? ''}${zone}`
        family = code === ip6.code ? 6 : 4
      }
    }

    if (family == null || transport == null || host == null || port == null) {
      throw new Error('multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}".')
    }

    const opts: MultiaddrObject = {
      family,
      host,
      transport,
      port
    }

    return opts
  }

  protos (): Protocol[] {
    return this.#tuples.map(([code]) => Object.assign({}, getProtocol(code)))
  }

  protoCodes (): number[] {
    return this.#tuples.map(([code]) => code)
  }

  protoNames (): string[] {
    return this.#tuples.map(([code]) => getProtocol(code).name)
  }

  tuples (): Array<[number, Uint8Array?]> {
    return this.#tuples.map(([code, value]) => {
      if (value == null) {
        return [code]
      }

      return [code, value]
    })
  }

  stringTuples (): Array<[number, string?]> {
    return this.#stringTuples.map(([code, value]) => {
      if (value == null) {
        return [code]
      }

      return [code, value]
    })
  }

  encapsulate (addr: MultiaddrInput): Multiaddr {
    addr = new Multiaddr(addr)
    return new Multiaddr(this.toString() + addr.toString())
  }

  decapsulate (addr: Multiaddr | string): Multiaddr {
    const addrString = addr.toString()
    const s = this.toString()
    const i = s.lastIndexOf(addrString)
    if (i < 0) {
      throw new Error(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`)
    }
    return new Multiaddr(s.slice(0, i))
  }

  decapsulateCode (code: number): Multiaddr {
    const tuples = this.tuples()
    for (let i = tuples.length - 1; i >= 0; i--) {
      if (tuples[i][0] === code) {
        return new Multiaddr(tuplesToBytes(tuples.slice(0, i)))
      }
    }
    return this
  }

  getPeerId (): string | null {
    try {
      let tuples: Array<[number, string | undefined]> = []

      this.stringTuples().forEach(([code, name]) => {
        if (code === names.p2p.code) {
          tuples.push([code, name])
        }

        // if this is a p2p-circuit address, return the target peer id if present
        // not the peer id of the relay
        if (code === names['p2p-circuit'].code) {
          tuples = []
        }
      })

      // Get the last ipfs tuple ['p2p', 'peerid string']
      const tuple = tuples.pop()
      if (tuple?.[1] != null) {
        const peerIdStr = tuple[1]

        // peer id is base58btc encoded string but not multibase encoded so add the `z`
        // prefix so we can validate that it is correctly encoded
        if (peerIdStr[0] === 'Q' || peerIdStr[0] === '1') {
          return uint8ArrayToString(base58btc.decode(`z${peerIdStr}`), 'base58btc')
        }

        // try to parse peer id as CID
        return uint8ArrayToString(CID.parse(peerIdStr).multihash.bytes, 'base58btc')
      }

      return null
    } catch (e) {
      return null
    }
  }

  getPath (): string | null {
    return this.#path
  }

  equals (addr: { bytes: Uint8Array }): boolean {
    return uint8ArrayEquals(this.bytes, addr.bytes)
  }

  async resolve (options?: ResolveOptions): Promise<MultiaddrInterface[]> {
    const resolvableProto = this.protos().find((p) => p.resolvable)

    // Multiaddr is not resolvable?
    if (resolvableProto == null) {
      return [this]
    }

    const resolver = resolvers.get(resolvableProto.name)
    if (resolver == null) {
      throw new NoAvailableResolverError(`no available resolver for ${resolvableProto.name}`)
    }

    const result = await resolver(this, options)

    return result.map(str => multiaddr(str))
  }

  nodeAddress (): NodeAddress {
    const options = this.toOptions()

    if (options.transport !== 'tcp' && options.transport !== 'udp') {
      throw new Error(`multiaddr must have a valid format - no protocol with name: "${options.transport}". Must have a valid transport protocol: "{tcp, udp}"`)
    }

    return {
      family: options.family,
      address: options.host,
      port: options.port
    }
  }

  isThinWaistAddress (addr?: Multiaddr): boolean {
    const protos = (addr ?? this).protos()

    if (protos.length !== 2) {
      return false
    }

    if (protos[0].code !== 4 && protos[0].code !== 41) {
      return false
    }
    if (protos[1].code !== 6 && protos[1].code !== 273) {
      return false
    }
    return true
  }

  /**
   * Returns Multiaddr as a human-readable string
   * https://nodejs.org/api/util.html#utilinspectcustom
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * console.info(multiaddr('/ip4/127.0.0.1/tcp/4001'))
   * // 'Multiaddr(/ip4/127.0.0.1/tcp/4001)'
   * ```
   */
  [inspect] (): string {
    return `Multiaddr(${this.#string})`
  }
}
