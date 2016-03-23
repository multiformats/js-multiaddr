/* eslint-env mocha */
'use strict'

const convert = require('../src/convert')
const expect = require('chai').expect

describe('convert', () => {
  it('handles buffers', () => {
    expect(
      convert('ip4', new Buffer('c0a80001', 'hex'))
    ).to.be.eql(
      '192.168.0.1'
    )
  })

  it('handles strings', () => {
    expect(
      convert('ip4', '192.168.0.1')
    ).to.be.eql(
      new Buffer('c0a80001', 'hex')
    )
  })

  describe('.toBuffer', () => {
    it('defaults to hex conversion', () => {
      expect(
        convert.toBuffer('websockets', 'c0a80001')
      ).to.be.eql(
        new Buffer([192, 168, 0, 1])
      )
    })
  })
})
