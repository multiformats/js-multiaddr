js-multiaddr
============

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-multiformats-blue.svg?style=flat-square)](http://github.com/multiformats/multiformats)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Coverage Status](https://coveralls.io/repos/github/multiformats/js-multiaddr/badge.svg?branch=master)](https://coveralls.io/github/multiformats/js-multiaddr?branch=master)
[![Travis CI](https://travis-ci.org/multiformats/js-multiaddr.svg?branch=master)](https://travis-ci.org/multiformats/js-multiaddr)
[![Circle CI](https://circleci.com/gh/multiformats/js-multiaddr.svg?style=svg)](https://circleci.com/gh/multiformats/js-multiaddr)
[![Dependency Status](https://david-dm.org/multiformats/js-multiaddr.svg?style=flat-square)](https://david-dm.org/multiformats/js-multiaddr) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> JavaScript implementation of [multiaddr](https://github.com/multiformats/multiaddr).

## Table of Contents

- [Background](#background)
  - [What is multiaddr?](#what-is-multiaddr)
- [Install](#install)
  - [Setup](#setup)
    - [Node.js](#nodejs)
    - [Browser: Browserify, Webpack, other bundlers](#browser-browserify-webpack-other-bundlers)
    - [Browser: `<script>` Tag](#browser-script-tag)
- [Usage](#usage)
- [API](#api)
  - [Create](#create)
  - [Protocols](#protocols)
  - [Node-Friendly Addresses](#node-friendly-addresses)
  - [En/decapsulate](#endecapsulate)
  - [Tunneling](#tunneling)
- [Maintainers](#maintainers)
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

## Install

```sh
npm i multiaddr
```

### Setup

#### Node.js

```js
const multiaddr = require('multiaddr')
```

#### Browser: Browserify, Webpack, other bundlers

The code published to npm that gets loaded on require is in fact a ES5
transpiled version with the right shims added. This means that you can require
it and use with your favourite bundler without having to adjust asset management
process.

```js
const multiaddr = require('multiaddr')
```

#### Browser: `<script>` Tag

Loading this module through a script tag will make the `Multiaddr` obj available in
the global namespace.

```html
<script src="https://unpkg.com/multiaddr/dist/index.min.js"></script>
<!-- OR -->
<script src="https://unpkg.com/multiaddr/dist/index.js"></script>
```

**NOTE**: You will need access to the Node.js `Buffer` API. If you are running
in the browser, you can access it with `multiaddr.Buffer` or you can install
[feross/buffer](https://github.com/feross/buffer).

## Usage

```js
$ node

> const multiaddr = require('multiaddr')

> const addr = multiaddr("/ip4/127.0.0.1/udp/1234")
<Multiaddr /ip4/127.0.0.1/udp/1234>

> addr.buffer
<Buffer 04 7f 00 00 01 11 04 d2>

> addr.toString()
'/ip4/127.0.0.1/udp/1234'

> addr.protos()
[
  {code: 4, name: 'ip4', size: 32},
  {code: 17, name: 'udp', size: 16}
]

> addr.nodeAddress()
{
  family: "IPv4",
  port: 1234,
  address: "127.0.0.1"
}

> addr.encapsulate('/sctp/5678')
<Multiaddr /ip4/127.0.0.1/udp/1234/sctp/5678>
```

## API

TODO: Moved to API-docs, insert link here

## Maintainers

Captain: [@diasdavid](https://github.com/diasdavid).

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multiaddr/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © Protocol Labs Inc.
