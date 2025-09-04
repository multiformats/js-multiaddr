import { equals as uint8ArrayEquals } from 'uint8arrays/equals'
import { bytesToComponents, componentsToBytes, componentsToString, stringToComponents } from './components.js'
import { InvalidMultiaddrError, InvalidParametersError } from './errors.ts'
import { registry } from './registry.ts'
import { isMultiaddr } from './index.js'
import type { MultiaddrInput, Multiaddr as MultiaddrInterface, Component } from './index.js'

const inspect = Symbol.for('nodejs.util.inspect.custom')
export const symbol = Symbol.for('@multiformats/multiaddr')

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

  getComponents (): Component[] {
    return [
      ...this.#components.map(c => ({ ...c }))
    ]
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
      throw new InvalidParametersError(`Address ${this.toString()} does not contain subaddress: ${addrString}`)
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

  equals (addr: { bytes: Uint8Array }): boolean {
    return uint8ArrayEquals(this.bytes, addr.bytes)
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
