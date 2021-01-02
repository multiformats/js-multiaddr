// Explains to Typescript that 'dns.js' exports
// a class that has the same properties as Resolver
type DNSResolver = typeof import('dns').promises.Resolver

declare var Resolver: DNSResolver

export { Resolver }