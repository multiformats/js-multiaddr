/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { base64url } from 'multiformats/bases/base64'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { bytes2mb, bytes2port, convertToIpNet, ip4ToBytes, ip4ToString, ip6ToBytes, ip6ToString, mb2bytes, port2bytes } from '../src/convert.ts'
import { multiaddr } from '../src/index.js'

describe('convert', () => {
  it('handles ip4 buffers', () => {
    expect(ip4ToString(uint8ArrayFromString('c0a80001', 'base16'))).to.equal('192.168.0.1')
  })

  it('handles ip6 buffers', () => {
    expect(ip6ToString(uint8ArrayFromString('abcd0000000100020003000400050006', 'base16'))).to.equal('abcd::1:2:3:4:5:6')
  })

  it('handles ipv6 strings', () => {
    expect(ip6ToBytes('ABCD::1:2:3:4:5:6')).to.equalBytes(uint8ArrayFromString('ABCD0000000100020003000400050006', 'base16upper'))
  })

  it('handles ip4 strings', () => {
    expect(ip4ToBytes('192.168.0.1')).to.equalBytes(uint8ArrayFromString('c0a80001', 'base16'))
  })

  it('throws on invalid ip4 conversion', () => {
    expect(() => ip4ToBytes('555.168.0.1')).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
  })

  it('throws on invalid ip6 conversion', () => {
    expect(() => ip6ToBytes('FFFF::GGGG')).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
  })

  it('round trips loopback addresses', () => {
    const address = '127.0.0.1'
    const bytes = ip4ToBytes(address)

    expect(ip4ToString(bytes)).to.equal(address)
  })

  it('round trips class C addresses', () => {
    const address = '192.168.1.1'
    const bytes = ip4ToBytes(address)

    expect(ip4ToString(bytes)).to.equal(address)
  })

  /*
  describe('.toBytes', () => {
    it('defaults to hex conversion', () => {
      expect(
        convertToBytes(CODE_WS, 'c0a80001')
      ).to.eql(
        Uint8Array.from([192, 168, 0, 1])
      )
    })
  })
*/
  describe('.toString', () => {
    /*
    it('throws on inconsistent ipfs links', () => {
      const valid = uint8ArrayFromString('03221220d52ebb89d85b02a284948203a62ff28389c57c9f42beec4ec20db76a68911c0b', 'base16')
      expect(
        () => bytesToString(valid.slice(0, valid.length - 8))
      ).to.throw(
        /inconsistent length/
      )
    })

    it('defaults to hex conversion', () => {
      expect(
        convertToString('ws', Uint8Array.from([192, 168, 0, 1]))
      ).to.eql(
        'c0a80001'
      )
    })
*/
    it('respects byteoffset during conversion', () => {
      const bytes = port2bytes('1234')
      const buffer = new Uint8Array(bytes.byteLength + 5)
      buffer.set(bytes, 5)
      expect(bytes2port(buffer.subarray(5))).to.equal('1234')
    })
  })

  it('can round-trip certhash, though encoding base may change', () => {
    const myCertFingerprint = {
      algorithm: 'sha-256',
      value: 'f4:32:a0:45:34:62:85:e0:d8:d7:75:36:84:72:8e:b2:aa:9e:71:64:e4:eb:fe:06:51:64:42:64:fe:04:a8:d0'
    }
    const mb = 'f' + myCertFingerprint.value.replaceAll(':', '')
    const bytes = mb2bytes(mb)
    const outcome = bytes2mb(base64url)(bytes)
    expect(outcome).to.equal('u9DKgRTRiheDY13U2hHKOsqqecWTk6_4GUWRCZP4EqNA')
    const bytesOut = mb2bytes(outcome)
    expect(bytesOut).to.equalBytes(bytes)
  })

  it('convertToIpNet ip4', function () {
    const ipnet = convertToIpNet(multiaddr('/ip4/192.0.2.0/ipcidr/24'))
    expect(ipnet.toString()).equal('192.0.2.0/24')
  })

  it('convertToIpNet ip6', function () {
    const ipnet = convertToIpNet(multiaddr('/ip6/2001:0db8:85a3:0000:0000:8a2e:0370:7334/ipcidr/64'))
    expect(ipnet.toString()).equal('2001:0db8:85a3:0000:0000:0000:0000:0000/64')
  })

  it('convertToIpNet not ipcidr', function () {
    expect(() => convertToIpNet(multiaddr('/ip6/2001:0db8:85a3:0000:0000:8a2e:0370:7334/tcp/64'))).to.throw()
  })

  it('convertToIpNet not ipv6', function () {
    expect(() => convertToIpNet(multiaddr('/dns6/foo.com/ipcidr/64'))).to.throw()
  })
})
