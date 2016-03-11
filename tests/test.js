/* eslint-env mocha */

const multiaddr = require('../src')
const expect = require('chai').expect

describe('construction', (done) => {
  var udpAddr

  it('create multiaddr', (done) => {
    udpAddr = multiaddr('/ip4/127.0.0.1/udp/1234')
    expect(udpAddr instanceof multiaddr).to.equal(true)
    done()
  })

  it('clone multiaddr', (done) => {
    const udpAddrClone = multiaddr(udpAddr)
    expect(udpAddrClone !== udpAddr).to.equal(true)
    done()
  })

  it('reconstruct with buffer', (done) => {
    expect(multiaddr(udpAddr.buffer).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr.buffer).buffer).to.deep.equal(udpAddr.buffer)
    done()
  })

  it('reconstruct with string', (done) => {
    expect(multiaddr(udpAddr.toString()).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr.toString()).buffer).to.deep.equal(udpAddr.buffer)
    done()
  })

  it('reconstruct with object', (done) => {
    expect(multiaddr(udpAddr).buffer === udpAddr.buffer).to.equal(false)
    expect(multiaddr(udpAddr).buffer).to.deep.equal(udpAddr.buffer)
    done()
  })

  it('empty construct still works', (done) => {
    expect(multiaddr('').toString()).to.equal('/')
    done()
  })
})

describe('manipulation', () => {
  it('basic', (done) => {
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

    done()
  })
})
