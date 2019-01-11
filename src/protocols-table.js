'use strict'

function Protocols (proto) {
  if (typeof (proto) === 'number') {
    if (Protocols.codes[proto]) {
      return Protocols.codes[proto]
    }

    throw new Error('no protocol with code: ' + proto)
  } else if (typeof (proto) === 'string' || proto instanceof String) {
    if (Protocols.names[proto]) {
      return Protocols.names[proto]
    }

    throw new Error('no protocol with name: ' + proto)
  }

  throw new Error('invalid protocol id type: ' + proto)
}

const V = -1
Protocols.lengthPrefixedVarSize = V
Protocols.V = V

Protocols.table = [
  [4, 32, 'ip4'],
  [6, 16, 'tcp'],
  [273, 16, 'udp'],
  [33, 16, 'dccp'],
  [41, 128, 'ip6'],
  [54, V, 'dns4', 'resolvable'],
  [55, V, 'dns6', 'resolvable'],
  [56, V, 'dnsaddr', 'resolvable'],
  [132, 16, 'sctp'],
  // all of the below use varint for size
  [302, 0, 'utp'],
  // `p2p` is the preferred name for 421
  [421, Protocols.lengthPrefixedVarSize, 'p2p'],
  // `ipfs` has been added after `p2p` so that it is used by default.
  // The reason for this is to provide better backwards support for
  // code bases that do not yet support the `p2p` proto name. Eventually
  // `p2p` should become the default.
  [421, Protocols.lengthPrefixedVarSize, 'ipfs'],
  [480, 0, 'http'],
  [443, 0, 'https'],
  [460, 0, 'quic'],
  [477, 0, 'ws'],
  [478, 0, 'wss'],
  [479, 0, 'p2p-websocket-star'],
  [277, 0, 'p2p-stardust'],
  [275, 0, 'p2p-webrtc-star'],
  [276, 0, 'p2p-webrtc-direct'],
  [290, 0, 'p2p-circuit']
]

Protocols.names = {}
Protocols.codes = {}

// populate tables
Protocols.table.map(row => {
  const proto = p.apply(null, row)
  Protocols.codes[proto.code] = proto
  Protocols.names[proto.name] = proto
})

Protocols.object = p

function p (code, size, name, resolvable) {
  return {
    code: code,
    size: size,
    name: name,
    resolvable: Boolean(resolvable)
  }
}

module.exports = Protocols
