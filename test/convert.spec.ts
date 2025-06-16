/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { convertToIpNet } from '../src/convert.ts'
import { multiaddr } from '../src/index.js'

describe('convert', () => {
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
