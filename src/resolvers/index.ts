import type { AbortOptions, Multiaddr } from '../index.js'

export interface Resolver<ResolveOptions extends AbortOptions = AbortOptions> {
  (ma: Multiaddr, options?: ResolveOptions): Promise<Multiaddr[]>
}

export { dnsaddr } from './dnsaddr.js'
