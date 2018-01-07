/* eslint-env mocha */
'use strict'

const codec = require('../src/codec')
const varint = require('varint')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

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
        [[4, Buffer.from([0, 0, 0, 0])], [302]]
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

  describe('.bufferToTuples', () => {
    it('throws on invalid address', () => {
      expect(
        () => codec.bufferToTuples(codec.tuplesToBuffer([[4, Buffer.from('192')]]))
      ).to.throw(
        /Invalid address buffer/
      )
    })
  })

  describe('.fromBuffer', () => {
    it('throws on invalid buffer', () => {
      expect(
        () => codec.fromBuffer(Buffer.from('hello/world'))
      ).to.throw()
    })
  })

  describe('.isValidBuffer', () => {
    it('returns true for valid buffers', () => {
      expect(
        codec.isValidBuffer(Buffer.from(varint.encode(302)))
      ).to.equal(true)
    })

    it('returns false for invalid buffers', () => {
      expect(
        codec.isValidBuffer(Buffer.from(varint.encode(1234)))
      ).to.equal(false)
    })
  })
})
