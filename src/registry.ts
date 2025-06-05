import { isIPv4, isIPv6 } from '@chainsafe/is-ip'
import { CID } from 'multiformats'
import { base64url } from 'multiformats/bases/base64'
import { CODE_CERTHASH, CODE_DCCP, CODE_DNS, CODE_DNS4, CODE_DNS6, CODE_DNSADDR, CODE_GARLIC32, CODE_GARLIC64, CODE_HTTP, CODE_HTTP_PATH, CODE_HTTPS, CODE_IP4, CODE_IP6, CODE_IP6ZONE, CODE_IPCIDR, CODE_MEMORY, CODE_NOISE, CODE_ONION, CODE_ONION3, CODE_P2P, CODE_P2P_CIRCUIT, CODE_P2P_STARDUST, CODE_P2P_WEBRTC_DIRECT, CODE_P2P_WEBRTC_STAR, CODE_P2P_WEBSOCKET_STAR, CODE_QUIC, CODE_QUIC_V1, CODE_SCTP, CODE_SNI, CODE_TCP, CODE_TLS, CODE_UDP, CODE_UDT, CODE_UNIX, CODE_UTP, CODE_WEBRTC, CODE_WEBRTC_DIRECT, CODE_WEBTRANSPORT, CODE_WS, CODE_WSS } from './constants.ts'
import { bytes2mb, bytes2onion, bytes2port, bytesToString, ip4ToBytes, ip6ToBytes, ipToString, onion2bytes, onion32bytes, port2bytes, stringToBytes } from './convert.ts'
import { InvalidProtocolError, ValidationError } from './errors.ts'
import { validatePort } from './validation.ts'

export const V = -1

export interface ProtocolCodec {
  code: number
  name: string
  size?: number
  path?: boolean
  resolvable?: boolean
  aliases?: string[]

  /**
   * Where the multiaddr has been encoded as a string, decode the value if
   * necessary, unescaping any escaped values
   */
  stringToValue?(value: string): string

  /**
   * To encode the multiaddr as a string, escape any necessary values
   */
  valueToString?(value: string): string

  /**
   * To encode the multiaddr as bytes, convert the value to bytes
   */
  valueToBytes?(value: string): Uint8Array

  /**
   * To decode bytes to a multiaddr, convert the value bytes to a string
   */
  bytesToValue?(bytes: Uint8Array): string

  /**
   * Perform any necessary validation on the string value
   */
  validate?(value: string): void
}

class Registry {
  private protocolsByCode = new Map<number, ProtocolCodec>()
  private protocolsByName = new Map<string, ProtocolCodec>()

  getCodec (key: string | number): ProtocolCodec {
    let codec: ProtocolCodec | undefined

    if (typeof key === 'string') {
      codec = this.protocolsByName.get(key)
    } else {
      codec = this.protocolsByCode.get(key)
    }

    if (codec == null) {
      throw new InvalidProtocolError(`Protocol ${key} was unknown`)
    }

    return codec
  }

  addCodec (key: number, codec: ProtocolCodec, aliases?: string[]): void {
    this.protocolsByCode.set(key, codec)
    this.protocolsByName.set(codec.name, codec)

    aliases?.forEach(alias => {
      this.protocolsByName.set(alias, codec)
    })
  }

  deleteCodec (key: number): void {
    const codec = this.getCodec(key)

    if (codec == null) {
      return
    }

    this.protocolsByCode.delete(codec.code)
    this.protocolsByName.delete(codec.name)

    codec.aliases?.forEach(alias => {
      this.protocolsByName.delete(alias)
    })
  }
}

export const registry = new Registry()

const codecs: ProtocolCodec[] = [{
  code: CODE_IP4,
  name: 'ip4',
  size: 32,
  valueToBytes: ip4ToBytes,
  bytesToValue: ipToString,
  validate: (value) => {
    if (!isIPv4(value)) {
      throw new ValidationError('Invalid ip address')
    }
  }
}, {
  code: CODE_TCP,
  name: 'tcp',
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_UDP,
  name: 'udp',
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_DCCP,
  name: 'dccp',
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_IP6,
  name: 'ip6',
  size: 128,
  valueToBytes: ip6ToBytes,
  bytesToValue: ipToString,
  validate: (value) => {
    if (!isIPv6(value)) {
      throw new ValidationError('Invalid ip address')
    }
  }
}, {
  code: CODE_IP6ZONE,
  name: 'ip6zone',
  size: V
}, {
  code: CODE_IPCIDR,
  name: 'ipcidr',
  size: 8,
  bytesToValue: bytesToString('base10'),
  valueToBytes: stringToBytes('base10')
}, {
  code: CODE_DNS,
  name: 'dns',
  size: V,
  resolvable: true
}, {
  code: CODE_DNS4,
  name: 'dns4',
  size: V,
  resolvable: true
}, {
  code: CODE_DNS6,
  name: 'dns6',
  size: V,
  resolvable: true
}, {
  code: CODE_DNSADDR,
  name: 'dnsaddr',
  size: V,
  resolvable: true
}, {
  code: CODE_SCTP,
  name: 'sctp',
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_UDT,
  name: 'udt'
}, {
  code: CODE_UTP,
  name: 'utp'
}, {
  code: CODE_UNIX,
  name: 'unix',
  size: V,
  path: true,
  stringToValue: (str) => `/${decodeURIComponent(str)}`,
  valueToString: (val) => encodeURIComponent(val.substring(1))
}, {
  code: CODE_P2P,
  name: 'p2p',
  aliases: ['ipfs'],
  size: V,
  bytesToValue: bytesToString('base58btc'),
  valueToBytes: (val) => {
    if (val.startsWith('Q') || val.startsWith('1')) {
      return stringToBytes('base58btc')(val)
    }

    return CID.parse(val).multihash.bytes
  }
}, {
  code: CODE_ONION,
  name: 'onion',
  size: 96,
  bytesToValue: bytes2onion,
  valueToBytes: onion2bytes
}, {
  code: CODE_ONION3,
  name: 'onion3',
  size: 296,
  bytesToValue: bytes2onion,
  valueToBytes: onion32bytes
}, {
  code: CODE_GARLIC64,
  name: 'garlic64',
  size: V
}, {
  code: CODE_GARLIC32,
  name: 'garlic32',
  size: V
}, {
  code: CODE_TLS,
  name: 'tls'
}, {
  code: CODE_SNI,
  name: 'sni',
  size: V
}, {
  code: CODE_NOISE,
  name: 'noise'
}, {
  code: CODE_QUIC,
  name: 'quic'
}, {
  code: CODE_QUIC_V1,
  name: 'quic-v1'
}, {
  code: CODE_WEBTRANSPORT,
  name: 'webtransport'
}, {
  code: CODE_CERTHASH,
  name: 'certhash',
  size: V,
  bytesToValue: bytes2mb(base64url)
}, {
  code: CODE_HTTP,
  name: 'http'
}, {
  code: CODE_HTTP_PATH,
  name: 'http-path',
  size: V,
  stringToValue: (str) => `/${decodeURIComponent(str)}`,
  valueToString: (val) => encodeURIComponent(val.substring(1))
}, {
  code: CODE_HTTPS,
  name: 'https'
}, {
  code: CODE_WS,
  name: 'ws'
}, {
  code: CODE_WSS,
  name: 'wss'
}, {
  code: CODE_P2P_WEBSOCKET_STAR,
  name: 'p2p-websocket-star'
}, {
  code: CODE_P2P_STARDUST,
  name: 'p2p-stardust'
}, {
  code: CODE_P2P_WEBRTC_STAR,
  name: 'p2p-webrtc-star'
}, {
  code: CODE_P2P_WEBRTC_DIRECT,
  name: 'p2p-webrtc-direct'
}, {
  code: CODE_WEBRTC_DIRECT,
  name: 'webrtc-direct'
}, {
  code: CODE_WEBRTC,
  name: 'webrtc'
}, {
  code: CODE_P2P_CIRCUIT,
  name: 'p2p-circuit'
}, {
  code: CODE_MEMORY,
  name: 'memory',
  size: V
}]

codecs.forEach(codec => {
  registry.addCodec(codec.code, codec, codec.aliases)
})
