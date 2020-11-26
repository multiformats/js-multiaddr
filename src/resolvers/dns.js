'use strict'

/** @type {typeof import('dns').promises.Resolver} */
let dns

try {
  dns = require('dns').promises.Resolver
  if (!dns) {
    throw new Error('no dns available')
  }
} catch (err) {
  dns = require('dns-over-http-resolver')
}

module.exports = dns
