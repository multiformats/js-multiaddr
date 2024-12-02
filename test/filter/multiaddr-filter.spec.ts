/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { MultiaddrFilter, multiaddr, type MultiaddrInput } from '../../src/index.js'

describe('MultiaddrFilter', () => {
  const cases: Array<[MultiaddrInput, MultiaddrInput, boolean]> = [
    ['/ip4/192.168.10.10/ipcidr/24', '/ip4/192.168.10.2/tcp/60', true],
    [multiaddr('/ip4/192.168.10.10/ipcidr/24'), '/ip4/192.168.10.2/tcp/60', true],
    [multiaddr('/ip4/192.168.10.10/ipcidr/24').bytes, '/ip4/192.168.10.2/tcp/60', true],
    ['/ip4/192.168.10.10/ipcidr/24', '/ip4/192.168.10.2/udp/60', true],
    ['/ip4/192.168.10.10/ipcidr/24', multiaddr('/ip4/192.168.11.2/tcp/60'), false],
    ['/ip4/192.168.10.10/ipcidr/24', null, false],
    ['/ip4/192.168.10.10/ipcidr/24', multiaddr('/ip4/192.168.11.2/udp/60').bytes, false],
    ['/ip4/192.168.10.10/ipcidr/24', '/ip4/192.168.11.2/udp/60', false],
    ['/ip4/192.168.10.10/ipcidr/24', '/ip6/2001:db8:3333:4444:5555:6666:7777:8888/tcp/60', false],
    ['/ip6/2001:db8:3333:4444:5555:6666:7777:8888/ipcidr/60', '/ip6/2001:0db8:3333:4440:0000:0000:0000:0000/tcp/60', true],
    ['/ip6/2001:db8:3333:4444:5555:6666:7777:8888/ipcidr/60', '/ip6/2001:0db8:3333:4450:0000:0000:0000:0000/tcp/60', false],
    ['/ip6/2001:db8:3333:4444:5555:6666:7777:8888/ipcidr/128', '/ip6/2001:db8:3333:4444:5555:6666:7777:8888/tcp/60', true],
    ['/ip6/2001:db8:3333:4444:5555:6666:7777:8888/ipcidr/128', '/ip6/2001:db8:3333:4444:5555:6666:7777:8880/tcp/60', false]
  ]

  cases.forEach(([cidr, ip, result]) => {
    it(`multiaddr filter cidr=${cidr} ip=${ip} result=${String(result)}`, function () {
      expect(new MultiaddrFilter(cidr).contains(ip)).to.be.equal(result)
    })
  })
})
