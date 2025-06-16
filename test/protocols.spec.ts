/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { protocols } from '../src/index.js'

describe('protocols', () => {
  describe('throws on non existent protocol', () => {
    it('number', () => {
      expect(
        () => protocols(1234)
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })

    it('string', () => {
      expect(
        () => protocols('hello')
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })

    it('else', () => {
      expect(
        // @ts-expect-error incorrect parameters
        () => protocols({ hi: 34 })
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })
  })
})
