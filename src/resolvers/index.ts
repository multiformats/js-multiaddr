import type { AbortOptions, Multiaddr } from '../index.js'

export interface Resolver<ResolveOptions extends AbortOptions = AbortOptions> {
  (ma: Multiaddr, options?: ResolveOptions): Promise<string[]>
}

export { dnsaddrResolver } from './dnsaddr.js'
export type { DNSADDROptions } from './dnsaddr.js'
