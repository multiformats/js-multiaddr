/* eslint-env mocha */
'use strict'

const protocols = require('../src/protocols-table')
const { expect } = require('aegir/utils/chai')

describe('protocols', () => {
  describe('throws on non existent protocol', () => {
    it('number', () => {
      expect(
        () => protocols(1234)
      ).to.throw(
        /no protocol with code/
      )
    })

    it('string', () => {
      expect(
        () => protocols('hello')
      ).to.throw(
        /no protocol with name/
      )
    })

    it('else', () => {
      expect(
        // @ts-expect-error
        () => protocols({ hi: 34 })
      ).to.throw(
        /invalid protocol id type/
      )
    })
  })
})
