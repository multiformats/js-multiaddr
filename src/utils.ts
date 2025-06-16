import { isIPv4 } from '@chainsafe/is-ip'
import { base32 } from 'multiformats/bases/base32'
import { bases } from 'multiformats/basics'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { InvalidMultiaddrError } from './errors.ts'
import type { MultibaseCodec } from 'multiformats'
import type { SupportedEncodings } from 'uint8arrays/to-string'

export function bytesToString (base: SupportedEncodings): (buf: Uint8Array) => string {
  return (buf) => {
    return uint8ArrayToString(buf, base)
  }
}

export function stringToBytes (base: SupportedEncodings): (value: string) => Uint8Array {
  return (buf) => {
    return uint8ArrayFromString(buf, base)
  }
}

export function bytes2port (buf: Uint8Array): string {
  const view = new DataView(buf.buffer)
  return view.getUint16(buf.byteOffset).toString()
}

export function port2bytes (port: string | number): Uint8Array {
  const buf = new ArrayBuffer(2)
  const view = new DataView(buf)
  view.setUint16(0, typeof port === 'string' ? parseInt(port) : port)

  return new Uint8Array(buf)
}

export function onion2bytes (str: string): Uint8Array {
  const addr = str.split(':')

  if (addr.length !== 2) {
    throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`)
  }

  if (addr[0].length !== 16) {
    throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion address.`)
  }

  // onion addresses do not include the multibase prefix, add it before decoding
  const buf = uint8ArrayFromString(addr[0], 'base32')

  // onion port number
  const port = parseInt(addr[1], 10)

  if (port < 1 || port > 65536) {
    throw new Error('Port number is not in range(1, 65536)')
  }

  const portBuf = port2bytes(port)

  return uint8ArrayConcat([buf, portBuf], buf.length + portBuf.length)
}

export function onion32bytes (str: string): Uint8Array {
  const addr = str.split(':')

  if (addr.length !== 2) {
    throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`)
  }

  if (addr[0].length !== 56) {
    throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion3 address.`)
  }

  // onion addresses do not include the multibase prefix, add it before decoding
  const buf = base32.decode(`b${addr[0]}`)

  // onion port number
  const port = parseInt(addr[1], 10)

  if (port < 1 || port > 65536) {
    throw new Error('Port number is not in range(1, 65536)')
  }

  const portBuf = port2bytes(port)

  return uint8ArrayConcat([buf, portBuf], buf.length + portBuf.length)
}

export function bytes2onion (buf: Uint8Array): string {
  const addrBytes = buf.subarray(0, buf.length - 2)
  const portBytes = buf.subarray(buf.length - 2)
  const addr = uint8ArrayToString(addrBytes, 'base32')
  const port = bytes2port(portBytes)
  return `${addr}:${port}`
}

// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L7
// but with buf/offset args removed because we don't use them
export const ip4ToBytes = function (ip: string): Uint8Array {
  ip = ip.toString().trim()

  const bytes = new Uint8Array(4)

  ip.split(/\./g).forEach((byte, index) => {
    const value = parseInt(byte, 10)

    if (isNaN(value) || value < 0 || value > 0xff) {
      throw new InvalidMultiaddrError('Invalid byte value in IP address')
    }

    bytes[index] = value
  })

  return bytes
}

// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L7
// but with buf/offset args removed because we don't use them
export const ip6ToBytes = function (ip: string): Uint8Array {
  let offset = 0
  ip = ip.toString().trim()

  const sections = ip.split(':', 8)

  let i
  for (i = 0; i < sections.length; i++) {
    const isv4 = isIPv4(sections[i])
    let v4Buffer: Uint8Array | undefined

    if (isv4) {
      v4Buffer = ip4ToBytes(sections[i])
      sections[i] = uint8ArrayToString(v4Buffer.subarray(0, 2), 'base16')
    }

    if (v4Buffer != null && ++i < 8) {
      sections.splice(i, 0, uint8ArrayToString(v4Buffer.subarray(2, 4), 'base16'))
    }
  }

  if (sections[0] === '') {
    while (sections.length < 8) { sections.unshift('0') }
  } else if (sections[sections.length - 1] === '') {
    while (sections.length < 8) { sections.push('0') }
  } else if (sections.length < 8) {
    for (i = 0; i < sections.length && sections[i] !== ''; i++) { }
    const argv: [number, number, ...string[]] = [i, 1]
    for (i = 9 - sections.length; i > 0; i--) {
      argv.push('0')
    }
    sections.splice.apply(sections, argv)
  }

  const bytes = new Uint8Array(offset + 16)

  for (i = 0; i < sections.length; i++) {
    if (sections[i] === '') {
      sections[i] = '0'
    }

    const word = parseInt(sections[i], 16)

    if (isNaN(word) || word < 0 || word > 0xffff) {
      throw new InvalidMultiaddrError('Invalid byte value in IP address')
    }

    bytes[offset++] = (word >> 8) & 0xff
    bytes[offset++] = word & 0xff
  }

  return bytes
}

// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L63
export const ip4ToString = function (buf: Uint8Array): string {
  if (buf.byteLength !== 4) {
    throw new InvalidMultiaddrError('IPv4 address was incorrect length')
  }

  const result = []

  for (let i = 0; i < buf.byteLength; i++) {
    result.push(buf[i])
  }

  return result.join('.')
}

export const ip6ToString = function (buf: Uint8Array): string {
  if (buf.byteLength !== 16) {
    throw new InvalidMultiaddrError('IPv6 address was incorrect length')
  }

  const result: string[] = []

  for (let i = 0; i < buf.byteLength; i += 2) {
    const byte1 = buf[i]
    const byte2 = buf[i + 1]

    const tuple = `${byte1.toString(16).padStart(2, '0')}${byte2.toString(16).padStart(2, '0')}`

    result.push(tuple)
  }

  const ip = result.join(':')

  try {
    const url = new URL(`http://[${ip}]`)

    return url.hostname.substring(1, url.hostname.length - 1)
  } catch {
    throw new InvalidMultiaddrError(`Invalid IPv6 address "${ip}"`)
  }
}

export function ip6StringToValue (str: string): string {
  try {
    const url = new URL(`http://[${str}]`)

    return url.hostname.substring(1, url.hostname.length - 1)
  } catch {
    throw new InvalidMultiaddrError(`Invalid IPv6 address "${str}"`)
  }
}

const decoders = Object.values(bases).map((c) => c.decoder)
const anybaseDecoder = (function () {
  let acc = decoders[0].or(decoders[1])
  decoders.slice(2).forEach((d) => (acc = acc.or(d)))
  return acc
})()

export function mb2bytes (mbstr: string): Uint8Array {
  return anybaseDecoder.decode(mbstr)
}

export function bytes2mb (base: MultibaseCodec<any>): (buf: Uint8Array) => string {
  return (buf) => {
    return base.encoder.encode(buf)
  }
}
