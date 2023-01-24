import type { IpNet } from '@chainsafe/netmask'
import { convertToIpNet } from '../convert.js'
import { multiaddr, Multiaddr, MultiaddrInput } from '../index.js'

export class MultiaddrFilter {
  private readonly multiaddr: Multiaddr
  private readonly netmask: IpNet

  public constructor (input: MultiaddrInput) {
    this.multiaddr = multiaddr(input)
    this.netmask = convertToIpNet(this.multiaddr)
  }

  public contains (input: MultiaddrInput): boolean {
    if (input == null) return false
    const m = multiaddr(input)
    let ip
    for (const [code, value] of m.stringTuples()) {
      if (code === 4 || code === 41) {
        ip = value
        break
      }
    }
    if (ip === undefined) return false
    return this.netmask.contains(ip)
  }
}
