/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
import { Multiaddr } from '../src/index.js'
import { expect } from 'aegir/chai'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { codes } from '../src/protocols-table.js'

describe('construction', () => {
  let udpAddr: Multiaddr

  it('create multiaddr', () => {
    udpAddr = new Multiaddr('/ip4/127.0.0.1/udp/1234')
    expect(udpAddr instanceof Multiaddr).to.equal(true)
  })

  it('clone multiaddr', () => {
    const udpAddrClone = new Multiaddr(udpAddr)
    expect(udpAddrClone !== udpAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(new Multiaddr(udpAddr.bytes).bytes === udpAddr.bytes).to.equal(false)
    expect(new Multiaddr(udpAddr.bytes).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with string', () => {
    expect(new Multiaddr(udpAddr.toString()).bytes === udpAddr.bytes).to.equal(false)
    expect(new Multiaddr(udpAddr.toString()).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with object', () => {
    expect(new Multiaddr(udpAddr).bytes === udpAddr.bytes).to.equal(false)
    expect(new Multiaddr(udpAddr).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('reconstruct with JSON', () => {
    expect(new Multiaddr(JSON.parse(JSON.stringify(udpAddr))).bytes === udpAddr.bytes).to.equal(false)
    expect(new Multiaddr(JSON.parse(JSON.stringify(udpAddr))).bytes).to.deep.equal(udpAddr.bytes)
  })

  it('empty construct still works', () => {
    expect(new Multiaddr('').toString()).to.equal('/')
  })

  it('null/undefined construct still works', () => {
    expect(new Multiaddr().toString()).to.equal('/')
    expect(new Multiaddr(null).toString()).to.equal('/')
    expect(new Multiaddr(undefined).toString()).to.equal('/')
  })

  it('throws on truthy non string or buffer', () => {
    const errRegex = /addr must be a string/
    // @ts-expect-error
    expect(() => new Multiaddr({})).to.throw(errRegex)
    // @ts-expect-error
    expect(() => new Multiaddr([])).to.throw(errRegex)
    // @ts-expect-error
    expect(() => new Multiaddr(138)).to.throw(errRegex)
    // @ts-expect-error
    expect(() => new Multiaddr(true)).to.throw(errRegex)
  })

  it('throws on falsy non string or buffer', () => {
    const errRegex = /addr must be a string/
    // @ts-expect-error
    expect(() => new Multiaddr(NaN)).to.throw(errRegex)
    // @ts-expect-error
    expect(() => new Multiaddr(false)).to.throw(errRegex)
    // @ts-expect-error
    expect(() => new Multiaddr(0)).to.throw(errRegex)
  })
})

describe('requiring varint', () => {
  let uTPAddr: Multiaddr

  it('create multiaddr', () => {
    uTPAddr = new Multiaddr('/ip4/127.0.0.1/udp/1234/utp')
    expect(uTPAddr instanceof Multiaddr).to.equal(true)
  })

  it('clone multiaddr', () => {
    const uTPAddrClone = new Multiaddr(uTPAddr)
    expect(uTPAddrClone !== uTPAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(new Multiaddr(uTPAddr.bytes).bytes === uTPAddr.bytes).to.equal(false)
    expect(new Multiaddr(uTPAddr.bytes).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('reconstruct with string', () => {
    expect(new Multiaddr(uTPAddr.toString()).bytes === uTPAddr.bytes).to.equal(false)
    expect(new Multiaddr(uTPAddr.toString()).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('reconstruct with object', () => {
    expect(new Multiaddr(uTPAddr).bytes === uTPAddr.bytes).to.equal(false)
    expect(new Multiaddr(uTPAddr).bytes).to.deep.equal(uTPAddr.bytes)
  })

  it('empty construct still works', () => {
    expect(new Multiaddr('').toString()).to.equal('/')
  })
})

describe('manipulation', () => {
  it('basic', () => {
    const udpAddrStr = '/ip4/127.0.0.1/udp/1234'
    const udpAddrBuf = uint8ArrayFromString('047f000001910204d2', 'base16')
    const udpAddr = new Multiaddr(udpAddrStr)

    expect(udpAddr.toString()).to.equal(udpAddrStr)
    expect(udpAddr.bytes).to.deep.equal(udpAddrBuf)

    expect(udpAddr.protoCodes()).to.deep.equal([4, 273])
    expect(udpAddr.protoNames()).to.deep.equal(['ip4', 'udp'])
    expect(udpAddr.protos()).to.deep.equal([codes[4], codes[273]])
    expect(udpAddr.protos()[0] === codes[4]).to.equal(false)

    const udpAddrbytes2 = udpAddr.encapsulate('/udp/5678')
    expect(udpAddrbytes2.toString()).to.equal('/ip4/127.0.0.1/udp/1234/udp/5678')
    expect(udpAddrbytes2.decapsulate('/udp').toString()).to.equal('/ip4/127.0.0.1/udp/1234')
    expect(udpAddrbytes2.decapsulate('/ip4').toString()).to.equal('/')
    expect(function () { udpAddr.decapsulate('/').toString() }).to.throw()
    expect(new Multiaddr('/').encapsulate(udpAddr).toString()).to.equal(udpAddr.toString())
    expect(new Multiaddr('/').decapsulate('/').toString()).to.equal('/')
  })

  it('ipfs', () => {
    const ipfsAddr = new Multiaddr('/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    const ip6Addr = new Multiaddr('/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095')
    const tcpAddr = new Multiaddr('/tcp/8000')
    const webAddr = new Multiaddr('/ws')

    expect(
      new Multiaddr('/')
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
      new Multiaddr('/')
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
      new Multiaddr('/')
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
  it('ip4', () => {
    const str = '/ip4/127.0.0.1'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp', () => {
    const str = '/ip4/127.0.0.1/tcp/5000'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/5000'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + udp', () => {
    const str = '/ip4/127.0.0.1/udp/5000'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + p2p', () => {
    const str = '/ip4/127.0.0.1/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + ipfs', () => {
    const str = '/ip4/127.0.0.1/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('ip6 + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it.skip('ip4 + dccp', () => {})
  it.skip('ip6 + dccp', () => {})

  it.skip('ip4 + sctp', () => {})
  it.skip('ip6 + sctp', () => {})

  it('ip4 + udp + utp', () => {
    const str = '/ip4/127.0.0.1/udp/5000/utp'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp + utp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000/utp'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.protoNames())
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + http', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/http'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + unix', () => {
    const str = '/ip4/127.0.0.1/tcp/80/unix/a/b/c/d/e/f'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + http', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/http'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + unix', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/unix/a/b/c/d/e/f'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + https', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/https'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + https', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/https'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + websockets', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/ws'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + websockets', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + websockets + ipfs', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('ip6 + tcp + websockets + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp + quic + ipfs', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('ip6 + udp + quic + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('webtransport', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/webtransport'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 webtransport', () => {
    const str = '/ip4/1.2.3.4/udp/4001/quic/webtransport'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('unix', () => {
    const str = '/unix/a/b/c/d/e'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p', () => {
    const str = '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p', () => {
    const str = '/p2p/bafzbeidt255unskpefjmqb2rc27vjuyxopkxgaylxij6pw35hhys4vnyp4'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal('/p2p/QmW8rAgaaA6sRydK1k6vonShQME47aDxaFidbtMevWs73t')
  })

  it('ipfs', () => {
    const str = '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('onion', () => {
    const str = '/onion/timaq4ygg2iegci7:1234'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('onion bad length', () => {
    const str = '/onion/timaq4ygg2iegci:80'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('onion bad port', () => {
    const str = '/onion/timaq4ygg2iegci7:-1'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('onion no port', () => {
    const str = '/onion/timaq4ygg2iegci7'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('onion3', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:1234'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('onion3 bad length', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopyyd:1234'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('onion3 bad port', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:-1'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('onion3 no port', () => {
    const str = '/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd'
    expect(() => new Multiaddr(str)).to.throw()
  })

  it('p2p-circuit', () => {
    const str = '/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-circuit p2p', () => {
    const str = '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-circuit ipfs', () => {
    const str = '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('p2p-webrtc-star', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-webrtc-star ipfs', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str.replace('/ipfs/', '/p2p/'))
  })

  it('p2p-webrtc-direct', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-websocket-star', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })

  it('memory + p2p', () => {
    const str = '/memory/test/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = new Multiaddr(str)
    expect(addr).to.have.property('bytes')
    expect(addr.toString()).to.equal(str)
  })
})

describe('helpers', () => {
  describe('.toOptions', () => {
    it('returns a well formed options object', () => {
      expect(new Multiaddr('/ip4/0.0.0.0/tcp/1234').toOptions())
        .to.eql({
          family: 4,
          host: '0.0.0.0',
          transport: 'tcp',
          port: 1234
        })
    })

    it('returns an options object from a DNS addr', () => {
      expect(new Multiaddr('/dns4/google.net/tcp/8000').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 8000
        })
    })

    it('returns an options object from a DNS6 addr', () => {
      expect(new Multiaddr('/dns6/google.net/tcp/8000').toOptions())
        .to.eql({
          family: 6,
          host: 'google.net',
          transport: 'tcp',
          port: 8000
        })
    })

    it('returns an options object from a DNS addr defaulting to https', () => {
      expect(new Multiaddr('/dnsaddr/google.net').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 443
        })
    })

    it('returns an options object from a DNS addr with a PeerID defaulting to https', () => {
      expect(new Multiaddr('/dnsaddr/google.net/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').toOptions())
        .to.eql({
          family: 4,
          host: 'google.net',
          transport: 'tcp',
          port: 443
        })
    })
  })

  describe('.inspect', () => {
    it('renders the buffer as hex', () => {
      expect(new Multiaddr('/ip4/0.0.0.0/tcp/1234').inspect())
        .to.eql('<Multiaddr 04000000000604d2 - /ip4/0.0.0.0/tcp/1234>')
    })
  })

  describe('.protos', () => {
    it('returns a list of all protocols in the address', () => {
      expect(new Multiaddr('/ip4/0.0.0.0/utp').protos())
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
        new Multiaddr('/ip4/0.0.0.0/utp/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').protos()
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
        new Multiaddr('/ip4/0.0.0.0/utp/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').protos()
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
        new Multiaddr('/ip4/0.0.0.0/tcp/8000/unix/tmp/p2p.sock').protos()
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
        new Multiaddr('/memory/test/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6').protos()
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
      expect(new Multiaddr('/ip4/0.0.0.0/utp').tuples())
        .to.eql([
          [4, Uint8Array.from([0, 0, 0, 0])],
          [302]
        ])
    })
  })

  describe('.stringTuples', () => {
    it('returns the string partss', () => {
      expect(new Multiaddr('/ip4/0.0.0.0/utp').stringTuples())
        .to.eql([
          [4, '0.0.0.0'],
          [302]
        ])
    })
  })

  describe('.decapsulate', () => {
    it('throws on address with no matching subaddress', () => {
      expect(
        () => new Multiaddr('/ip4/127.0.0.1').decapsulate('/ip4/198.168.0.0')
      ).to.throw(
        /does not contain subaddress/
      )
    })
  })

  describe('.decapsulateCode', () => {
    it('removes the last occurrence of the code from the multiaddr', () => {
      const relayTCP = new Multiaddr('/ip4/0.0.0.0/tcp/8080')
      const relay = relayTCP.encapsulate('/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6/p2p-circuit')
      const target = new Multiaddr('/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
      const original = relay.encapsulate(target)
      expect(original.decapsulateCode(421)).to.eql(relay)
      expect(relay.decapsulateCode(421)).to.eql(relayTCP)
    })

    it('ignores missing codes', () => {
      const tcp = new Multiaddr('/ip4/0.0.0.0/tcp/8080')
      expect(tcp.decapsulateCode(421)).to.eql(tcp)
    })
  })

  describe('.equals', () => {
    it('returns true for equal addresses', () => {
      const addr1 = new Multiaddr('/ip4/192.168.0.1')
      const addr2 = new Multiaddr('/ip4/192.168.0.1')

      expect(addr1.equals(addr2)).to.equal(true)
    })

    it('returns false for non equal addresses', () => {
      const addr1 = new Multiaddr('/ip4/192.168.1.1')
      const addr2 = new Multiaddr('/ip4/192.168.0.1')

      expect(addr1.equals(addr2)).to.equal(false)
    })
  })

  describe('.nodeAddress', () => {
    it('throws on an invalid node address', () => {
      expect(
        () => new Multiaddr('/ip4/192.168.0.1/utp').nodeAddress()
      ).to.throw(
        /multiaddr must have a valid format/
      )
    })

    it('returns a node friendly address', () => {
      expect(
        new Multiaddr('/ip4/192.168.0.1/tcp/1234').nodeAddress()
      ).to.be.eql({
        address: '192.168.0.1',
        family: 4,
        port: 1234
      })
    })

    it('returns a node friendly address with dns', () => {
      expect(
        new Multiaddr('/dns/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('returns a node friendly address with dns4', () => {
      expect(
        new Multiaddr('/dns4/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('returns a node friendly address with dns6', () => {
      expect(
        new Multiaddr('/dns6/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 6,
        port: 443
      })
    })

    it('returns a node friendly address with dnsaddr', () => {
      expect(
        new Multiaddr('/dnsaddr/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('should transform a p2p dnsaddr without a tcp port into a node address', () => {
      expect(
        new Multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN').nodeAddress()
      ).to.be.eql({
        address: 'bootstrap.libp2p.io',
        family: 4,
        port: 443
      })
    })

    it('throws on an invalid format address when the addr is not prefixed with a /', () => {
      expect(
        () => new Multiaddr('ip4/192.168.0.1/udp').nodeAddress()
      ).to.throw(
        /must start with a/
      )
    })

    it('throws on an invalid protocol name when the addr has an invalid one', () => {
      expect(
        () => new Multiaddr('/ip5/127.0.0.1/udp/5000')
      ).to.throw(
        /no protocol with name/
      )
    })

    it('throws on an invalid protocol name when the transport protocol is not valid', () => {
      expect(
        () => new Multiaddr('/ip4/127.0.0.1/utp/5000')
      ).to.throw(
        /no protocol with name/
      )
    })
  })

  describe('.fromNodeAddress', () => {
    it('throws on missing address object', () => {
      expect(
        // @ts-expect-error
        () => Multiaddr.fromNodeAddress()
      ).to.throw(
        /requires node address/
      )
    })

    it('throws on missing transport', () => {
      expect(
        // @ts-expect-error
        () => Multiaddr.fromNodeAddress({ address: '0.0.0.0' })
      ).to.throw(
        /requires transport protocol/
      )
    })

    it('parses a node address', () => {
      expect(
        Multiaddr.fromNodeAddress({
          address: '192.168.0.1',
          family: 4,
          port: 1234
        }, 'tcp').toString()
      ).to.be.eql(
        '/ip4/192.168.0.1/tcp/1234'
      )
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
            new Multiaddr(`/${family}/${addresses[family]}/${transport}/1234`).isThinWaistAddress()
          ).to.equal(true)
        })
      })
    })

    it('returns false for two protocols not using {IPv4, IPv6}/{TCP, UDP}', () => {
      expect(
        new Multiaddr('/ip4/192.168.0.1/utp').isThinWaistAddress()
      ).to.equal(false)

      expect(
        new Multiaddr('/sctp/192.168.0.1/tcp/1234').isThinWaistAddress()
      ).to.eql(
        false
      )

      expect(
        new Multiaddr('/http/utp').isThinWaistAddress()
      ).to.eql(
        false
      )
    })

    it('returns false for more than two protocols', () => {
      expect(
        new Multiaddr('/ip4/0.0.0.0/tcp/1234/utp').isThinWaistAddress()
      ).to.equal(
        false
      )
    })
  })

  describe('.getPeerId should parse id from multiaddr', () => {
    it('extracts the peer Id from a multiaddr, p2p', () => {
      expect(
        new Multiaddr('/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('extracts the correct peer Id from a circuit multiaddr', () => {
      expect(
        new Multiaddr('/ip4/0.0.0.0/tcp/8080/p2p/QmZR5a9AAXGqQF2ADqoDdGS8zvqv8n3Pag6TDDnTNMcFW6/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('extracts the peer Id from a multiaddr, ipfs', () => {
      expect(
        new Multiaddr('/p2p-circuit/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('extracts the peer Id from a multiaddr, p2p and CIDv1 Base32', () => {
      expect(
        new Multiaddr('/p2p-circuit/p2p/bafzbeigweq4zr4x4ky2dvv7nanbkw6egutvrrvzw6g3h2rftp7gidyhtt4').getPeerId()
      ).to.equal('QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi')
    })
    it('extracts the peer Id from a multiaddr, p2p and CIDv1 Base32, where Id contains non b58 chars', () => {
      expect(
        new Multiaddr('/p2p-circuit/p2p/bafzbeidt255unskpefjmqb2rc27vjuyxopkxgaylxij6pw35hhys4vnyp4').getPeerId()
      ).to.equal('QmW8rAgaaA6sRydK1k6vonShQME47aDxaFidbtMevWs73t')
    })
    it('extracts the peer Id from a multiaddr, p2p and base58btc encoded identity multihash', () => {
      expect(
        new Multiaddr('/p2p-circuit/p2p/12D3KooWNvSZnPi3RrhrTwEY4LuuBeB6K6facKUCJcyWG1aoDd2p').getPeerId()
      ).to.equal('12D3KooWNvSZnPi3RrhrTwEY4LuuBeB6K6facKUCJcyWG1aoDd2p')
    })
  })

  describe('.getPeerId should return null on missing peer id in multiaddr', () => {
    it('parses extracts the peer Id from a multiaddr', () => {
      expect(
        new Multiaddr('/ip4/0.0.0.0/tcp/1234/utp').getPeerId()
      ).to.be.null()
    })
  })

  describe('.getPath', () => {
    it('should return a path for unix', () => {
      expect(
        new Multiaddr('/unix/tmp/p2p.sock').getPath()
      ).to.eql('/tmp/p2p.sock')
    })

    it('should return a path for unix when other protos exist', () => {
      expect(
        new Multiaddr('/ip4/0.0.0.0/tcp/1234/unix/tmp/p2p.sock').getPath()
      ).to.eql('/tmp/p2p.sock')
    })

    it('should not return a path when no path proto exists', () => {
      expect(
        new Multiaddr('/ip4/0.0.0.0/tcp/1234/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPath()
      ).to.eql(null)
    })
  })

  describe('multiaddr.isMultiaddr', () => {
    it('handles different inputs', () => {
      expect(Multiaddr.isMultiaddr(new Multiaddr('/'))).to.be.eql(true)
      expect(Multiaddr.isMultiaddr('/')).to.be.eql(false)
      expect(Multiaddr.isMultiaddr(123)).to.be.eql(false)

      expect(Multiaddr.isMultiaddr(uint8ArrayFromString('/hello'))).to.be.eql(false)
    })
  })

  describe('resolvable multiaddrs', () => {
    describe('.isName', () => {
      it('valid name dns', () => {
        const str = '/dns/ipfs.io'
        const addr = new Multiaddr(str)
        expect(Multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dnsaddr', () => {
        const str = '/dnsaddr/ipfs.io'
        const addr = new Multiaddr(str)
        expect(Multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dns4', () => {
        const str = '/dns4/ipfs.io'
        const addr = new Multiaddr(str)
        expect(Multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dns6', () => {
        const str = '/dns6/ipfs.io'
        const addr = new Multiaddr(str)
        expect(Multiaddr.isName(addr)).to.equal(true)
      })

      it('invalid name', () => {
        const str = '/ip4/127.0.0.1'
        const addr = new Multiaddr(str)
        expect(Multiaddr.isName(addr)).to.equal(false)
      })
    })
  })
})
