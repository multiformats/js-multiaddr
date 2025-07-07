# @multiformats/multiaddr

[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multiaddr.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multiaddr)
[![CI](https://img.shields.io/github/actions/workflow/status/multiformats/js-multiaddr/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/multiformats/js-multiaddr/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> The JavaScript implementation of the Multiaddr spec

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

addr.getComponents()
// [
//   { code: 4, name: 'ip4', value: '127.0.0.1' },
//   { code: 273, name: 'udp', value: '1234' }
// ]

addr.encapsulate('/sctp/5678')
// Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
```

## Example - Adding custom protocols

To add application-specific or experimental protocols, add a protocol codec
to the protocol registry:

```ts
import { registry, V, multiaddr } from '@multiformats/multiaddr'
import type { ProtocolCodec } from '@multiformats/multiaddr'

const maWithCustomTuple = '/custom-protocol/hello'

// throws UnknownProtocolError
multiaddr(maWithCustomTuple)

const protocol: ProtocolCodec = {
  code: 2059,
  name: 'custom-protocol',
  size: V
  // V means variable length, can also be 0, a positive integer (e.g. a fixed
  // length or omitted
}

registry.addProtocol(protocol)

// does not throw UnknownProtocolError
multiaddr(maWithCustomTuple)

// protocols can also be removed
registry.removeProtocol(protocol.code)
```

# API Docs

- <https://multiformats.github.io/js-multiaddr>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/multiformats/js-multiaddr/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/multiformats/js-multiaddr/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
