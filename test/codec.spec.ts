/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import varint from 'varint'
import * as codec from '../src/codec.js'
import { convertToBytes } from '../src/convert.js'

describe('codec', () => {
  describe('.stringToStringTuples', () => {
    it('throws on invalid addresses', () => {
      expect(
        () => codec.stringToStringTuples('/ip4/0.0.0.0/ip4')
      ).to.throw(
        /invalid address/
      )
    })
  })

  describe('.stringTuplesToTuples', () => {
    const testCases: Array<{ name: string, stringTuples: Array<string[] | string>, tuples: Array<[number, Uint8Array?]>, path: string | null }> = [
      { name: 'handles non array tuples', stringTuples: [['ip4', '0.0.0.0'], 'utp'], tuples: [[4, Uint8Array.from([0, 0, 0, 0])], [302]], path: null },
      { name: 'handle not null path', stringTuples: [['unix', '/tmp/p2p.sock']], tuples: [[400, convertToBytes(400, '/tmp/p2p.sock')]], path: '/tmp/p2p.sock' }
    ]

    for (const { name, stringTuples, tuples, path } of testCases) {
      it(name, () => {
        expect(
          codec.stringTuplesToTuples(stringTuples)
        ).to.eql(
          { tuples, path }
        )
      })
    }
  })

  describe('.tuplesToStringTuples', () => {
    it('single element tuples', () => {
      expect(
        codec.tuplesToStringTuples([[302]])
      ).to.eql(
        [[302]]
      )
    })
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

  describe('.fromBytes', () => {
    it('throws on invalid buffer', () => {
      expect(
        () => codec.fromBytes(uint8ArrayFromString('hello/world'))
      ).to.throw()
    })
  })

  describe('.isValidBytes', () => {
    it('returns true for valid buffers', () => {
      expect(
        codec.isValidBytes(Uint8Array.from(varint.encode(302)))
      ).to.equal(true)
    })

    it('returns false for invalid buffers', () => {
      expect(
        codec.isValidBytes(Uint8Array.from(varint.encode(1234)))
      ).to.equal(false)
    })
  })
})
