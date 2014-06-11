# node-multiaddr

[multiaddr](https://github.com/jbenet/multiaddr) implementation in node.

### ~~ WIP ~~

## Example

### Simple

```js
var multiaddr = require('multiaddr')
var addr = multiaddr("/ip4/127.0.0.1/udp/1234")
// <Multiaddr /ip4/127.0.0.1/udp/1234>
addr.buffer
// <Buffer >
addr.toString()
// /ip4/127.0.0.1/udp/1234

// construct with Buffer
addr = multiaddr(addr.buffer)
// <Multiaddr /ip4/127.0.0.1/udp/1234>
```

### Protocols

```js
// get the multiaddr protocol codes
addr.protoCodes()
// [4, 6]

// get the multiaddr protocol string codes
addr.protoNames()
// ['ip4', 'tcp']

// get the multiaddr protocol description objects
addr.protos()
// [{code: 4, name: 'ip4', size: 32},
//  {code: 17, name: 'udp', size: 16}]
```

### Other formats

```js
// get a node friendly address object
addr.nodeAddress()
// {family: "IPv4", port:1234, address: "127.0.0.1"} - note no UDP :(

// handles the stupid string version too
addr = multiaddr.fromStupidString("udp4://127.0.0.1:1234")
// <Multiaddr /ip4/127.0.0.1/udp/1234>
addr.toStupidString(buf)
// udp4://127.0.0.1:1234
```

### En/decapsulate

```js
addr.encapsulate('/sctp/5678')
// <Multiaddr /ip4/127.0.0.1/udp/1234/sctp/5678>
addr.decapsulate('/udp') // up to + inc last occurrence of this subaddr
// <Multiaddr /ip4/127.0.0.1>
```

### Tunneling

Multiaddr allows expressing tunnels very nicely.

```js
var printer = multiaddr('/ip4/192.168.0.13/tcp/80')
var proxy = multiaddr('/ip4/10.20.30.40/tcp/443')
var printerOverProxy = proxy.encapsulate(printer)
// <Multiaddr /ip4/10.20.30.40/tcp/443/ip4/192.168.0.13/tcp/80>

var proxyAgain = printerOverProxy.decapsulate('/ip4')
// <Multiaddr /ip4/10.20.30.40/tcp/443>
```
