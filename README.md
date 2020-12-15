js-multiaddr <!-- omit in toc -->
============

[![pl](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai)
[![project](https://img.shields.io/badge/project-multiformats-blue.svg?style=flat-square)](https://github.com/multiformats/multiformats)
[![irc](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=%23ipfs)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multiaddr.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multiaddr)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/multiformats/js-multiaddr/ci?label=ci&style=flat-square)](https://github.com/multiformats/js-multiaddr/actions?query=branch%3Amaster+workflow%3Aci+)

> JavaScript implementation of [multiaddr](https://github.com/multiformats/multiaddr).

## Lead Maintainer <!-- omit in toc -->

[Jacob Heun](https://github.com/jacobheun)

## Table of Contents<!-- omit in toc -->

- [Background](#background)
  - [What is multiaddr?](#what-is-multiaddr)
- [Migrate to 0.9](#migrate-to-09)
- [Install](#install)
  - [NPM](#npm)
  - [Browser: `<script>` Tag](#browser-script-tag)
- [Usage](#usage)
- [API](#api)
- [Resolvers](#resolvers)
- [Contribute](#contribute)
- [License](#license)

## Background

### What is multiaddr?

A standard way to represent addresses that

- support any standard network protocol
- are self-describing
- have a binary packed format
- have a nice string representation
- encapsulate well

## Migrate to 0.9
Before 0.9 `multiaddr` would return an constructor function.
```js
const multiaddr = require('multiaddr')

const mh1 = multiaddr('/ip4/127.0.0.1/udp/1234')

const mh2 = new multiaddr('/ip4/127.0.0.1/udp/1234')
// both mh1 and mh2 were multiaddr instances

multiaddr.isName()
multiaddr.protocols
// etc 

```
In 0.9 `multiaddr` returns a class.
```js
const Multiaddr = require('multiaddr')
// you need to use `new` to create and instance
const mh1 = new Multiaddr('/ip4/127.0.0.1/udp/1234') 
```

```js
// The Multiaddr class has a factory method to help migration
const { multiaddr } = require('multiaddr')

const mh1 = multiaddr('/ip4/127.0.0.1/udp/1234')
```
```js
// In case you are using the static methods/getters `fromNodeAddress`, `isName` , `isMultiaddr`, `protocols` and `resolvers`
// You will need to do a couple more changes
const Multiaddr = require('multiaddr')
const { multiaddr, isName } = Multiaddr

// multiaddr.isName() will not work anymore, only the default export has those methods/getters
Multiaddr.isName() // or just `isName()`

```

## Install

```sh
npm i multiaddr
```
### NPM

```js
const multiaddr = require('multiaddr')
```

### Browser: `<script>` Tag

Loading this module through a script tag will make the `Multiaddr` obj available in
the global namespace.

```html
<script src="https://unpkg.com/multiaddr/dist/index.min.js"></script>
```

## Usage

```js
$ node

> const Multiaddr = require('multiaddr')

> const addr = new Multiaddr("/ip4/127.0.0.1/udp/1234")
<Multiaddr /ip4/127.0.0.1/udp/1234>

> addr.bytes
<Uint8Array 04 7f 00 00 01 11 04 d2>

> addr.toString()
'/ip4/127.0.0.1/udp/1234'

> addr.protos()
[
  {code: 4, name: 'ip4', size: 32},
  {code: 273, name: 'udp', size: 16}
]

// gives you an object that is friendly with what Node.js core modules expect for addresses
> addr.nodeAddress()
{
  family: "4",
  port: 1234,
  address: "127.0.0.1"
}

> addr.encapsulate('/sctp/5678')
<Multiaddr /ip4/127.0.0.1/udp/1234/sctp/5678>
```

## API

https://multiformats.github.io/js-multiaddr/

## Resolvers

`multiaddr` allows multiaddrs to be resolved when appropriate resolvers are provided. This module already has resolvers available, but you can also create your own.  Resolvers should always be set in the same module that is calling `multiaddr.resolve()` to avoid conflicts if multiple versions of `multiaddr` are in your dependency tree. 
To provide multiaddr resolvers you can do:

```js
const Multiaddr = require('multiaddr')
const resolvers = require('multiaddr/src/resolvers')

Multiaddr.resolvers.set('dnsaddr', resolvers.dnsaddrResolver)
```

The available resolvers are:

|     Name    | type | Description |
|-------------|------|-------------|
| `dnsaddrResolver` | `dnsaddr` | dnsaddr resolution with TXT Records |

A resolver receives a `Multiaddr` as a parameter and returns a `Promise<Array<string>>`.

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multiaddr/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © 2016 Protocol Labs Inc.
