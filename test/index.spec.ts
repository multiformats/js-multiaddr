/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { multiaddr, isMultiaddr, CODE_IP4 } from '../src/index.js'
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

  it('should handle repeated /', () => {
    expect(multiaddr('////////').toString()).to.equal('/')
  })

  it('null/undefined construct still works', () => {
    expect(multiaddr().toString()).to.equal('/')
    expect(multiaddr(null).toString()).to.equal('/')
    expect(multiaddr(undefined).toString()).to.equal('/')
  })

  it('should not mutate multiaddr', () => {
    const str = '/ip4/127.0.0.1/udp/1234'
    udpAddr = multiaddr(str)
    udpAddr.getComponents().pop()
    expect(udpAddr.toString()).to.equal(str)
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

    expect(udpAddr.getComponents()).to.deep.equal([{
      bytes: Uint8Array.from([4, 127, 0, 0, 1]),
      code: 4,
      name: 'ip4',
      value: '127.0.0.1'
    }, {
      bytes: Uint8Array.from([145, 2, 4, 210]),
      code: 273,
      name: 'udp',
      value: '1234'
    }])

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
    'ip6 empty': {
      input: '/ip6/::00:0:000:0:001',
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
    'ip6 with multiple repeated empty blocks': {
      input: '/ip6/0:00:0000:0002:0000:059c:0a24:0801/tcp/64142',
      output: '/ip6/::2:0:59c:a24:801/tcp/64142'
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

describe('.getComponents', () => {
  it('returns a list of all protocols in the address', () => {
    expect(multiaddr('/ip4/0.0.0.0/utp').getComponents())
      .to.eql([{
        code: 4,
        name: 'ip4',
        value: '0.0.0.0'
      }, {
        code: 302,
        name: 'utp'
      }])
  })

  it('works with ipfs', () => {
    expect(
      multiaddr('/ip4/0.0.0.0/utp/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getComponents()
    ).to.deep.equal([{
      code: 4,
      name: 'ip4',
      value: '0.0.0.0'
    }, {
      code: 302,
      name: 'utp'
    }, {
      code: 421,
      name: 'p2p',
      value: 'QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    }])
  })

  it('works with p2p', () => {
    expect(
      multiaddr('/ip4/0.0.0.0/utp/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getComponents()
    ).to.deep.equal([{
      code: 4,
      name: 'ip4',
      value: '0.0.0.0'
    }, {
      code: 302,
      name: 'utp'
    }, {
      code: 421,
      name: 'p2p',
      value: 'QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    }])
  })

  it('works with unix', () => {
    expect(
      multiaddr('/ip4/0.0.0.0/tcp/8000/unix/tmp%2Fp2p.sock').getComponents()
    ).to.deep.equal([{
      code: 4,
      name: 'ip4',
      value: '0.0.0.0'
    }, {
      code: 6,
      name: 'tcp',
      value: '8000'
    }, {
      code: 400,
      name: 'unix',
      value: 'tmp/p2p.sock'
    }])
  })

  it('works with memory', () => {
    expect(
      multiaddr('/memory/test/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6').getComponents()
    ).to.deep.equal([{
      code: 777,
      name: 'memory',
      value: 'test'
    }, {
      code: 421,
      name: 'p2p',
      value: 'QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6'
    }])
  })

  it('does not allow modifying parts', () => {
    const ma = multiaddr('/ip4/0.0.0.0/tcp/1234')
    const components = ma.getComponents()
    components.shift()

    expect(ma.getComponents()).to.have.nested.property('[0].code', CODE_IP4)
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

describe('multiaddr.isMultiaddr', () => {
  it('handles different inputs', () => {
    expect(isMultiaddr(multiaddr('/'))).to.deep.equal(true)
    expect(isMultiaddr(multiaddr('/ip4/192.0.2.0/ipcidr/24'))).to.deep.equal(true)
    expect(isMultiaddr('/')).to.deep.equal(false)
    expect(isMultiaddr(123)).to.deep.equal(false)

    expect(isMultiaddr(uint8ArrayFromString('/hello'))).to.deep.equal(false)
  })
})

describe('unknown protocols', () => {
  it('throws an error', () => {
    const str = '/ip4/127.0.0.1/unknown'
    expect(() => multiaddr(str)).to.throw()
      .with.property('name', 'UnknownProtocolError')
  })
})
