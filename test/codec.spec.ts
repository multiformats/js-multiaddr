/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { componentsToString, stringToComponents } from '../src/components.ts'
import { CODE_HTTP, CODE_HTTP_PATH, CODE_IP4, CODE_UNIX, CODE_UTP } from '../src/constants.ts'
import type { Component } from '../src/index.js'

interface TestCase {
  name: string
  input: string
  components: Component[]
}

describe('codec', () => {
  describe('.stringToComponents', () => {
    it('throws on invalid addresses', () => {
      expect(
        () => stringToComponents('/ip4/0.0.0.0/ip4')
      ).to.throw()
        .with.property('name', 'InvalidMultiaddrError')
    })

    const testCases: TestCase[] = [{
      name: 'handles non array tuples',
      input: '/ip4/0.0.0.0/utp',
      components: [{
        code: CODE_IP4,
        name: 'ip4',
        value: '0.0.0.0'
      }, {
        code: CODE_UTP,
        name: 'utp'
      }]
    }, {
      name: 'handle not null path',
      input: '/unix/tmp%2Fp2p.sock',
      components: [{
        code: CODE_UNIX,
        name: 'unix',
        value: '/tmp/p2p.sock'
      }]
    }, {
      name: 'handle http path',
      input: '/ip4/123.123.123.123/http/http-path/foo%2Findex.html',
      components: [{
        code: CODE_IP4,
        name: 'ip4',
        value: '123.123.123.123'
      }, {
        code: CODE_HTTP,
        name: 'http'
      }, {
        code: CODE_HTTP_PATH,
        name: 'http-path',
        value: '/foo/index.html'
      }]
    }]

    for (const { name, input, components } of testCases) {
      it(name, () => {
        expect(stringToComponents(input)).to.deep.equal(components)
      })
    }

    it('throws on invalid addresses', () => {
      expect(
        () => stringToComponents('/ip4/0.0.0.0/ip4')
      ).to.throw()
        .with.property('name', 'InvalidMultiaddrError')
    })
  })

  describe('.componentsToString', () => {
    it('throws on invalid address', () => {
      expect(
        () => componentsToString([{
          code: 123,
          name: 'non-existant',
          value: 'non-existant'
        }])
      ).to.throw()
        .with.property('name', 'InvalidProtocolError')
    })
  })
})
