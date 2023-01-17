/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { toBytes, toString } from '../src/ip.js'

describe('ip', () => {
  describe('toBytes', () => {
    it('should handle extra characters', () => {
      const address = '127.0.0.1 '
      const bytes = toBytes(address)

      expect(toString(bytes)).to.equal(address.trim())
    })

    it('should turn loopback into bytes', () => {
      const address = '127.0.0.1'
      const bytes = toBytes(address)

      expect(toString(bytes)).to.equal(address)
    })

    it('should turn private address into bytes', () => {
      const address = '192.168.1.1'
      const bytes = toBytes(address)

      expect(toString(bytes)).to.equal(address)
    })
  })
})
