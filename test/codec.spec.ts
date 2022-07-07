/* eslint-env mocha */
import * as codec from '../src/codec.js'
import varint from 'varint'
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'

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
    it('handles non array tuples', () => {
      expect(
        codec.stringTuplesToTuples([['ip4', '0.0.0.0'], 'utp'])
      ).to.eql(
        [[4, Uint8Array.from([0, 0, 0, 0])], [302]]
      )
    })
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
