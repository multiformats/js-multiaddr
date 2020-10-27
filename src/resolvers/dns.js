'use strict'

let dns

try {
  dns = require('dns').promises
} catch (err) {
  dns = require('dns-over-http-resolver')
}

module.exports = dns
