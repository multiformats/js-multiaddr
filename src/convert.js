'use strict'

var ip = require('ip')
var protocols = require('./protocols')
var bs58 = require('bs58')
var varint = require('varint')

module.exports = Convert

// converts (serializes) addresses
function Convert (proto, a) {
  if (a instanceof Buffer) {
    return Convert.toString(proto, a)
  } else {
    return Convert.toBuffer(proto, a)
  }
}

Convert.toString = function convertToString (proto, buf) {
  proto = protocols(proto)
  switch (proto.code) {
    case 4: // ipv4
    case 41: // ipv6
      return ip.toString(buf)

    case 6: // tcp
    case 17: // udp
    case 33: // dccp
    case 132: // sctp
      return buf2port(buf)

    case 421: // ipfs
      return buf2mh(buf)
    default:
      return buf.toString('hex') // no clue. convert to hex
  }
}

Convert.toBuffer = function convertToBuffer (proto, str) {
  proto = protocols(proto)
  switch (proto.code) {
    case 4: // ipv4
    case 41: // ipv6
      return ip.toBuffer(str)

    case 6: // tcp
    case 17: // udp
    case 33: // dccp
    case 132: // sctp
      return port2buf(parseInt(str, 10))

    case 421: // ipfs
      return mh2buf(str)
    default:
      return new Buffer(str, 'hex') // no clue. convert from hex
  }
}

function port2buf (port) {
  var buf = new Buffer(2)
  buf.writeUInt16BE(port, 0)
  return buf
}

function buf2port (buf) {
  return buf.readUInt16BE(0)
}

function mh2buf (hash) {
  // the address is a varint prefixed multihash string representation
  const mh = new Buffer(bs58.decode(hash))
  const size = new Buffer(varint.encode(mh.length))
  return Buffer.concat([size, mh])
}

function buf2mh (buf) {
  const size = varint.decode(buf)
  const address = buf.slice(varint.decode.bytes)

  if (address.length !== size) {
    throw new Error('inconsistent lengths')
  }

  return bs58.encode(address)
}
