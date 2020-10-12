'use strict'

const Multiaddr = require('..') // eslint-disable-line  no-unused-vars

/**
 * Resolver for dnsaddr addresses.
 *
 * @param {Multiaddr} addr
 * @returns {Promise<Array<string>>}
 */
async function dnsaddrResolver (addr) {
  const { Resolver } = require('./dns')
  const resolver = new Resolver()

  const peerId = addr.getPeerId()
  const hostname = addr.toString().split('dnsaddr')[1].split('/')[1]

  const records = await resolver.resolveTxt(`_dnsaddr.${hostname}`)
  // @ts-ignore
  let addresses = records.flat().map((a) => a.split('=')[1])

  if (peerId) {
    addresses = addresses.filter((entry) => entry.includes(peerId))
  }

  return addresses
}

module.exports = {
  dnsaddrResolver
}
