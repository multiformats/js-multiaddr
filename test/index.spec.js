/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const multiaddr = require('../src')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect

describe('construction', () => {
  let udpAddr

  it('create multiaddr', () => {
    udpAddr = multiaddr('/ip4/127.0.0.1/udp/1234')
    expect(udpAddr instanceof multiaddr).to.equal(true)
  })

  it('clone multiaddr', () => {
    const udpAddrClone = multiaddr(udpAddr)
    expect(udpAddrClone !== udpAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(multiaddr(udpAddr.buffer).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr.buffer).buffer).to.deep.equal(udpAddr.buffer)
  })

  it('reconstruct with string', () => {
    expect(multiaddr(udpAddr.toString()).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr.toString()).buffer).to.deep.equal(udpAddr.buffer)
  })

  it('reconstruct with object', () => {
    expect(multiaddr(udpAddr).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr).buffer).to.deep.equal(udpAddr.buffer)
  })

  it('reconstruct with JSON', () => {
    expect(multiaddr(JSON.parse(JSON.stringify(udpAddr))).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(JSON.parse(JSON.stringify(udpAddr))).buffer).to.deep.equal(udpAddr.buffer)
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
    const errRegex = /addr must be a string/
    expect(() => multiaddr({})).to.throw(errRegex)
    expect(() => multiaddr([])).to.throw(errRegex)
    expect(() => multiaddr(138)).to.throw(errRegex)
    expect(() => multiaddr(true)).to.throw(errRegex)
  })

  it('throws on falsy non string or buffer', () => {
    const errRegex = /addr must be a string/
    expect(() => multiaddr(NaN)).to.throw(errRegex)
    expect(() => multiaddr(false)).to.throw(errRegex)
    expect(() => multiaddr(0)).to.throw(errRegex)
  })
})

describe('requiring varint', () => {
  let uTPAddr

  it('create multiaddr', () => {
    uTPAddr = multiaddr('/ip4/127.0.0.1/udp/1234/utp')
    expect(uTPAddr instanceof multiaddr).to.equal(true)
  })

  it('clone multiaddr', () => {
    const uTPAddrClone = multiaddr(uTPAddr)
    expect(uTPAddrClone !== uTPAddr).to.equal(true)
  })

  it('reconstruct with buffer', () => {
    expect(multiaddr(uTPAddr.buffer).buffer === uTPAddr.buffer).to.equal(false)
    expect(multiaddr(uTPAddr.buffer).buffer).to.deep.equal(uTPAddr.buffer)
  })

  it('reconstruct with string', () => {
    expect(multiaddr(uTPAddr.toString()).buffer === uTPAddr.buffer).to.equal(false)
    expect(multiaddr(uTPAddr.toString()).buffer).to.deep.equal(uTPAddr.buffer)
  })

  it('reconstruct with object', () => {
    expect(multiaddr(uTPAddr).buffer === uTPAddr.buffer).to.equal(false)
    expect(multiaddr(uTPAddr).buffer).to.deep.equal(uTPAddr.buffer)
  })

  it('empty construct still works', () => {
    expect(multiaddr('').toString()).to.equal('/')
  })
})

describe('manipulation', () => {
  it('basic', () => {
    const udpAddrStr = '/ip4/127.0.0.1/udp/1234'
    const udpAddrBuf = Buffer.from('047f000001910204d2', 'hex')
    const udpAddr = multiaddr(udpAddrStr)

    expect(udpAddr.toString()).to.equal(udpAddrStr)
    expect(udpAddr.buffer).to.deep.equal(udpAddrBuf)

    expect(udpAddr.protoCodes()).to.deep.equal([4, 273])
    expect(udpAddr.protoNames()).to.deep.equal(['ip4', 'udp'])
    expect(udpAddr.protos()).to.deep.equal([multiaddr.protocols.codes[4], multiaddr.protocols.codes[273]])
    expect(udpAddr.protos()[0] === multiaddr.protocols.codes[4]).to.equal(false)

    const udpAddrBuf2 = udpAddr.encapsulate('/udp/5678')
    expect(udpAddrBuf2.toString()).to.equal('/ip4/127.0.0.1/udp/1234/udp/5678')
    expect(udpAddrBuf2.decapsulate('/udp').toString()).to.equal('/ip4/127.0.0.1/udp/1234')
    expect(udpAddrBuf2.decapsulate('/ip4').toString()).to.equal('/')
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
  it('ip4', () => {
    const str = '/ip4/127.0.0.1'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp', () => {
    const str = '/ip4/127.0.0.1/tcp/5000'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/5000'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + udp', () => {
    const str = '/ip4/127.0.0.1/udp/5000'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + p2p', () => {
    const str = '/ip4/127.0.0.1/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('ip4 + ipfs', () => {
    const str = '/ip4/127.0.0.1/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it.skip('ip4 + dccp', () => {})
  it.skip('ip6 + dccp', () => {})

  it.skip('ip4 + sctp', () => {})
  it.skip('ip6 + sctp', () => {})

  it('ip4 + udp + utp', () => {
    const str = '/ip4/127.0.0.1/udp/5000/utp'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp + utp', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/5000/utp'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.protoNames())
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + http', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/http'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + unix', () => {
    const str = '/ip4/127.0.0.1/tcp/80/unix/a/b/c/d/e/f'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + http', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/http'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + unix', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/unix/a/b/c/d/e/f'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + https', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/https'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + https', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/https'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip4 + tcp + websockets', () => {
    const str = '/ip4/127.0.0.1/tcp/8000/ws'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + websockets', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + websockets + ipfs', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + tcp + websockets + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/ws/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('ip6 + udp + quic + ipfs', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + udp + quic + p2p', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/4001/quic/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('unix', () => {
    const str = '/unix/a/b/c/d/e'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p', () => {
    const str = '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('ipfs', () => {
    const str = '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-circuit', () => {
    const str = '/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('p2p-circuit p2p', () => {
    const str = '/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('p2p-circuit ipfs', () => {
    const str = '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/p2p-circuit'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-webrtc-star', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str.replace('/p2p/', '/ipfs/'))
  })

  it('p2p-webrtc-star ipfs', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-webrtc-direct', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('p2p-websocket-star', () => {
    const str = '/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })
})

describe('helpers', () => {
  describe('.toOptions', () => {
    it('returns a well formed options object', () => {
      expect(multiaddr('/ip4/0.0.0.0/tcp/1234').toOptions())
        .to.eql({
          family: 'ipv4',
          host: '0.0.0.0',
          transport: 'tcp',
          port: '1234'
        })
    })
  })

  describe('.inspect', () => {
    it('renders the buffer as hex', () => {
      expect(multiaddr('/ip4/0.0.0.0/tcp/1234').inspect())
        .to.eql('<Multiaddr 04000000000604d2 - /ip4/0.0.0.0/tcp/1234>')
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
        name: 'ipfs',
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
        name: 'ipfs',
        path: false,
        size: -1,
        resolvable: false
      }])
    })

    it('works with unix', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/8000/unix/tmp/p2p.sock').protos()
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
  })

  describe('.tuples', () => {
    it('returns the tuples', () => {
      expect(multiaddr('/ip4/0.0.0.0/utp').tuples())
        .to.eql([
          [4, Buffer.from([0, 0, 0, 0])],
          [302]
        ])
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
        port: '1234'
      })
    })

    it('returns a node friendly address with dns', () => {
      expect(
        multiaddr('/dns4/wss0.bootstrap.libp2p.io/tcp/443').nodeAddress()
      ).to.be.eql({
        address: 'wss0.bootstrap.libp2p.io',
        family: 4,
        port: '443'
      })
    })

    it('throws on an invalid format address when the addr is not prefixed with a /', () => {
      expect(
        () => multiaddr('ip4/192.168.0.1/udp').nodeAddress()
      ).to.throw(
        /must start with a/
      )
    })

    it('throws on an invalid protocol name when the addr has an invalid one', () => {
      expect(
        () => multiaddr('/ip5/127.0.0.1/udp/5000')
      ).to.throw(
        /no protocol with name/
      )
    })

    it('throws on an invalid protocol name when the transport protocol is not valid', () => {
      expect(
        () => multiaddr('/ip4/127.0.0.1/utp/5000')
      ).to.throw(
        /no protocol with name/
      )
    })
  })

  describe('.fromNodeAddress', () => {
    it('throws on missing address object', () => {
      expect(
        () => multiaddr.fromNodeAddress()
      ).to.throw(
        /requires node address/
      )
    })

    it('throws on missing transport', () => {
      expect(
        () => multiaddr.fromNodeAddress({ address: '0.0.0.0' })
      ).to.throw(
        /requires transport protocol/
      )
    })

    it('parses a node address', () => {
      expect(
        multiaddr.fromNodeAddress({
          address: '192.168.0.1',
          family: 'IPv4',
          port: '1234'
        }, 'tcp').toString()
      ).to.be.eql(
        '/ip4/192.168.0.1/tcp/1234'
      )
    })
  })

  describe('.isThinWaistAddress', () => {
    const families = ['ip4', 'ip6']
    const transports = ['tcp', 'udp']
    const addresses = {
      ip4: '192.168.0.1',
      ip6: '2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095'
    }
    families.forEach((family) => {
      transports.forEach((transport) => {
        it(`returns true for /${family}-${transport}`, () => {
          expect(
            multiaddr(
              `/${family}/${addresses[family]}/${transport}/1234`
            ).isThinWaistAddress()
          ).to.equal(true)
        })
      })
    })

    it('returns false for two protocols not using {IPv4, IPv6}/{TCP, UDP}', () => {
      expect(
        multiaddr('/ip4/192.168.0.1/utp').isThinWaistAddress()
      ).to.equal(false)

      expect(
        multiaddr('/sctp/192.168.0.1/tcp/1234').isThinWaistAddress()
      ).to.eql(
        false
      )

      expect(
        multiaddr('/http/utp').isThinWaistAddress()
      ).to.eql(
        false
      )
    })

    it('returns false for more than two protocols', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/utp').isThinWaistAddress()
      ).to.equal(
        false
      )
    })
  })

  describe('.getPeerId should parse id from multiaddr', () => {
    it('parses extracts the peer Id from a multiaddr, p2p', () => {
      expect(
        multiaddr('/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
    })
    it('parses extracts the peer Id from a multiaddr, ipfs', () => {
      expect(
        multiaddr('/p2p-circuit/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').getPeerId()
      ).to.equal('QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
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
        multiaddr('/unix/tmp/p2p.sock').getPath()
      ).to.eql('/tmp/p2p.sock')
    })

    it('should return a path for unix when other protos exist', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/unix/tmp/p2p.sock').getPath()
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
      expect(multiaddr.isMultiaddr(multiaddr('/'))).to.be.eql(true)
      expect(multiaddr.isMultiaddr('/')).to.be.eql(false)
      expect(multiaddr.isMultiaddr(123)).to.be.eql(false)

      expect(multiaddr.isMultiaddr(Buffer.from('/hello'))).to.be.eql(false)
    })
  })

  describe('resolvable multiaddrs', () => {
    describe('.isName', () => {
      it('valid name dns', () => {
        const str = '/dns/ipfs.io'
        const addr = multiaddr(str)
        expect(multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dnsaddr', () => {
        const str = '/dnsaddr/ipfs.io'
        const addr = multiaddr(str)
        expect(multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dns4', () => {
        const str = '/dns4/ipfs.io'
        const addr = multiaddr(str)
        expect(multiaddr.isName(addr)).to.equal(true)
      })

      it('valid name dns6', () => {
        const str = '/dns6/ipfs.io'
        const addr = multiaddr(str)
        expect(multiaddr.isName(addr)).to.equal(true)
      })

      it('invalid name', () => {
        const str = '/ip4/127.0.0.1'
        const addr = multiaddr(str)
        expect(multiaddr.isName(addr)).to.equal(false)
      })
    })

    describe('.resolve', () => {
      it.skip('valid and active DNS name', (done) => {})
      it.skip('valid but inactive DNS name', (done) => {})
      it('invalid DNS name', (done) => {
        const str = '/ip4/127.0.0.1'
        const addr = multiaddr(str)
        multiaddr.resolve(addr, (err, multiaddrs) => {
          expect(err).to.exist()
          done()
        })
      })
    })
  })
})
