'use strict'

const { Multiaddr } = require('../src')
// eslint-disable-next-line no-console
const log = console.log

const addr = new Multiaddr('/ip4/127.0.0.1/udp/1234')
log(addr)
log(addr.bytes)
log(addr.toString())
log(new Multiaddr(addr.bytes))

log(addr.protoCodes())
log(addr.protoNames())
log(addr.protos())

log(addr.nodeAddress())
log(Multiaddr.fromNodeAddress(addr.nodeAddress(), 'udp'))

log(addr.encapsulate('/sctp/5678'))
log(addr.decapsulate('/udp'))

const printer = new Multiaddr('/ip4/192.168.0.13/tcp/80')
const proxy = new Multiaddr('/ip4/10.20.30.40/tcp/443')
const printerOverProxy = proxy.encapsulate(printer)
log(printerOverProxy)

const proxyAgain = printerOverProxy.decapsulate('/ip4')
log(proxyAgain)
