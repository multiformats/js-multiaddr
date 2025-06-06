# multiaddr Benchmark

Benchmarks multiaddr performance during common operations - parsing strings,
encapsulating/decapsulating addresses, turning to bytes, decoding bytes, etc.

## Running the benchmarks

```console
% npm start

> benchmarks-add-dir@1.0.0 start
> npm run build && node dist/src/index.js


> benchmarks-add-dir@1.0.0 build
> aegir build --bundle false

[06:10:56] tsc [started]
[06:10:56] tsc [completed]
┌─────────┬──────────────────────────────────┬─────────────┬────────┬───────┬────────┐
│ (index) │ Implementation                   │ ops/s       │ ms/op  │ runs  │ p99    │
├─────────┼──────────────────────────────────┼─────────────┼────────┼───────┼────────┤
│ 0       │ 'head'                           │ '105679.89' │ '0.01' │ 50000 │ '0.01' │
│ 1       │ '@multiformats/multiaddr@12.4.0' │ '18244.31'  │ '0.06' │ 50000 │ '0.13' │
└─────────┴──────────────────────────────────┴─────────────┴────────┴───────┴────────┘
```
