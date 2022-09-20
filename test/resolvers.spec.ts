/* eslint-env mocha */
import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { multiaddr, resolvers } from '../src/index.js'
import * as resolversInternal from '../src/resolvers/index.js'
import Resolver from '../src/resolvers/dns.js'

const dnsaddrStub1 = [
  ['dnsaddr=/dnsaddr/ams-1.bootstrap.libp2p.io/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd'],
  ['dnsaddr=/dnsaddr/ams-2.bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/dnsaddr/lon-1.bootstrap.libp2p.io/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3'],
  ['dnsaddr=/dnsaddr/nrt-1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'],
  ['dnsaddr=/dnsaddr/nyc-1.bootstrap.libp2p.io/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm'],
  ['dnsaddr=/dnsaddr/sfo-2.bootstrap.libp2p.io/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z']
]

const dnsaddrStub2 = [
  ['dnsaddr=/ip4/147.75.83.83/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/ip4/147.75.83.83/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/ip4/147.75.83.83/udp/4001/quic/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'],
  ['dnsaddr=/ip6/2604:1380:2000:7a00::1/udp/4001/quic/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb']
]

describe('multiaddr resolve', () => {
  it('should throw if no resolver is available', async () => {
    const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

    // Resolve
    await expect(ma.resolve()).to.eventually.be.rejected()
      .and.to.have.property('code', 'ERR_NO_AVAILABLE_RESOLVER')
  })

  describe('dnsaddr', () => {
    before(() => {
      // Set resolvers
      resolvers.set('dnsaddr', resolversInternal.dnsaddrResolver)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('can resolve dnsaddr without no peerId', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

      const stub = sinon.stub(Resolver.prototype, 'resolveTxt')
      stub.onCall(0).returns(Promise.resolve(dnsaddrStub1))

      // Resolve
      const resolvedMas = await ma.resolve()

      expect(resolvedMas).to.have.length(dnsaddrStub1.length)
      resolvedMas.forEach((ma, index) => {
        const stubAddr = dnsaddrStub1[index][0].split('=')[1]

        expect(ma.equals(multiaddr(stubAddr))).to.equal(true)
      })
    })

    it('can resolve dnsaddr with peerId', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')

      const stub = sinon.stub(Resolver.prototype, 'resolveTxt')
      stub.onCall(0).returns(Promise.resolve(dnsaddrStub1))
      stub.onCall(1).returns(Promise.resolve(dnsaddrStub2))

      // Resolve
      const resolvedMas = await ma.resolve()

      expect(resolvedMas).to.have.length(1)
      expect(resolvedMas[0].equals(multiaddr('/dnsaddr/ams-2.bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'))).to.eql(true)
    })

    it('can resolve dnsaddr with peerId two levels', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')

      const stub = sinon.stub(Resolver.prototype, 'resolveTxt')
      stub.onCall(0).returns(Promise.resolve(dnsaddrStub1))
      stub.onCall(1).returns(Promise.resolve(dnsaddrStub2))

      // Resolve
      const resolvedInitialMas = await ma.resolve()
      const resolvedSecondMas = await Promise.all(resolvedInitialMas.map(async nm => {
        //  nm.resolvers.set('dnsaddr', resolvers.dnsaddrResolver)
        return await nm.resolve()
      }))

      const resolvedMas = resolvedSecondMas.flat()

      expect(resolvedMas).to.have.length(dnsaddrStub2.length)

      resolvedMas.forEach((ma, index) => {
        const stubAddr = dnsaddrStub2[index][0].split('=')[1]

        expect(ma.equals(multiaddr(stubAddr))).to.equal(true)
      })
    })

    it('can cancel resolving', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.ii/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nc')
      const controller = new AbortController()

      // Resolve
      const resolvePromise = ma.resolve({
        signal: controller.signal
      })

      controller.abort()

      await expect(resolvePromise).to.eventually.be.rejected().with.property('code', 'ECANCELLED')
    })
  })
})
