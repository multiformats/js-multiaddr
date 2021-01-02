import Multiaddr from '../src'

const testStr = '/ip4/127.0.0.1'

export const maFromFunctionConstructor: Multiaddr = Multiaddr(testStr)

export const maFromClassConstructor: Multiaddr = new Multiaddr(testStr)

export const maFromMa: Multiaddr = Multiaddr(new Multiaddr(testStr))

export const maFromConstructorFunction: Multiaddr = Multiaddr.fromNodeAddress(
  {
    family: 'IPv4',
    address: '127.0.0.1',
    port: '12345'
  },
  'udp'
)

export function doSthWithMa (ma: Multiaddr): void {
  ma.toOptions()
}
