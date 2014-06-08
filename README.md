# node-multiaddr

[multiaddr](https://github.com/jbenet/multiaddr) implementation in node.

### ~~ WIP ~~

## Example

### Simple

```js
var multiaddr = require('multiaddr')
var addr = multiaddr("/ip4/127.0.0.1/udp/1234")
// <Multiaddr /ip4/127.0.0.1/udp/1234>
addr.buffer()
// <Buffer >
addr.string()
// /ip4/127.0.0.1/udp/1234

// construct with Buffer
addr = multiaddr(addr.buffer())
// <Multiaddr /ip4/127.0.0.1/udp/1234>
```

### Protocols

```
// get the multiaddr protocol codes
addr.protoCodes()
// [4, 6]

// get the multiaddr protocol string codes
addr.protoNames()
// ['ip4', 'tcp']

// get the multiaddr protocol "formal" string names
addr.protoNamesFormal()
// ['IPv4', 'TCP']
```

### Other formats

```js
// get a node friendly address object
addr.nodeAddress()
// {family: "IPv4", port:1234, address: "127.0.0.1"} - note no UDP :(

// handles the stupid string version too
addr = multiaddr.fromStupidString("udp4://127.0.0.1:8080")
// <Multiaddr /ip4/127.0.0.1/udp/8080>
addr.toStupidString(buf)
// udp4://127.0.0.1:8000
```

### En/decapsulate

```js
var addr2 = addr.encapsulate('/sctp/')
```

### Tunneling

Multiaddr allows expressing tunnels very nicely.

```js
var printer = multiaddr('/ip4/192.168.0.13/tcp/80')
var proxy = multiaddr('/ip4/10.20.30.40/tcp/443')
var printerOverProxy = proxy.encapsulate(laptop)
// <Multiaddr /ip4/10.20.30.40/tcp/443/ip4/192.168.0.13/tcp/80>
```
