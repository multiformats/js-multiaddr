var test = require('tape')
var bufeq = require('buffer-equal')
var m = require('./')

test('construction', function(t) {
  var a = m('/ip4/127.0.0.1/udp/1234')
  t.ok(m('/ip4/127.0.0.1/udp/1234') instanceof m, 'construction')
  t.ok(m(a) !== a, 're-construct should copy')

  // reconstruct with buffer
  t.ok(m(a.buffer).buffer !== a.buffer, 're-construct should copy')
  t.ok(bufeq(m(a.buffer).buffer, a.buffer), 're-construct should be equal buffer')

  // reconstruct with string
  t.ok(m(a.toString()).buffer !== a.buffer, 're-construct should copy')
  t.ok(bufeq(m(a.toString()).buffer, a.buffer), 're-construct should be equal buffer')

  // reconstruct with object
  t.ok(m(a).buffer !== a.buffer, 're-construct should copy')
  t.ok(bufeq(m(a).buffer, a.buffer), 're-construct should be equal buffer')

  // empty construct still works :)
  t.equal(m('').toString(), '/', 'construct empty works')

  t.end()
})

test('basic', function(t) {
  var s = '/ip4/127.0.0.1/udp/1234'
  var b = new Buffer('047f0000011104d2', 'hex')
  var a = m(s)
  t.equal(a.toString(), s, '.toString')
  t.ok(bufeq(a.buffer, b), '.buffer')

  t.deepEqual(a.protoCodes(), [4, 17], '.protoCodes')
  t.deepEqual(a.protoNames(), ['ip4', 'udp'], '.protoNames')
  t.deepEqual(a.protos(), [m.protocols.codes[4], m.protocols.codes[17]], '.protos')
  t.ok(a.protos()[0] !== m.protocols.codes[4], '.protos copies')

  var b = a.encapsulate('/udp/5678')
  t.equal(b.toString(), '/ip4/127.0.0.1/udp/1234/udp/5678', '.encapsulate')
  t.equal(b.decapsulate('/udp').toString(), '/ip4/127.0.0.1/udp/1234', '.decapsulate')
  t.equal(b.decapsulate('/ip4').toString(), '/', '.decapsulate')
  t.throws(function() { a.decapsulate('/').toString()}, undefined, '.decapsulate / throws')
  t.equal(m('/').encapsulate(a).toString(), a.toString(), '.encapsulate empty works')
  t.equal(m('/').decapsulate('/').toString(), '/', '.decapsulate empty works')

  t.end()
})

