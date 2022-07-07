# @multiformats/multiaddr <!-- omit in toc -->

[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multiaddr.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multiaddr)
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/multiformats/js-multiaddr/actions/workflows/js-test-and-release.yml)

> multiaddr implementation (binary + string representation of network addresses)

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Lead Maintainer](#lead-maintainer)
- [Background](#background)
  - [What is multiaddr?](#what-is-multiaddr)
  - [Browser: `<script>` Tag](#browser-script-tag)
- [Usage](#usage)
- [API](#api)
- [Resolvers](#resolvers)
- [Contribute](#contribute)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i @multiformats/multiaddr
```

## Lead Maintainer

[Jacob Heun](https://github.com/jacobheun)

## Background

### What is multiaddr?

A standard way to represent addresses that

- support any standard network protocol
- are self-describing
- have a binary packed format
- have a nice string representation
- encapsulate well

```sh
npm i multiaddr
```

### Browser: `<script>` Tag

Loading this module through a script tag will make the `Multiaddr` obj available in
the global namespace.

```html
<script src="https://unpkg.com/multiaddr/dist/index.min.js"></script>
```

## Usage

```js
// if we are coming from <= 8.x you can use the factory function 
const { multiaddr } = require('multiaddr')
const addr =  multiaddr("/ip4/127.0.0.1/udp/1234")
// <Multiaddr /ip4/127.0.0.1/udp/1234>

// or just the class directly
const { Multiaddr } = require('multiaddr')

const addr = new Multiaddr("/ip4/127.0.0.1/udp/1234")
// <Multiaddr /ip4/127.0.0.1/udp/1234>

addr.bytes
// <Uint8Array 04 7f 00 00 01 11 04 d2>

addr.toString()
// '/ip4/127.0.0.1/udp/1234'

addr.protos()
/* 
[
  {code: 4, name: 'ip4', size: 32},
  {code: 273, name: 'udp', size: 16}
]
*/

// gives you an object that is friendly with what Node.js core modules expect for addresses
addr.nodeAddress()
/*
{
  family: 4,
  port: 1234,
  address: "127.0.0.1"
}
*/

addr.encapsulate('/sctp/5678')
// <Multiaddr /ip4/127.0.0.1/udp/1234/sctp/5678>
```

## API

<https://multiformats.github.io/js-multiaddr/>

## Resolvers

`multiaddr` allows multiaddrs to be resolved when appropriate resolvers are provided. This module already has resolvers available, but you can also create your own.  Resolvers should always be set in the same module that is calling `multiaddr.resolve()` to avoid conflicts if multiple versions of `multiaddr` are in your dependency tree.
To provide multiaddr resolvers you can do:

```js
const { Multiaddr } = require('multiaddr')
const resolvers = require('multiaddr/src/resolvers')

Multiaddr.resolvers.set('dnsaddr', resolvers.dnsaddrResolver)
```

The available resolvers are:

| Name              | type      | Description                         |
| ----------------- | --------- | ----------------------------------- |
| `dnsaddrResolver` | `dnsaddr` | dnsaddr resolution with TXT Records |

A resolver receives a `Multiaddr` as a parameter and returns a `Promise<Array<string>>`.

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multiaddr/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
