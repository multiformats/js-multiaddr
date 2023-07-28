/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import * as codec from '../src/codec.js'
import { convertToBytes } from '../src/convert.js'
import type { StringTuple, Tuple } from '../src/index.js'

describe('codec', () => {
  describe('.stringToMultiaddrParts', () => {
    it('throws on invalid addresses', () => {
      expect(
        () => codec.stringToMultiaddrParts('/ip4/0.0.0.0/ip4')
      ).to.throw(
        /invalid address/
      )
    })
  })

  describe('.stringToMultiaddrParts', () => {
    const testCases: Array<{ name: string, string: string, stringTuples: StringTuple[], tuples: Tuple[], path: string | null }> = [
      { name: 'handles non array tuples', string: '/ip4/0.0.0.0/utp', stringTuples: [[4, '0.0.0.0'], [302]], tuples: [[4, Uint8Array.from([0, 0, 0, 0])], [302]], path: null },
      { name: 'handle not null path', string: '/unix/tmp/p2p.sock', stringTuples: [[400, '/tmp/p2p.sock']], tuples: [[400, convertToBytes(400, '/tmp/p2p.sock')]], path: '/tmp/p2p.sock' }
    ]

    for (const { name, string, stringTuples, tuples, path } of testCases) {
      it(name, () => {
        const parts = codec.stringToMultiaddrParts(string)
        expect(parts.stringTuples).to.eql(stringTuples)
        expect(parts.tuples).to.eql(tuples)
        expect(parts.path).to.eql(path)
      })
    }
  })

  describe('.bytesToTuples', () => {
    it('throws on invalid address', () => {
      expect(
        () => codec.bytesToTuples(codec.tuplesToBytes([[4, uint8ArrayFromString('192')]]))
      ).to.throw(
        /Invalid address/
      )
    })
  })
})
