import * as varint from 'uint8-varint'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { convertToBytes, convertToString } from './convert.js'
import { getProtocol } from './protocols-table.js'
import type { StringTuple, Tuple, Protocol } from './index.js'

export interface MultiaddrParts {
  bytes: Uint8Array
  string: string
  tuples: Tuple[]
  stringTuples: StringTuple[]
  path: string | null
}

export function stringToMultiaddrParts (str: string): MultiaddrParts {
  str = cleanPath(str)
  const tuples: Tuple[] = []
  const stringTuples: StringTuple[] = []
  let path: string | null = null

  const parts = str.split('/').slice(1)
  if (parts.length === 1 && parts[0] === '') {
    return {
      bytes: new Uint8Array(),
      string: '/',
      tuples: [],
      stringTuples: [],
      path: null
    }
  }

  for (let p = 0; p < parts.length; p++) {
    const part = parts[p]
    const proto = getProtocol(part)

    if (proto.size === 0) {
      tuples.push([proto.code])
      stringTuples.push([proto.code])
      // eslint-disable-next-line no-continue
      continue
    }

    p++ // advance addr part
    if (p >= parts.length) {
      throw new ParseError('invalid address: ' + str)
    }

    // if it's a path proto, take the rest
    if (proto.path === true) {
      // should we need to check each path part to see if it's a proto?
      // This would allow for other protocols to be added after a unix path,
      // however it would have issues if the path had a protocol name in the path
      path = cleanPath(parts.slice(p).join('/'))
      tuples.push([proto.code, convertToBytes(proto.code, path)])
      stringTuples.push([proto.code, path])
      break
    }

    const bytes = convertToBytes(proto.code, parts[p])
    tuples.push([proto.code, bytes])
    stringTuples.push([proto.code, convertToString(proto.code, bytes)])
  }

  return {
    string: stringTuplesToString(stringTuples),
    bytes: tuplesToBytes(tuples),
    tuples,
    stringTuples,
    path
  }
}

export function bytesToMultiaddrParts (bytes: Uint8Array): MultiaddrParts {
  const tuples: Tuple[] = []
  const stringTuples: StringTuple[] = []
  let path: string | null = null

  let i = 0
  while (i < bytes.length) {
    const code = varint.decode(bytes, i)
    const n = varint.encodingLength(code)

    const p = getProtocol(code)

    const size = sizeForAddr(p, bytes.slice(i + n))

    if (size === 0) {
      tuples.push([code])
      stringTuples.push([code])
      i += n
      // eslint-disable-next-line no-continue
      continue
    }

    const addr = bytes.slice(i + n, i + n + size)

    i += (size + n)

    if (i > bytes.length) { // did not end _exactly_ at buffer.length
      throw new ParseError('Invalid address Uint8Array: ' + uint8ArrayToString(bytes, 'base16'))
    }

    // ok, tuple seems good.
    tuples.push([code, addr])
    const stringAddr = convertToString(code, addr)
    stringTuples.push([code, stringAddr])
    if (p.path === true) {
      // should we need to check each path part to see if it's a proto?
      // This would allow for other protocols to be added after a unix path,
      // however it would have issues if the path had a protocol name in the path
      path = stringAddr
      break
    }
  }

  return {
    bytes: Uint8Array.from(bytes),
    string: stringTuplesToString(stringTuples),
    tuples,
    stringTuples,
    path
  }
}

/**
 * [[str name, str addr]... ] -> string
 */
function stringTuplesToString (tuples: StringTuple[]): string {
  const parts: string[] = []
  tuples.map((tup) => {
    const proto = getProtocol(tup[0])
    parts.push(proto.name)
    if (tup.length > 1 && tup[1] != null) {
      parts.push(tup[1])
    }
    return null
  })

  return cleanPath(parts.join('/'))
}

/**
 * [[int code, Uint8Array ]... ] -> Uint8Array
 */
export function tuplesToBytes (tuples: Tuple[]): Uint8Array {
  return uint8ArrayConcat(tuples.map((tup) => {
    const proto = getProtocol(tup[0])
    let buf = Uint8Array.from(varint.encode(proto.code))

    if (tup.length > 1 && tup[1] != null) {
      buf = uint8ArrayConcat([buf, tup[1]]) // add address buffer
    }

    return buf
  }))
}

/**
 * For the passed address, return the serialized size
 */
function sizeForAddr (p: Protocol, addr: Uint8Array | number[]): number {
  if (p.size > 0) {
    return p.size / 8
  } else if (p.size === 0) {
    return 0
  } else {
    const size = varint.decode(addr instanceof Uint8Array ? addr : Uint8Array.from(addr))
    return size + varint.encodingLength(size)
  }
}

export function bytesToTuples (buf: Uint8Array): Tuple[] {
  const tuples: Array<[number, Uint8Array?]> = []
  let i = 0
  while (i < buf.length) {
    const code = varint.decode(buf, i)
    const n = varint.encodingLength(code)

    const p = getProtocol(code)

    const size = sizeForAddr(p, buf.slice(i + n))

    if (size === 0) {
      tuples.push([code])
      i += n
      // eslint-disable-next-line no-continue
      continue
    }

    const addr = buf.slice(i + n, i + n + size)

    i += (size + n)

    if (i > buf.length) { // did not end _exactly_ at buffer.length
      throw new ParseError('Invalid address Uint8Array: ' + uint8ArrayToString(buf, 'base16'))
    }

    // ok, tuple seems good.
    tuples.push([code, addr])
  }

  return tuples
}

export function cleanPath (str: string): string {
  return '/' + str.trim().split('/').filter((a) => a).join('/')
}

export class ParseError extends Error {
  static name = 'ParseError'
  name = 'ParseError'

  constructor (str: string) {
    super(`Error parsing address: ${str}`)
  }
}
