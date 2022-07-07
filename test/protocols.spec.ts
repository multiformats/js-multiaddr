/* eslint-env mocha */
import { getProtocol } from '../src/protocols-table.js'
import { expect } from 'aegir/chai'

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
        // @ts-expect-error
        () => getProtocol({ hi: 34 })
      ).to.throw(
        /invalid protocol id type/
      )
    })
  })
})
