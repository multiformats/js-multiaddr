/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { multiaddr, isMultiaddr, fromNodeAddress, isName, fromTuples, fromStringTuples } from '../src/index.js'
import { codes } from '../src/protocols-table.js'
import type { Multiaddr } from '../src/index.js'

function roundTrip (str: string): void {
  const output = str.replace('/ipfs/', '/p2p/')

  const ma = multiaddr(str)
  expect(ma.toString()).to.equal(output)

  const bytes = multiaddr(ma.bytes)
  expect(bytes.toString()).to.equal(output)

  const components = multiaddr(ma.getComponents())
  expect(components.toString()).to.equal(output)
}

describe('construction', () => {
  let udpAddr: Multiaddr

  it('create multiaddr', () => {
    udpAddr = multiaddr('/ip4/127.0.0.1/udp/1234')
    expect(isMultiaddr(udpAddr)).to.equal(true)
  })

  it('clone multiaddr', () => {
    const udpAddrClone = multiaddr(udpAddr)
    expect(udpAddrClone !== udpAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(multiaddr(udpAddr.bytes).bytes === udpAddr.bytes).to.equal(false)
    expect(multiaddr(udpAddr.bytes).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with string', () => {
    expect(multiaddr(udpAddr.toString()).bytes === udpAddr.bytes).to.equal(false)
    expect(multiaddr(udpAddr.toString()).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with object', () => {
    expect(multiaddr(udpAddr).bytes === udpAddr.bytes).to.equal(false)
    expect(multiaddr(udpAddr).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with JSON', () => {
    expect(multiaddr(JSON.parse(JSON.stringify(udpAddr))).bytes === udpAddr.bytes).to.equal(false)
    expect(multiaddr(JSON.parse(JSON.stringify(udpAddr))).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('empty construct still works', () => {
    expect(multiaddr('').toString()).to.equal('/')
  })

  it('null/undefined construct still works', () => {
    expect(multiaddr().toString()).to.equal('/')
    expect(multiaddr(null).toString()).to.equal('/')
    expect(multiaddr(undefined).toString()).to.equal('/')
  })

  it('throws on truthy non string or buffer', () => {
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr({})).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr(138)).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr(true)).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
  })

  it('throws on falsy non string or buffer', () => {
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr(NaN)).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr(false)).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
    // @ts-expect-error incorrect parameters
    expect(() => multiaddr(0)).to.throw()
      .with.property('name', 'InvalidMultiaddrError')
  })
})

describe('requiring varint', () => {
  let uTPAddr: Multiaddr

  it('create multiaddr', () => {
    uTPAddr = multiaddr('/ip4/127.0.0.1/udp/1234/utp')
    expect(isMultiaddr(uTPAddr)).to.equal(true)
  })

  it('clone multiaddr', () => {
    const uTPAddrClone = multiaddr(uTPAddr)
    expect(uTPAddrClone !== uTPAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(multiaddr(uTPAddr.bytes).bytes === uTPAddr.bytes).to.equal(false)
    expect(multiaddr(uTPAddr.bytes).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('reconstruct with string', () => {
    expect(multiaddr(uTPAddr.toString()).bytes === uTPAddr.bytes).to.equal(false)
    expect(multiaddr(uTPAddr.toString()).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('reconstruct with object', () => {
    expect(multiaddr(uTPAddr).bytes === uTPAddr.bytes).to.equal(false)
    expect(multiaddr(uTPAddr).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('empty construct still works', () => {
    expect(multiaddr('').toString()).to.equal('/')
  })
})

describe('manipulation', () => {
  it('basic', () => {
    const udpAddrStr = '/ip4/127.0.0.1/udp/1234'
    const udpAddrBuf = uint8ArrayFromString('047f000001910204d2', 'base16')
    const udpAddr = multiaddr(udpAddrStr)

    expect(udpAddr.toString()).to.equal(udpAddrStr)
    expect(udpAddr.bytes).to.equalBytes(udpAddrBuf)

    expect(udpAddr.protoCodes()).to.deep.equal([4, 273])
    expect(udpAddr.protoNames()).to.deep.equal(['ip4', 'udp'])
    expect(udpAddr.protos()).to.deep.equal([codes[4], codes[273]])
    expect(udpAddr.protos()[0] === codes[4]).to.equal(false)

    const udpAddrbytes2 = udpAddr.encapsulate('/udp/5678')
    expect(udpAddrbytes2.toString()).to.equal('/ip4/127.0.0.1/udp/1234/udp/5678')
    expect(udpAddrbytes2.decapsulate('/udp').toString()).to.equal('/ip4/127.0.0.1/udp/1234')
    expect(udpAddrbytes2.decapsulate('/ip4').toString()).to.equal('/')
    expect(function () { udpAddr.decapsulate('/').toString() }).to.throw()
    expect(multiaddr('/').encapsulate(udpAddr).toString()).to.equal(udpAddr.toString())
    expect(multiaddr('/').decapsulate('/').toString()).to.equal('/')
  })

  it('ipfs', () => {
    const ipfsAddr = multiaddr('/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    const ip6Addr = multiaddr('/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095')
    const tcpAddr = multiaddr('/tcp/8000')
    const webAddr = multiaddr('/ws')

    expect(
      multiaddr('/')
        .encapsulate(ip6Addr)
        .encapsulate(tcpAddr)
        .encapsulate(webAddr)
        .encapsulate(ipfsAddr)
        .toString()
    ).to.equal([
      ip6Addr.toString(),
      tcpAddr.toString(),
      webAddr.toString(),
      ipfsAddr.toString()
    ].join(''))

    expect(
      multiaddr('/')
        .encapsulate(ip6Addr)
        .encapsulate(tcpAddr)
        .encapsulate(webAddr)
        .encapsulate(ipfsAddr)
        .decapsulate(ipfsAddr)
        .toString()
    ).to.equal([
      ip6Addr.toString(),
      tcpAddr.toString(),
      webAddr.toString()
    ].join(''))

    expect(
      multiaddr('/')
        .encapsulate(ip6Addr)
        .encapsulate(tcpAddr)
        .encapsulate(ipfsAddr)
        .encapsulate(webAddr)
        .decapsulate(webAddr)
        .toString()
    ).to.equal([
      ip6Addr.toString(),
      tcpAddr.toString(),
      ipfsAddr.toString()
    ].join(''))
  })
})

describe('variants', () => {
  const variants = {
    ip4: '/ip4/127.0.0.1',
    ip6: '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095',
    'ip4 + tcp': '/ip4/127.0.0.1/tcp/5000',
    'ip6 + tcp': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/5000',
    'ip4 + udp': '/ip4/127.0.0.1/udp/5000',
    'ip6 + udp': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000',
    'ip4 + p2p': '/ip4/127.0.0.1/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234',
    'ip4 + ipfs': '/ip4/127.0.0.1/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234',
    'ip6 + p2p': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234',
    'ip6zone + ip6': '/ip6zone/x/ip6/fe80::1',
    'ip4 + udp + utp': '/ip4/127.0.0.1/udp/5000/utp',
    'ip6 + udp + utp': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000/utp',
    'ip4 + tcp + http': '/ip4/127.0.0.1/tcp/8000/http',
    'ip4 + tcp + unix': '/ip4/127.0.0.1/tcp/80/unix/a%2Fb%2Fc%2Fd%2Fe%2Ff',
    'ip6 + tcp + http': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/http',
    'ip6 + tcp + unix': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/unix/a%2Fb%2Fc%2Fd%2Fe%2Ff',
    'ip4 + tcp + https': '/ip4/127.0.0.1/tcp/8000/https',
    'ip6 + tcp + https': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/https',
    'ip4 + tcp + websockets': '/ip4/127.0.0.1/tcp/8000/ws',
    'ip6 + tcp + websockets': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws',
    'ip6 + tcp + websockets + ipfs': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 + tcp + websockets + p2p': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 + udp + quic + ipfs': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 + udp + quic + p2p': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 + udp + quic-v1 + ipfs': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic-v1/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 + udp + quic-v1 + p2p': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic-v1/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'ip6 webtransport': '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic-v1/webtransport',
    'ip4 webtransport': '/ip4/1.2.3.4/udp/4001/quic-v1/webtransport',
    'webtransport with certhash': '/ip4/1.2.3.4/udp/4001/quic-v1/webtransport/certhash/uEiAkH5a4DPGKUuOBjYw0CgwjvcJCJMD2K_1aluKR_tpevQ/certhash/uEiAfbgiymPP2_nX7Dgir8B4QkksjHp2lVuJZz0F79Be9JA/p2p/12D3KooWBdmLJjhpgJ9KZgLM3f894ff9xyBfPvPjFNn7MKJpyrC2',
    'ip6zone + ip6 + udp + quic': '/ip6zone/x/ip6/fe80::1/udp/1234/quic',
    unix: '/unix/a%2Fb%2Fc%2Fd%2Fe',
    'p2p (base58btc)': '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    ipfs: '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    tls: '/ip4/127.0.0.1/tcp/9090/tls/ws',
    sni: '/ip4/127.0.0.1/tcp/9090/tls/sni/example.com/ws',
    'http-path': '/ip4/127.0.0.1/tcp/9090/tls/http-path/tmp%2Ffoo%2F..%2Fbar',
    onion: '/onion/timaq4ygg2iegci7:1234',
    onion3: '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:1234',
    'p2p-circuit': '/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'p2p p2p-circuit': '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit',
    'ipfs p2p-circuit': '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit',
    'p2p-webrtc-star': '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'p2p-webrtc-star ipfs': '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC',
    'p2p-webrtc-direct': '/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct',
    'p2p-websocket-star': '/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star',
    'memory p2p': '/memory/test/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
  }

  for (const [name, value] of Object.entries(variants)) {
    it(`should round trip ${name}`, () => {
      roundTrip(value)
    })
  }

  it.skip('onion bad length', () => {
    const str = '/onion/timaq4ygg2iegci:80'
    expect(() => multiaddr(str)).to.throw()
  })

  it.skip('onion bad port', () => {
    const str = '/onion/timaq4ygg2iegci7:-1'
    expect(() => multiaddr(str)).to.throw()
  })

  it.skip('onion no port', () => {
    const str = '/onion/timaq4ygg2iegci7'
    expect(() => multiaddr(str)).to.throw()
  })

  it.skip('onion3 bad length', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopyyd:1234'
    expect(() => multiaddr(str)).to.throw()
  })

  it.skip('onion3 bad port', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:-1'
    expect(() => multiaddr(str)).to.throw()
  })

  it.skip('onion3 no port', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd'
    expect(() => multiaddr(str)).to.throw()
  })
})

describe('normalize', () => {
  const variants = {
    'ip6 with zeroes': {
      input: '/ip6/0001:08a0:00c5:4201:3ac9:86ff:fe31:0709',
      output: '/ip6/1:8a0:c5:4201:3ac9:86ff:fe31:709'
    },
    'ip6 loopback': {
      input: '/ip6/0000:0000:0000:0000:0000:0000:0000:0001',
      output: '/ip6/::1'
    },
    'ip6 with ip4': {
      input: '/ip6/::101.45.75.219/tcp/9090',
      output: '/ip6/::652d:4bdb/tcp/9090'
    },
    'ip6 with ip4 without padding': {
      input: '/ip6/::1.45.5.219/tcp/9090',
      output: '/ip6/::12d:5db/tcp/9090'
    },
    'ipfs to p2p': {
      input: '/ipfs/bafzbeidt255unskpefjmqb2rc27vjuyxopkxgaylxij6pw35hhys4vnyp4',
      output: '/p2p/bafzbeidt255unskpefjmqb2rc27vjuyxopkxgaylxij6pw35hhys4vnyp4'
    }
  }

  for (const [name, value] of Object.entries(variants)) {
    it(`should normalize ${name}`, () => {
      const ma = multiaddr(value.input)
      expect(ma.toString()).to.equal(value.output)
    })
  }
})

describe('helpers', () => {
  describe('.toOptions', () => {
    it('returns a well formed options object', () => {
      expect(multiaddr('/ip4/0.0.0.0/tcp/1234').toOptions())
        .to.eql({
          family: 4,
          host: '0.0.0.0',
          transport: 'tcp',
          port: 1234
        })
    })

    it('returns an options object from a DNS addr', () => {
      expect(multiaddr('/dns4/google.net/tcp/8000').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 8000
        })
    })

    it('returns an options object from a DNS6 addr', () => {
      expect(multiaddr('/dns6/google.net/tcp/8000').toOptions())
        .to.eql({
          family: 6,
          host: 'google.net',
          transport: 'tcp',
          port: 8000
        })
    })

    it('returns an options object from a DNS addr defaulting to https', () => {
      expect(multiaddr('/dnsaddr/google.net').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 443
        })
    })

    it('returns an options object from a DNS addr with a PeerID defaulting to https', () => {
      expect(multiaddr('/dnsaddr/google.net/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 443
        })
    })

    it('returns an options object from an address with an ip6 zone', () => {
      expect(
        multiaddr('/ip6zone/x/ip6/fe80::1/tcp/1234').toOptions()
      ).to.be.eql({
        family: 6,
        host: 'fe80::1%x',
        transport: 'tcp',
        port: 1234
      })
    })
  })

  describe('.protos', () => {
    it('returns a list of all protocols in the address', () => {
      expect(multiaddr('/ip4/0.0.0.0/utp').protos())
        .to.eql([{
          code: 4,
          name: 'ip4',
          path: false,
          size: 32,
          resolvable: false
        }, {
          code: 302,
          name: 'utp',
          path: false,
          size: 0,
          resolvable: false
        }])
    })

    it('works with ipfs', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').protos()
      ).to.be.eql([{
        code: 4,
        name: 'ip4',
        path: false,
        size: 32,
        resolvable: false
      }, {
        code: 302,
        name: 'utp',
        path: false,
        size: 0,
        resolvable: false
      }, {
        code: 421,
        name: 'p2p',
        path: false,
        size: -1,
        resolvable: false
      }])
    })

    it('works with p2p', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').protos()
      ).to.be.eql([{
        code: 4,
        name: 'ip4',
        path: false,
        size: 32,
        resolvable: false
      }, {
        code: 302,
        name: 'utp',
        path: false,
        size: 0,
        resolvable: false
      }, {
        code: 421,
        name: 'p2p',
        path: false,
        size: -1,
        resolvable: false
      }])
    })

    it('works with unix', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/8000/unix/tmp%2Fp2p.sock').protos()
      ).to.be.eql([{
        code: 4,
        name: 'ip4',
        path: false,
        size: 32,
        resolvable: false
      }, {
        code: 6,
        name: 'tcp',
        path: false,
        size: 16,
        resolvable: false
      }, {
        code: 400,
        name: 'unix',
        path: true,
        size: -1,
        resolvable: false
      }])
    })

    it('works with memory', () => {
      expect(
        multiaddr('/memory/test/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6').protos()
      ).to.be.eql([{
        code: 777,
        name: 'memory',
        path: false,
        size: -1,
        resolvable: false
      }, {
        code: 421,
        name: 'p2p',
        path: false,
        size: -1,
        resolvable: false
      }])
    })
  })

  describe('.tuples', () => {
    it('returns the tuples', () => {
      expect(multiaddr('/ip4/0.0.0.0/utp').tuples())
        .to.eql([
          [4, Uint8Array.from([0, 0, 0, 0])],
          [302]
        ])
    })

    it('does not allow modifying parts', () => {
      const ma = multiaddr('/ip4/0.0.0.0/tcp/1234')
      const tuples = ma.tuples()
      tuples[0][0] = 41

      expect(ma.toOptions()).to.have.property('family', 4)
    })
  })

  describe('.stringTuples', () => {
    it('returns the string partss', () => {
      expect(multiaddr('/ip4/0.0.0.0/utp').stringTuples())
        .to.eql([
          [4, '0.0.0.0'],
          [302]
        ])
    })

    it('does not allow modifying string parts', () => {
      const ma = multiaddr('/ip4/0.0.0.0/tcp/1234')
      const tuples = ma.stringTuples()
      tuples[0][0] = 41

      expect(ma.toOptions()).to.have.property('family', 4)
    })
  })

  describe('.decapsulate', () => {
    it('throws on address with no matching subaddress', () => {
      expect(
        () => multiaddr('/ip4/127.0.0.1').decapsulate('/ip4/198.168.0.0')
      ).to.throw(
        /does not contain subaddress/
      )
    })
  })

  describe('.decapsulateCode', () => {
    it('removes the last occurrence of the code from the multiaddr', () => {
      const relayTCP = multiaddr('/ip4/0.0.0.0/tcp/8080')
      const relay = relayTCP.encapsulate('/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6/p2p-circuit')
      const target = multiaddr('/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
      const original = relay.encapsulate(target)
      expect(original.decapsulateCode(421).toJSON()).to.equal(relay.toJSON())
      expect(relay.decapsulateCode(421).toJSON()).to.equal(relayTCP.toJSON())
    })

    it('ignores missing codes', () => {
      const tcp = multiaddr('/ip4/0.0.0.0/tcp/8080')
      expect(tcp.decapsulateCode(421).toJSON()).to.equal(tcp.toJSON())
    })
  })

  describe('.equals', () => {
    it('returns true for equal addresses', () => {
      const addr1 = multiaddr('/ip4/192.168.0.1')
      const addr2 = multiaddr('/ip4/192.168.0.1')

      expect(addr1.equals(addr2)).to.equal(true)
    })

    it('returns false for non equal addresses', () => {
      const addr1 = multiaddr('/ip4/192.168.1.1')
      const addr2 = multiaddr('/ip4/192.168.0.1')

      expect(addr1.equals(addr2)).to.equal(false)
    })
  })

  describe('.nodeAddress', () => {
    it('throws on an invalid node address', () => {
      expect(
        () => multiaddr('/ip4/192.168.0.1/utp').nodeAddress()
      ).to.throw(
        /multiaddr must have a valid format/
      )
    })

    it('returns a node friendly address', () => {
      expect(
        multiaddr('/ip4/192.168.0.1/tcp/1234').nodeAddress()
      ).to.be.eql({
        address: '192.168.0.1',
        family: 4,
        port: 1234
      })
    })

    it('returns a node friendly address with dns', () => {
      expect(
        multiaddr('/dns/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('returns a node friendly address with dns4', () => {
      expect(
        multiaddr('/dns4/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('returns a node friendly address with dns6', () => {
      expect(
        multiaddr('/dns6/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 6,
        port: 443
      })
    })

    it('returns a node friendly address with dnsaddr', () => {
      expect(
        multiaddr('/dnsaddr/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('should transform a p2p dnsaddr without a tcp port into a node address', () => {
      expect(
        multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN').nodeAddress()
      ).to.be.eql({
        address: 'bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('transforms an address with an ip6 zone', () => {
      expect(
        multiaddr('/ip6zone/x/ip6/fe80::1/tcp/1234').nodeAddress()
      ).to.be.eql({
        address: 'fe80::1%x',
        family: 6,
        port: 1234
      })
    })

    it('throws on an invalid format address when the addr is not prefixed with a /', () => {
      expect(
        () => multiaddr('ip4/192.168.0.1/udp').nodeAddress()
      ).to.throw()
        .with.property('name', 'InvalidMultiaddrError')
    })

    it('throws on an invalid protocol name when the addr has an invalid one', () => {
      expect(
        () => multiaddr('/ip5/127.0.0.1/udp/5000')
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })

    it('throws on an invalid protocol name when the transport protocol is not valid', () => {
      expect(
        () => multiaddr('/ip4/127.0.0.1/utp/5000')
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })
  })

  describe('.fromNodeAddress', () => {
    it('throws on missing address object', () => {
      expect(
        // @ts-expect-error incorrect parameters
        () => fromNodeAddress()
      ).to.throw()
        .with.property('name', 'InvalidParametersError')
    })

    it('throws on missing transport', () => {
      expect(
        // @ts-expect-error incorrect parameters
        () => fromNodeAddress({ address: '0.0.0.0' })
      ).to.throw()
        .with.property('name', 'InvalidParametersError')
    })

    it('parses a node address', () => {
      expect(
        fromNodeAddress({
          address: '192.168.0.1',
          family: 4,
          port: 1234
        }, 'tcp').toString()
      ).to.equal('/ip4/192.168.0.1/tcp/1234')
    })

    it('parses a node address with an ip6zone', () => {
      expect(
        fromNodeAddress({
          address: 'fe80::1%x',
          family: 6,
          port: 1234
        }, 'tcp').toString()
      ).to.equal('/ip6zone/x/ip6/fe80::1/tcp/1234')
    })
  })

  describe('.fromTuples', () => {
    it('should create a multiaddr from a list of tuples', () => {
      const ma = multiaddr('/ip4/0.0.0.0')
      const tuples = ma.tuples()
      tuples.push([0x06, Uint8Array.from([0, 100])])

      const ma2 = fromTuples(tuples)
      expect(ma2.toString()).to.equal('/ip4/0.0.0.0/tcp/100')
    })
  })

  describe('.fromStringTuples', () => {
    it('should create a multiaddr from a list of string tuples', () => {
      const ma = multiaddr('/ip4/0.0.0.0')
      const tuples = ma.stringTuples()
      tuples.push([0x06, '100'])

      const ma2 = fromStringTuples(tuples)
      expect(ma2.toString()).to.equal('/ip4/0.0.0.0/tcp/100')
    })
  })

  describe('.isThinWaistAddress', () => {
    const families = ['ip4', 'ip6']
    const transports = ['tcp', 'udp']
    const addresses: Record<string, string> = {
      ip4: '192.168.0.1',
      ip6: '2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095'
    }
    families.forEach((family) => {
      transports.forEach((transport) => {
        it(`returns true for /${family}-${transport}`, () => {
          expect(
            multiaddr(`/${family}/${addresses[family]}/${transport}/1234`).isThinWaistAddress()
          ).to.equal(true)
        })
      })
    })

    it('returns false for two protocols not using {IPv4, IPv6}/{TCP, UDP}', () => {
      expect(
        multiaddr('/ip4/192.168.0.1/utp').isThinWaistAddress()
      ).to.be.false()

      expect(
        multiaddr('/ip4/192.168.0.1/sctp/1234').isThinWaistAddress()
      ).to.be.false()

      expect(
        multiaddr('/http/utp').isThinWaistAddress()
      ).to.be.false()
    })

    it('returns false for more than two protocols', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/utp').isThinWaistAddress()
      ).to.be.false()
    })
  })

  describe('.getPeerId should parse id from multiaddr', () => {
    it('extracts the peer Id from a multiaddr, p2p', () => {
      expect(
        multiaddr('/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('extracts the correct peer Id from a circuit multiaddr', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/8080/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('extracts the peer Id from a multiaddr, p2p and CIDv1 Base32', () => {
      expect(
        multiaddr('/p2p-circuit/p2p/bafzbeigweq4zr4x4ky2dvv7nanbkw6egutvrrvzw6g3h2rftp7gidyhtt4').getPeerId()
      ).to.equal('QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi')
    })
    it('extracts the peer Id from a multiaddr, p2p and CIDv1 Base32, where Id contains non b58 chars', () => {
      expect(
        multiaddr('/p2p-circuit/p2p/bafzbeidt255unskpefjmqb2rc27vjuyxopkxgaylxij6pw35hhys4vnyp4').getPeerId()
      ).to.equal('QmW8rAgaaA6sRydK1k6vonShQME47aDxaFidbtMevWs73t')
    })
    it('extracts the peer Id from a multiaddr, p2p and base58btc encoded identity multihash', () => {
      expect(
        multiaddr('/p2p-circuit/p2p/12D3KooWNvSZnPi3RrhrTwEY4LuuBeB6K6facKUCJcyWG1aoDd2p').getPeerId()
      ).to.equal('12D3KooWNvSZnPi3RrhrTwEY4LuuBeB6K6facKUCJcyWG1aoDd2p')
    })
    it('does not extract a peer Id from a circuit relay multiaddr where only the relay peer id is present', () => {
      expect(
        multiaddr('/ip4/127.0.0.1/tcp/123/p2p/bafzbeigweq4zr4x4ky2dvv7nanbkw6egutvrrvzw6g3h2rftp7gidyhtt4/p2p-circuit').getPeerId()
      ).to.be.null()
    })
  })

  describe('.getPeerId should return null on missing peer id in multiaddr', () => {
    it('parses extracts the peer Id from a multiaddr', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/utp').getPeerId()
      ).to.be.null()
    })
  })

  describe('.getPath', () => {
    it('should return a path for unix', () => {
      expect(
        multiaddr('/unix/tmp%2Fp2p.sock').getPath()
      ).to.eql('/tmp/p2p.sock')
    })

    it('should return a path for unix when other protos exist', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/unix/tmp%2Fp2p.sock').getPath()
      ).to.eql('/tmp/p2p.sock')
    })

    it('should not return a path when no path proto exists', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPath()
      ).to.eql(null)
    })
  })

  describe('multiaddr.isMultiaddr', () => {
    it('handles different inputs', () => {
      expect(isMultiaddr(multiaddr('/'))).to.be.eql(true)
      expect(isMultiaddr(multiaddr('/ip4/192.0.2.0/ipcidr/24'))).to.be.eql(true)
      expect(isMultiaddr('/')).to.be.eql(false)
      expect(isMultiaddr(123)).to.be.eql(false)

      expect(isMultiaddr(uint8ArrayFromString('/hello'))).to.be.eql(false)
    })
  })

  describe('resolvable multiaddrs', () => {
    describe('.isName', () => {
      it('valid name dns', () => {
        const str = '/dns/ipfs.io'
        const addr = multiaddr(str)
        expect(isName(addr)).to.equal(true)
      })

      it('valid name dnsaddr', () => {
        const str = '/dnsaddr/ipfs.io'
        const addr = multiaddr(str)
        expect(isName(addr)).to.equal(true)
      })

      it('valid name dns4', () => {
        const str = '/dns4/ipfs.io'
        const addr = multiaddr(str)
        expect(isName(addr)).to.equal(true)
      })

      it('valid name dns6', () => {
        const str = '/dns6/ipfs.io'
        const addr = multiaddr(str)
        expect(isName(addr)).to.equal(true)
      })

      it('invalid name', () => {
        const str = '/ip4/127.0.0.1'
        const addr = multiaddr(str)
        expect(isName(addr)).to.equal(false)
      })
    })
  })
})

describe('unknown protocols', () => {
  it('throws an error', () => {
    const str = '/ip4/127.0.0.1/unknown'
    expect(() => multiaddr(str)).to.throw()
      .with.property('name', 'InvalidProtocolError')
  })
})
