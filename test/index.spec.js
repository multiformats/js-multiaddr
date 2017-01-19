/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const multiaddr = require('../src')
const expect = require('chai').expect

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

  it('empty construct still works', () => {
    expect(multiaddr('').toString()).to.equal('/')
  })

  it('throws on non string or buffer', () => {
    expect(
      () => multiaddr({})
    ).to.throw(
      /addr must be a string/
    )
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
    const udpAddrBuf = new Buffer('047f0000011104d2', 'hex')
    const udpAddr = multiaddr(udpAddrStr)

    expect(udpAddr.toString()).to.equal(udpAddrStr)
    expect(udpAddr.buffer).to.deep.equal(udpAddrBuf)

    expect(udpAddr.protoCodes()).to.deep.equal([4, 17])
    expect(udpAddr.protoNames()).to.deep.equal(['ip4', 'udp'])
    expect(udpAddr.protos()).to.deep.equal([multiaddr.protocols.codes[4], multiaddr.protocols.codes[17]])
    expect(udpAddr.protos()[0] === multiaddr.protocols.codes[4]).to.equal(false)

    const udpAddrBuf2 = udpAddr.encapsulate('/udp/5678')
    expect(udpAddrBuf2.toString()).to.equal('/ip4/127.0.0.1/udp/1234/udp/5678')
    expect(udpAddrBuf2.decapsulate('/udp').toString()).to.equal('/ip4/127.0.0.1/udp/1234')
    expect(udpAddrBuf2.decapsulate('/ip4').toString()).to.equal('/')
    expect(function () { udpAddr.decapsulate('/').toString() }).to.throw
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

  it('ip4 + ipfs', () => {
    const str = '/ip4/127.0.0.1/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('ip6 + ipfs', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC/tcp/1234'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
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

  it('ip6 + tcp + http', () => {
    const str = '/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/tcp/8000/http'
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

  it('ipfs', () => {
    const str = '/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('webrtc-star', () => {
    const str = '/libp2p-webrtc-star/ip4/127.0.0.1/tcp/9090/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })

  it('webrtc-direct', () => {
    const str = '/libp2p-webrtc-direct/ip4/127.0.0.1/tcp/9090/http'
    const addr = multiaddr(str)
    expect(addr).to.have.property('buffer')
    expect(addr.toString()).to.equal(str)
  })
})

describe('helpers', () => {
  describe('.toOptions', () => {
    it('returns a well formed options object', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234').toOptions()
      ).to.be.eql({
        family: 'ipv4',
        host: '0.0.0.0',
        transport: 'tcp',
        port: '1234'
      })
    })
  })

  describe('.inspect', () => {
    it('renders the buffer as hex', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234').inspect()
      ).to.be.eql(
        '<Multiaddr 04000000000604d2 - /ip4/0.0.0.0/tcp/1234>'
      )
    })
  })

  describe('.protos', () => {
    it('returns a list of all protocols in the address', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp').protos()
      ).to.be.eql([{
        code: 4,
        name: 'ip4',
        size: 32
      }, {
        code: 302,
        name: 'utp',
        size: 0
      }])
    })

    it('works with ipfs', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC').protos()
      ).to.be.eql([{
        code: 4,
        name: 'ip4',
        size: 32
      }, {
        code: 302,
        name: 'utp',
        size: 0
      }, {
        code: 421,
        name: 'ipfs',
        size: -1
      }])
    })
  })

  describe('.tuples', () => {
    it('returns the tuples', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp').tuples()
      ).to.be.eql([
        [4, new Buffer([0, 0, 0, 0])],
        [302]
      ])
    })
  })

  describe('.stringTuples', () => {
    it('returns the string partss', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/utp').stringTuples()
      ).to.be.eql([
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

      expect(
        addr1.equals(addr2)
      ).to.be.eql(
        true
      )
    })

    it('returns false for non equal addresses', () => {
      const addr1 = multiaddr('/ip4/192.168.1.1')
      const addr2 = multiaddr('/ip4/192.168.0.1')

      expect(
        addr1.equals(addr2)
      ).to.be.eql(
        false
      )
    })
  })

  describe('.nodeAddress', () => {
    it('throws on non thinWaistAddress', () => {
      expect(
        () => multiaddr('/ip4/192.168.0.1/utp').nodeAddress()
      ).to.throw(
          /thin waist/
      )
    })

    it('returns a node friendly address', () => {
      expect(
        multiaddr('/ip4/192.168.0.1/tcp/1234').nodeAddress()
      ).to.be.eql({
        address: '192.168.0.1',
        family: 'IPv4',
        port: '1234'
      })
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
        () => multiaddr.fromNodeAddress({address: '0.0.0.0'})
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
        it(`returns true for ${family}-${transport}`, () => {
          expect(
            multiaddr(
              `${family}/${addresses[family]}/${transport}/1234`
            ).isThinWaistAddress()
          ).to.be.eql(
            true
          )
        })
      })
    })

    it('returns false for two protocols not using {IPv4, IPv6}/{TCP, UDP}', () => {
      expect(
        multiaddr('/ip4/192.168.0.1/utp').isThinWaistAddress()
      ).to.be.eql(
        false
      )

      expect(
        multiaddr('/sctp/192.168.0.1/tcp/1234').isThinWaistAddress()
      ).to.be.eql(
        false
      )

      expect(
        multiaddr('/http/utp').isThinWaistAddress()
      ).to.be.eql(
        false
      )
    })

    it('returns false for more than two protocols', () => {
      expect(
        multiaddr('/ip4/0.0.0.0/tcp/1234/utp').isThinWaistAddress()
      ).to.be.eql(
        false
      )
    })
  })

  describe('.fromStupidString', () => {
    it('parses an address in the format <proto><IPv>://<IP Addr>[:<proto port>]', () => {
      expect(
        () => multiaddr('/').fromStupidString()
      ).to.throw(
          /Not Implemented/
      )
    })
  })

  describe('multiaddr.isMultiaddr', () => {
    it('handles different inputs', () => {
      expect(multiaddr.isMultiaddr(multiaddr('/'))).to.be.eql(true)
      expect(multiaddr.isMultiaddr('/')).to.be.eql(false)
      expect(multiaddr.isMultiaddr(123)).to.be.eql(false)

      expect(multiaddr.isMultiaddr(Buffer('/hello'))).to.be.eql(false)
    })
  })
})
