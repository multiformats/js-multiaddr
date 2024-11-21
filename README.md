# @multiformats/multiaddr

[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multiaddr.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multiaddr)
[![CI](https://img.shields.io/github/actions/workflow/status/multiformats/js-multiaddr/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/multiformats/js-multiaddr/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> multiaddr implementation (binary + string representation of network addresses)

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

A standard way to represent addresses that

- support any standard network protocol
- are self-describing
- have a binary packed format
- have a nice string representation
- encapsulate well

## Example

```TypeScript
import { multiaddr } from '@multiformats/multiaddr'

const addr = multiaddr('/ip4/127.0.0.1/udp/1234')
// Multiaddr(/ip4/127.0.0.1/udp/1234)

addr.bytes
// <Uint8Array 04 7f 00 00 01 11 04 d2>

addr.toString()
// '/ip4/127.0.0.1/udp/1234'

addr.protos()
// [
//   {code: 4, name: 'ip4', size: 32},
//   {code: 273, name: 'udp', size: 16}
// ]

// gives you an object that is friendly with what Node.js core modules expect for addresses
addr.nodeAddress()
// {
//   family: 4,
//   port: 1234,
//   address: "127.0.0.1"
// }

addr.encapsulate('/sctp/5678')
// Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
```

## Resolving DNSADDR addresses

[DNSADDR](https://github.com/multiformats/multiaddr/blob/master/protocols/DNSADDR.md) is a spec that allows storing a TXT DNS record that contains a Multiaddr.

To resolve DNSADDR addresses, call the `.resolve()` function the multiaddr, optionally passing a `DNS` resolver.

DNSADDR addresses can resolve to multiple multiaddrs, since there is no limit to the number of TXT records that can be stored.

## Example - Resolving DNSADDR Multiaddrs

```TypeScript
import { multiaddr, resolvers } from '@multiformats/multiaddr'
import { dnsaddrResolver } from '@multiformats/multiaddr/resolvers'

resolvers.set('dnsaddr', dnsaddrResolver)

const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')

// resolve with a 5s timeout
const resolved = await ma.resolve({
  signal: AbortSignal.timeout(5000)
})

console.info(resolved)
// [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
```

## Example - Using a custom DNS resolver to resolve DNSADDR Multiaddrs

See the docs for [@multiformats/dns](https://www.npmjs.com/package/@multiformats/dns) for a full breakdown of how to specify multiple resolvers or resolvers that can be used for specific TLDs.

```TypeScript
import { multiaddr } from '@multiformats/multiaddr'
import { dns } from '@multiformats/dns'
import { dnsJsonOverHttps } from '@multiformats/dns/resolvers'

const resolver = dns({
  resolvers: {
    '.': dnsJsonOverHttps('https://cloudflare-dns.com/dns-query')
  }
})

const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
const resolved = await ma.resolve({
 dns: resolver
})

console.info(resolved)
// [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
```

# Install

```console
$ npm i @multiformats/multiaddr
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `MultiformatsMultiaddr` in the global namespace.

```html
<script src="https://unpkg.com/@multiformats/multiaddr/dist/index.min.js"></script>
```

# API Docs

- <https://multiformats.github.io/js-multiaddr>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
