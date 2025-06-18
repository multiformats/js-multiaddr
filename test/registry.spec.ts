import { expect } from 'aegir/chai'
import { CODE_IP4, CODE_TCP, multiaddr, registry, V } from '../src/index.ts'
import type { ProtocolCodec } from '../src/registry.ts'

const protocol: ProtocolCodec = {
  code: 2059,
  name: 'custom-protocol',
  size: V
}

describe('registry', () => {
  afterEach(() => {
    registry.removeProtocol(protocol.code)
  })

  it('should allow adding custom protocols', () => {
    registry.addProtocol(protocol)

    const ma = multiaddr('/ip4/123.123.123.123/tcp/0/custom-protocol/hello')
    const ma2 = multiaddr(ma.toString())

    expect(ma2.getComponents()).to.deep.equal([{
      code: CODE_IP4,
      name: 'ip4',
      value: '123.123.123.123'
    }, {
      code: CODE_TCP,
      name: 'tcp',
      value: '0'
    }, {
      code: protocol.code,
      name: protocol.name,
      value: 'hello'
    }], 'did not round trip multiaddr with custom protocol to string and back')
  })

  it('should allow removing custom protocols', () => {
    registry.addProtocol(protocol)
    registry.removeProtocol(protocol.code)

    expect(() => {
      multiaddr('/ip4/123.123.123.123/tcp/0/custom-protocol/hello')
    }).to.throw()
      .with.property('name', 'UnknownProtocolError')
  })
})
