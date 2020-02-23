import Multiaddr from "../src";

const testStr: string = "/ip4/127.0.0.1";

const maFromFunctionConstructor: Multiaddr = Multiaddr(testStr);

const maFromClassConstructor: Multiaddr = new Multiaddr(testStr);

const maFromMa: Multiaddr = Multiaddr(new Multiaddr(testStr));

const maFromConstructorFunction: Multiaddr = Multiaddr.fromNodeAddress(
  {
    family: "IPv4",
    address: "127.0.0.1",
    port: "12345"
  },
  "udp"
);

function doSthWithMa(ma: Multiaddr): void {
  ma.toOptions();
}
