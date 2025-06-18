import * as varint from 'uint8-varint'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { InvalidMultiaddrError } from './errors.ts'
import { registry, V } from './registry.ts'
import type { Component } from './index.js'
import type { ProtocolCodec } from './registry.ts'

export function bytesToComponents (bytes: Uint8Array): Component[] {
  const components: Component[] = []

  let i = 0
  while (i < bytes.length) {
    const code = varint.decode(bytes, i)
    const codec = registry.getProtocol(code)
    const codeLength = varint.encodingLength(code)
    const size = sizeForAddr(codec, bytes, i + codeLength)
    let sizeLength = 0

    if (size > 0 && codec.size === V) {
      sizeLength = varint.encodingLength(size)
    }

    const componentLength = codeLength + sizeLength + size

    const component: Component = {
      code,
      name: codec.name,
      bytes: bytes.subarray(i, i + componentLength)
    }

    if (size > 0) {
      const valueOffset = i + codeLength + sizeLength
      const valueBytes = bytes.subarray(valueOffset, valueOffset + size)

      component.value = codec.bytesToValue?.(valueBytes) ?? uint8ArrayToString(valueBytes)
    }

    components.push(component)

    i += componentLength
  }

  return components
}

export function componentsToBytes (components: Component[]): Uint8Array {
  let length = 0
  const bytes: Uint8Array[] = []

  for (const component of components) {
    if (component.bytes == null) {
      const codec = registry.getProtocol(component.code)
      const codecLength = varint.encodingLength(component.code)
      let valueBytes: Uint8Array | undefined
      let valueLength = 0
      let valueLengthLength = 0

      if (component.value != null) {
        valueBytes = codec.valueToBytes?.(component.value) ?? uint8ArrayFromString(component.value)
        valueLength = valueBytes.byteLength

        if (codec.size === V) {
          valueLengthLength = varint.encodingLength(valueLength)
        }
      }

      const bytes = new Uint8Array(codecLength + valueLengthLength + valueLength)

      // encode the protocol code
      let offset = 0
      varint.encodeUint8Array(component.code, bytes, offset)
      offset += codecLength

      // if there is a value
      if (valueBytes != null) {
        // if the value has variable length, encode the length
        if (codec.size === V) {
          varint.encodeUint8Array(valueLength, bytes, offset)
          offset += valueLengthLength
        }

        // finally encode the value
        bytes.set(valueBytes, offset)
      }

      component.bytes = bytes
    }

    bytes.push(component.bytes)
    length += component.bytes.byteLength
  }

  return uint8ArrayConcat(bytes, length)
}

export function stringToComponents (string: string): Component[] {
  if (string.charAt(0) !== '/') {
    throw new InvalidMultiaddrError('String multiaddr must start with "/"')
  }

  const components: Component[] = []
  let collecting: 'protocol' | 'value' = 'protocol'
  let value = ''
  let protocol = ''

  for (let i = 1; i < string.length; i++) {
    const char = string.charAt(i)

    if (char !== '/') {
      if (collecting === 'protocol') {
        protocol += string.charAt(i)
      } else {
        value += string.charAt(i)
      }
    }

    const ended = i === string.length - 1

    if (char === '/' || ended) {
      const codec = registry.getProtocol(protocol)

      if (collecting === 'protocol') {
        if (codec.size == null || codec.size === 0) {
          // a protocol without an address, eg. `/tls`
          components.push({
            code: codec.code,
            name: codec.name
          })

          value = ''
          protocol = ''
          collecting = 'protocol'

          continue
        } else if (ended) {
          throw new InvalidMultiaddrError(`Component ${protocol} was missing value`)
        }

        // continue collecting value
        collecting = 'value'
      } else if (collecting === 'value') {
        const component: Component = {
          code: codec.code,
          name: codec.name
        }

        if (codec.size != null && codec.size !== 0) {
          if (value === '') {
            throw new InvalidMultiaddrError(`Component ${protocol} was missing value`)
          }

          component.value = codec.stringToValue?.(value) ?? value
        }

        components.push(component)

        value = ''
        protocol = ''
        collecting = 'protocol'
      }
    }
  }

  if (protocol !== '' && value !== '') {
    throw new InvalidMultiaddrError('Incomplete multiaddr')
  }

  return components
}

export function componentsToString (components: Component[]): string {
  return `/${components.flatMap(component => {
      if (component.value == null) {
        return component.name
      }

      const codec = registry.getProtocol(component.code)

      if (codec == null) {
        throw new InvalidMultiaddrError(`Unknown protocol code ${component.code}`)
      }

      return [
        component.name,
        codec.valueToString?.(component.value) ?? component.value
      ]
    }).join('/')}`
}

/**
 * For the passed address, return the serialized size
 */
function sizeForAddr (codec: ProtocolCodec, bytes: Uint8Array, offset: number): number {
  if (codec.size == null || codec.size === 0) {
    return 0
  }

  if (codec.size > 0) {
    return codec.size / 8
  }

  return varint.decode(bytes, offset)
}
