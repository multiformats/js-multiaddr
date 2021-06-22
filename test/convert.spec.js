/* eslint-env mocha */
'use strict'

const convert = require('../src/convert')
const { expect } = require('aegir/utils/chai')
const uint8ArrayFromString = require('uint8arrays/from-string')

describe('convert', () => {
  it('handles ip4 buffers', () => {
    expect(
      convert('ip4', uint8ArrayFromString('c0a80001', 'base16'))
    ).to.eql(
      '192.168.0.1'
    )
  })

  it('handles ip6 buffers', () => {
    expect(
      convert('ip6', uint8ArrayFromString('abcd0000000100020003000400050006', 'base16'))
    ).to.eql(
      'abcd:0:1:2:3:4:5:6'
    )
  })

  it('handles ipv6 strings', () => {
    expect(
      convert('ip6', 'ABCD::1:2:3:4:5:6')
    ).to.eql(
      uint8ArrayFromString('ABCD0000000100020003000400050006', 'base16upper')
    )
  })

  it('handles ip4 strings', () => {
    expect(
      convert('ip4', '192.168.0.1')
    ).to.eql(
      uint8ArrayFromString('c0a80001', 'base16')
    )
  })

  it('throws on invalid ip4 conversion', () => {
    expect(
      () => convert('ip4', '555.168.0.1')
    ).to.throw(
      /invalid ip address/
    )
  })

  it('throws on invalid ip6 conversion', () => {
    expect(
      () => convert('ip6', 'FFFF::GGGG')
    ).to.throw(
      /invalid ip address/
    )
  })

  describe('.toBytes', () => {
    it('defaults to hex conversion', () => {
      expect(
        convert.toBytes('ws', 'c0a80001')
      ).to.eql(
        Uint8Array.from([192, 168, 0, 1])
      )
    })
  })

  describe('.toString', () => {
    it('throws on inconsistent ipfs links', () => {
      const valid = uint8ArrayFromString('03221220d52ebb89d85b02a284948203a62ff28389c57c9f42beec4ec20db76a68911c0b', 'base16')
      expect(
        () => convert.toString('ipfs', valid.slice(0, valid.length - 8))
      ).to.throw(
        /inconsistent length/
      )
    })

    it('defaults to hex conversion', () => {
      expect(
        convert.toString('ws', Uint8Array.from([192, 168, 0, 1]))
      ).to.eql(
        'c0a80001'
      )
    })

    it('respects byteoffset during conversion', () => {
      const bytes = convert.toBytes('sctp', '1234')
      const buffer = new Uint8Array(bytes.byteLength + 5)
      buffer.set(bytes, 5)
      expect(convert.toString('sctp', buffer.subarray(5))).to.equal('1234')
    })
  })
})
