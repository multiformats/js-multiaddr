import { base58btc } from 'multiformats/bases/base58'
import { CID } from 'multiformats/cid'
import { equals as uint8ArrayEquals } from 'uint8arrays/equals'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { bytesToComponents, componentsToBytes, componentsToString, stringToComponents } from './components.js'
import { CODE_DNS, CODE_DNS4, CODE_DNS6, CODE_DNSADDR, CODE_IP4, CODE_IP6, CODE_IP6ZONE, CODE_P2P, CODE_P2P_CIRCUIT, CODE_TCP, CODE_UDP } from './constants.ts'
import { InvalidMultiaddrError, InvalidParametersError } from './errors.ts'
import { registry } from './registry.ts'
import { isMultiaddr, multiaddr, resolvers } from './index.js'
import type { MultiaddrInput, Multiaddr as MultiaddrInterface, MultiaddrObject, Protocol, Tuple, NodeAddress, ResolveOptions, Component } from './index.js'

const inspect = Symbol.for('nodejs.util.inspect.custom')
export const symbol = Symbol.for('@multiformats/multiaddr')

const DNS_CODES = [
  CODE_DNS,
  CODE_DNS4,
  CODE_DNS6,
  CODE_DNSADDR
]

class NoAvailableResolverError extends Error {
  constructor (message = 'No available resolver') {
    super(message)
    this.name = 'NoAvailableResolverError'
  }
}

function toComponents (addr: MultiaddrInput): Component[] {
  if (addr == null) {
    addr = '/'
  }

  if (isMultiaddr(addr)) {
    return addr.getComponents()
  }

  if (addr instanceof Uint8Array) {
    return bytesToComponents(addr)
  }

  if (typeof addr === 'string') {
    addr = addr
      .replace(/\/(\/)+/, '/')
      .replace(/(\/)+$/, '')

    if (addr === '') {
      addr = '/'
    }

    return stringToComponents(addr)
  }

  if (Array.isArray(addr)) {
    return addr
  }

  throw new InvalidMultiaddrError('Must be a string, Uint8Array, Component[], or another Multiaddr')
}

interface MultiaddrOptions {
  validate?: boolean
}

/**
 * Creates a {@link Multiaddr} from a {@link MultiaddrInput}
 */
export class Multiaddr implements MultiaddrInterface {
  [symbol]: boolean = true
  readonly #components: Component[]

  // cache string representation
  #string: string | undefined
  // cache byte representation
  #bytes: Uint8Array | undefined

  constructor (addr: MultiaddrInput | Component[] = '/', options: MultiaddrOptions = {}) {
    this.#components = toComponents(addr)

    if (options.validate !== false) {
      validate(this)
    }
  }

  get bytes (): Uint8Array {
    if (this.#bytes == null) {
      this.#bytes = componentsToBytes(this.#components)
    }

    return this.#bytes
  }

  toString (): string {
    if (this.#string == null) {
      this.#string = componentsToString(this.#components)
    }

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

    for (const { code, name, value } of this.#components) {
      if (code === CODE_IP6ZONE) {
        zone = `%${value ?? ''}`
      }

      // default to https when protocol & port are omitted from DNS addrs
      if (DNS_CODES.includes(code)) {
        transport = 'tcp'
        port = 443
        host = `${value ?? ''}${zone}`
        family = code === CODE_DNS6 ? 6 : 4
      }

      if (code === CODE_TCP || code === CODE_UDP) {
        transport = name === 'tcp' ? 'tcp' : 'udp'
        port = parseInt(value ?? '')
      }

      if (code === CODE_IP4 || code === CODE_IP6) {
        transport = 'tcp'
        host = `${value ?? ''}${zone}`
        family = code === CODE_IP6 ? 6 : 4
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

  getComponents (): Component[] {
    return [
      ...this.#components
    ]
  }

  protos (): Protocol[] {
    return this.#components.map(({ code, value }) => {
      const codec = registry.getProtocol(code)

      return {
        code,
        size: codec.size ?? 0,
        name: codec.name,
        resolvable: Boolean(codec.resolvable),
        path: Boolean(codec.path)
      }
    })
  }

  protoCodes (): number[] {
    return this.#components.map(({ code }) => code)
  }

  protoNames (): string[] {
    return this.#components.map(({ name }) => name)
  }

  tuples (): Tuple[] {
    return this.#components.map(({ code, value }) => {
      if (value == null) {
        return [code]
      }

      const codec = registry.getProtocol(code)
      const output: Tuple = [code]

      if (value != null) {
        output.push(codec.valueToBytes?.(value) ?? uint8ArrayFromString(value))
      }

      return output
    })
  }

  stringTuples (): Array<[number, string?]> {
    return this.#components.map(({ code, value }) => {
      if (value == null) {
        return [code]
      }

      return [code, value]
    })
  }

  encapsulate (addr: MultiaddrInput): MultiaddrInterface {
    const ma = new Multiaddr(addr)

    return new Multiaddr([
      ...this.#components,
      ...ma.getComponents()
    ], {
      validate: false
    })
  }

  decapsulate (addr: Multiaddr | string): MultiaddrInterface {
    const addrString = addr.toString()
    const s = this.toString()
    const i = s.lastIndexOf(addrString)

    if (i < 0) {
      throw new InvalidParametersError(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`)
    }

    return new Multiaddr(s.slice(0, i), {
      validate: false
    })
  }

  decapsulateCode (code: number): Multiaddr {
    let index

    for (let i = this.#components.length - 1; i > -1; i--) {
      if (this.#components[i].code === code) {
        index = i
        break
      }
    }

    return new Multiaddr(this.#components.slice(0, index), {
      validate: false
    })
  }

  getPeerId (): string | null {
    try {
      let tuples: Array<[number, string | undefined]> = []

      this.#components.forEach(({ code, value }) => {
        if (code === CODE_P2P) {
          tuples.push([code, value])
        }

        // if this is a p2p-circuit address, return the target peer id if present
        // not the peer id of the relay
        if (code === CODE_P2P_CIRCUIT) {
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
    for (const component of this.#components) {
      const codec = registry.getProtocol(component.code)

      if (!codec.path) {
        continue
      }

      return component.value ?? null
    }

    return null
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

  isThinWaistAddress (): boolean {
    if (this.#components.length !== 2) {
      return false
    }

    if (this.#components[0].code !== CODE_IP4 && this.#components[0].code !== CODE_IP6) {
      return false
    }

    if (this.#components[1].code !== CODE_TCP && this.#components[1].code !== CODE_UDP) {
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
    return `Multiaddr(${this.toString()})`
  }
}

/**
 * Ensures all multiaddr tuples are correct. Throws if any invalid protocols or
 * values are encountered.
 */
export function validate (addr: Multiaddr): void {
  addr.getComponents()
    .forEach(component => {
      const codec = registry.getProtocol(component.code)

      if (component.value == null) {
        return
      }

      codec.validate?.(component.value)
    })
}
