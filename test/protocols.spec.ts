/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { getProtocol } from '../src/protocols-table.js'

describe('protocols', () => {
  describe('throws on non existent protocol', () => {
    it('number', () => {
      expect(
        () => getProtocol(1234)
      ).to.throw(
        /no protocol with code/
      )
    })

    it('string', () => {
      expect(
        () => getProtocol('hello')
      ).to.throw(
        /no protocol with name/
      )
    })

    it('else', () => {
      expect(
        // @ts-expect-error incorrect parameters
        () => getProtocol({ hi: 34 })
      ).to.throw(
        /invalid protocol id type/
      )
    })
  })
})
