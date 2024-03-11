import { RecordType } from '@multiformats/dns'
import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { stubInterface, type StubbedInstance } from 'sinon-ts'
import { multiaddr, resolvers } from '../src/index.js'
import { dnsaddrResolver } from '../src/resolvers/index.js'
import type { DNS } from '@multiformats/dns'

const stubs: Record<string, string[]> = {
  '_dnsaddr.bootstrap.libp2p.io': [
    'dnsaddr=/dnsaddr/ams-1.bootstrap.libp2p.io/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/dnsaddr/ams-2.bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'
  ],
  '_dnsaddr.ams-1.bootstrap.libp2p.io': [
    'dnsaddr=/ip4/147.75.83.83/tcp/4001/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/ip4/147.75.83.83/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/ip4/147.75.83.83/udp/4001/quic/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/4001/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/udp/4001/quic/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd'
  ],
  '_dnsaddr.ams-2.bootstrap.libp2p.io': [
    'dnsaddr=/ip4/147.75.83.83/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/ip4/147.75.83.83/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/ip4/147.75.83.83/udp/4001/quic/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/tcp/443/wss/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/ip6/2604:1380:2000:7a00::1/udp/4001/quic/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'
  ],
  '_dnsaddr.bad-addrs.libp2p.io': [
    'dnsaddr=/dnsaddr/sv15.bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
    'dnsaddr=/dnsaddr/ny5.bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
    'dnsaddr_record_value',
    'dnsaddr=/dnsaddr/am6.bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    'dnsaddr=/dnsaddr/sg1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
  ],
  '_dnsaddr.am6.bootstrap.libp2p.io': [
    'dnsaddr=/ip4/147.75.83.83/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'
  ]
}

describe('multiaddr resolve', () => {
  let dns: StubbedInstance<DNS>

  beforeEach(() => {
    dns = stubInterface<DNS>({
      query: sinon.stub().callsFake((domain) => {
        if (stubs[domain] != null) {
          return {
            Answer: stubs[domain].map(data => ({
              name: '_dnsaddr.bootstrap.libp2p.io',
              type: RecordType.TXT,
              ttl: 100,
              data
            }))
          }
        }

        throw new Error(`No result stubbed for ${domain}`)
      })
    })

    resolvers.set('dnsaddr', dnsaddrResolver)
  })

  it('should throw if no resolver is available', async () => {
    const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

    resolvers.clear()

    // Resolve
    await expect(ma.resolve()).to.eventually.be.rejected()
      .and.to.have.property('code', 'ERR_NO_AVAILABLE_RESOLVER')
  })

  describe('dnsaddr', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('can resolve dnsaddr without no peerId', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

      // Resolve
      const resolvedMas = await ma.resolve({
        dns
      })

      expect(resolvedMas).to.deep.equal([
        ...stubs['_dnsaddr.ams-1.bootstrap.libp2p.io'].map(addr => multiaddr(addr.split('=').pop())),
        ...stubs['_dnsaddr.ams-2.bootstrap.libp2p.io'].map(addr => multiaddr(addr.split('=').pop()))
      ])
    })

    it('can resolve dnsaddr with peerId', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')

      // Resolve
      const resolvedMas = await ma.resolve({
        dns
      })

      expect(resolvedMas).to.deep.equal([
        ...stubs['_dnsaddr.ams-2.bootstrap.libp2p.io'].map(addr => multiaddr(addr.split('=').pop()))
      ])
    })

    it('can resolve dnsaddr with bad record', async () => {
      const ma = multiaddr('/dnsaddr/bad-addrs.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')

      // Resolve
      const resolvedMas = await ma.resolve({
        dns
      })

      // Should only have one address with the same peer id and should ignore the bad record
      expect(resolvedMas).to.have.lengthOf(1)
      expect(resolvedMas[0].toString()).to.equal(stubs['_dnsaddr.am6.bootstrap.libp2p.io'][0].split('=').pop())
    })

    it('can cancel resolving', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.ii/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nc')
      const controller = new AbortController()

      // Resolve
      const resolvePromise = ma.resolve({
        signal: controller.signal
      })

      controller.abort()

      await expect(resolvePromise).to.eventually.be.rejected().with.property('code', 'ABORT_ERR')
    })

    it('should abort resolving deeply nested records', async () => {
      const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

      // Resolve
      const resolvePromise = ma.resolve({
        dns,
        maxRecursiveDepth: 1
      })

      await expect(resolvePromise).to.eventually.be.rejected().with.property('code', 'ERR_MAX_RECURSIVE_DEPTH_REACHED')
    })
  })
})
