/* eslint-env mocha */
import * as convert from '../src/convert.js'
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'

describe('convert', () => {
  it('handles ip4 buffers', () => {
    expect(
      convert.convertToString('ip4', uint8ArrayFromString('c0a80001', 'base16'))
    ).to.eql(
      '192.168.0.1'
    )
  })

  it('handles ip6 buffers', () => {
    expect(
      convert.convertToString('ip6', uint8ArrayFromString('abcd0000000100020003000400050006', 'base16'))
    ).to.eql(
      'abcd:0:1:2:3:4:5:6'
    )
  })

  it('handles ipv6 strings', () => {
    expect(
      convert.convertToBytes('ip6', 'ABCD::1:2:3:4:5:6')
    ).to.eql(
      uint8ArrayFromString('ABCD0000000100020003000400050006', 'base16upper')
    )
  })

  it('handles ip4 strings', () => {
    expect(
      convert.convertToBytes('ip4', '192.168.0.1')
    ).to.eql(
      uint8ArrayFromString('c0a80001', 'base16')
    )
  })

  it('throws on invalid ip4 conversion', () => {
    expect(
      () => convert.convertToBytes('ip4', '555.168.0.1')
    ).to.throw(
      /invalid ip address/
    )
  })

  it('throws on invalid ip6 conversion', () => {
    expect(
      () => convert.convertToBytes('ip6', 'FFFF::GGGG')
    ).to.throw(
      /invalid ip address/
    )
  })

  describe('.toBytes', () => {
    it('defaults to hex conversion', () => {
      expect(
        convert.convertToBytes('ws', 'c0a80001')
      ).to.eql(
        Uint8Array.from([192, 168, 0, 1])
      )
    })
  })

  describe('.toString', () => {
    it('throws on inconsistent ipfs links', () => {
      const valid = uint8ArrayFromString('03221220d52ebb89d85b02a284948203a62ff28389c57c9f42beec4ec20db76a68911c0b', 'base16')
      expect(
        () => convert.convertToString('ipfs', valid.slice(0, valid.length - 8))
      ).to.throw(
        /inconsistent length/
      )
    })

    it('defaults to hex conversion', () => {
      expect(
        convert.convertToString('ws', Uint8Array.from([192, 168, 0, 1]))
      ).to.eql(
        'c0a80001'
      )
    })

    it('respects byteoffset during conversion', () => {
      const bytes = convert.convertToBytes('sctp', '1234')
      const buffer = new Uint8Array(bytes.byteLength + 5)
      buffer.set(bytes, 5)
      expect(convert.convertToString('sctp', buffer.subarray(5))).to.equal('1234')
    })
  })

  it('can round-trip certhash, though encoding base may change', () => {
    const myCertFingerprint = {
      algorithm: 'sha-256',
      value: 'f4:32:a0:45:34:62:85:e0:d8:d7:75:36:84:72:8e:b2:aa:9e:71:64:e4:eb:fe:06:51:64:42:64:fe:04:a8:d0'
    }
    const mb = 'f' + myCertFingerprint.value.replaceAll(':', '')
    const bytes = convert.convertToBytes('certhash', mb)
    const outcome = convert.convertToString(466, bytes)
    expect(outcome).to.equal('u9DKgRTRiheDY13U2hHKOsqqecWTk6_4GUWRCZP4EqNA')
    const bytesOut = convert.convertToBytes(466, outcome)
    expect(bytesOut.toString()).to.equal(bytes.toString())
  })
})
