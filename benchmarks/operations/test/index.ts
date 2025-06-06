/* eslint-disable no-console */

import { multiaddr } from '@multiformats/multiaddr'
import { multiaddr as multiaddr12 } from '@multiformats/multiaddr-12.4.0'
import { Bench } from 'tinybench'

const ITERATIONS = parseInt(process.env.ITERATIONS ?? '50000')
const MIN_TIME = parseInt(process.env.MIN_TIME ?? '1')
const RESULT_PRECISION = 2

function bench (m: typeof multiaddr | typeof multiaddr12): void {
  const ma = m('/ip4/127.0.0.1/udp/1234/quic-v1/webtransport/certhash/uEiAkH5a4DPGKUuOBjYw0CgwjvcJCJMD2K_1aluKR_tpevQ/certhash/uEiAfbgiymPP2_nX7Dgir8B4QkksjHp2lVuJZz0F79Be9JA')
  ma.encapsulate('/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
  ma.decapsulate('/quic-v1')

  const ma2 = m(ma.bytes)
  ma2.encapsulate('/tls/sni/example.com/http/http-path/path%2Findex.html')
  ma2.equals(ma)

  ma2.getPath()
  ma2.getPeerId()

  const ma3 = m('/ip6/2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095/udp/1234/quic-v1/webtransport/certhash/uEiAkH5a4DPGKUuOBjYw0CgwjvcJCJMD2K_1aluKR_tpevQ/certhash/uEiAfbgiymPP2_nX7Dgir8B4QkksjHp2lVuJZz0F79Be9JA')
  ma3.encapsulate('/p2p-circuit/p2p/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC')
  ma3.decapsulate('/quic-v1')
}

async function main (): Promise<void> {
  const suite = new Bench({
    iterations: ITERATIONS,
    time: MIN_TIME
  })
  suite.add('head', () => {
    bench(multiaddr)
  })
  suite.add('@multiformats/multiaddr@12.4.0', () => {
    bench(multiaddr12)
  })

  await suite.run()

  console.table(suite.tasks.map(({ name, result }) => {
    if (result?.error != null) {
      console.info(result.error)
      return {
        Implementation: name,
        'ops/s': 'error',
        'ms/op': 'error',
        runs: 'error',
        p99: 'error'
      }
    }
    return {
      Implementation: name,
      'ops/s': result?.hz.toFixed(RESULT_PRECISION),
      'ms/op': result?.period.toFixed(RESULT_PRECISION),
      runs: result?.samples.length,
      p99: result?.p99.toFixed(RESULT_PRECISION)
    }
  }))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
