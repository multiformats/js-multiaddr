## [12.3.5](https://github.com/multiformats/js-multiaddr/compare/v12.3.4...v12.3.5) (2025-02-05)

### Bug Fixes

* constrain options transport to tcp or udp ([#396](https://github.com/multiformats/js-multiaddr/issues/396)) ([8d5b325](https://github.com/multiformats/js-multiaddr/commit/8d5b32526f24e07ab167c33804be5608a51c8a99))
* use named error when parsing multiaddrs ([#395](https://github.com/multiformats/js-multiaddr/issues/395)) ([5a9d33c](https://github.com/multiformats/js-multiaddr/commit/5a9d33c5e29d11a17729200c0e5722f0a2030340))

### Dependencies

* **dev:** bump sinon from 18.0.1 to 19.0.2 ([#387](https://github.com/multiformats/js-multiaddr/issues/387)) ([e1747b7](https://github.com/multiformats/js-multiaddr/commit/e1747b792c87a9801e8f3532d15e492ae4d9c72e))

## [12.3.4](https://github.com/multiformats/js-multiaddr/compare/v12.3.3...v12.3.4) (2024-12-03)

### Bug Fixes

* handle valid CIDR ranges for IPv4 and IPv6 ([#394](https://github.com/multiformats/js-multiaddr/issues/394)) ([1513768](https://github.com/multiformats/js-multiaddr/commit/1513768012ea30f31e86c0b65e4f2c04c91d2736))

## [12.3.3](https://github.com/multiformats/js-multiaddr/compare/v12.3.2...v12.3.3) (2024-11-21)

### Dependencies

* **dev:** bump aegir from 44.1.4 to 45.0.2 ([#390](https://github.com/multiformats/js-multiaddr/issues/390)) ([d0d8db4](https://github.com/multiformats/js-multiaddr/commit/d0d8db4ebc48a1299539b5f42c0592bfaa6d07e0))

## [12.3.2](https://github.com/multiformats/js-multiaddr/compare/v12.3.1...v12.3.2) (2024-11-21)

### Bug Fixes

* do not allow modifying tuples ([#391](https://github.com/multiformats/js-multiaddr/issues/391)) ([77f15d2](https://github.com/multiformats/js-multiaddr/commit/77f15d29b07e7b7e2fb9e3ef39cd0e1da0982388))

### Documentation

* fix dnsaddrResolver name ([#392](https://github.com/multiformats/js-multiaddr/issues/392)) ([823b45f](https://github.com/multiformats/js-multiaddr/commit/823b45fc786d0603f3260b9de4c7694dbe91533a)), closes [#388](https://github.com/multiformats/js-multiaddr/issues/388)

## [12.3.1](https://github.com/multiformats/js-multiaddr/compare/v12.3.0...v12.3.1) (2024-09-09)

### Bug Fixes

* use named error instead of CodeError ([#385](https://github.com/multiformats/js-multiaddr/issues/385)) ([a0bc8f9](https://github.com/multiformats/js-multiaddr/commit/a0bc8f90384e3f2a8c6199da2a740cf6971db14b))

### Dependencies

* **dev:** bump aegir from 43.0.3 to 44.1.1 ([#384](https://github.com/multiformats/js-multiaddr/issues/384)) ([408ba5a](https://github.com/multiformats/js-multiaddr/commit/408ba5ab2a8191da74509415f89dacc024135fc9))

## [12.3.0](https://github.com/multiformats/js-multiaddr/compare/v12.2.3...v12.3.0) (2024-06-05)


### Features

* add support for http-path ([#380](https://github.com/multiformats/js-multiaddr/issues/380)) ([0524f79](https://github.com/multiformats/js-multiaddr/commit/0524f7901f7dc813463cf19e45bbd62bf581fb38))


### Dependencies

* **dev:** bump aegir from 42.2.11 to 43.0.1 ([#379](https://github.com/multiformats/js-multiaddr/issues/379)) ([371f58d](https://github.com/multiformats/js-multiaddr/commit/371f58dc7a7b9b10e6017dbac160975a11cc28a3))

## [12.2.3](https://github.com/multiformats/js-multiaddr/compare/v12.2.2...v12.2.3) (2024-05-17)


### Bug Fixes

* handle quotes in dnsaddr results ([#378](https://github.com/multiformats/js-multiaddr/issues/378)) ([b438d3d](https://github.com/multiformats/js-multiaddr/commit/b438d3dfc6f9fa09b19252f9029fbe5dac41dbb3))

## [12.2.2](https://github.com/multiformats/js-multiaddr/compare/v12.2.1...v12.2.2) (2024-05-17)


### Trivial Changes

* add test for never-ending recursion ([#375](https://github.com/multiformats/js-multiaddr/issues/375)) ([59309b0](https://github.com/multiformats/js-multiaddr/commit/59309b0c4dd0d96ab2d7e3f241db0ffaf3c1d220))


### Dependencies

* **dev:** bump sinon from 17.0.2 to 18.0.0 ([#377](https://github.com/multiformats/js-multiaddr/issues/377)) ([f1adf0f](https://github.com/multiformats/js-multiaddr/commit/f1adf0fb1da88449ccd5710f126e994c6e00ce3d))

## [12.2.1](https://github.com/multiformats/js-multiaddr/compare/v12.2.0...v12.2.1) (2024-03-13)


### Bug Fixes

* remove unused dep ([#374](https://github.com/multiformats/js-multiaddr/issues/374)) ([16e8a75](https://github.com/multiformats/js-multiaddr/commit/16e8a75e074fc9462b81fe58f062dec7175f5fc9))

## [12.2.0](https://github.com/multiformats/js-multiaddr/compare/v12.1.14...v12.2.0) (2024-03-11)


### Features

* accept DNS resolver when resolving DNSADDR addresses ([#373](https://github.com/multiformats/js-multiaddr/issues/373)) ([9b2df99](https://github.com/multiformats/js-multiaddr/commit/9b2df992c067cecc80e6290ccba34e30291b9617))


### Trivial Changes

* add or force update .github/workflows/js-test-and-release.yml ([#371](https://github.com/multiformats/js-multiaddr/issues/371)) ([f61dec7](https://github.com/multiformats/js-multiaddr/commit/f61dec7a498f63de9c0943ce54d6694e578ca16a))
* update project ([#372](https://github.com/multiformats/js-multiaddr/issues/372)) ([9ce73b2](https://github.com/multiformats/js-multiaddr/commit/9ce73b2a950c904095f367f059ea087574302d77))

## [12.1.14](https://github.com/multiformats/js-multiaddr/compare/v12.1.13...v12.1.14) (2024-01-24)


### Dependencies

* bump dns-over-http-resolver from 3.0.0 to 3.0.2 ([#366](https://github.com/multiformats/js-multiaddr/issues/366)) ([ffb674c](https://github.com/multiformats/js-multiaddr/commit/ffb674ce7065aebd0a71caba60356177b0cf51a1))

## [12.1.13](https://github.com/multiformats/js-multiaddr/compare/v12.1.12...v12.1.13) (2024-01-24)


### Dependencies

* **dev:** bump aegir from 41.3.5 to 42.2.2 ([#369](https://github.com/multiformats/js-multiaddr/issues/369)) ([9eb2904](https://github.com/multiformats/js-multiaddr/commit/9eb2904ef7ad4e6185cfbb133a72ceb62818993d))

## [12.1.12](https://github.com/multiformats/js-multiaddr/compare/v12.1.11...v12.1.12) (2023-12-28)


### Trivial Changes

* update .github/workflows/js-test-and-release.yml ([#358](https://github.com/multiformats/js-multiaddr/issues/358)) ([ca07127](https://github.com/multiformats/js-multiaddr/commit/ca071273566b25b8e0afba0cba0ea3e7f0343f10))


### Dependencies

* bump multiformats from 12.1.3 to 13.0.0 ([#360](https://github.com/multiformats/js-multiaddr/issues/360)) ([d807310](https://github.com/multiformats/js-multiaddr/commit/d80731039a00c740a11da8db9f9f172c6ee28b01))
* bump uint8arrays from 4.0.10 to 5.0.0 ([#359](https://github.com/multiformats/js-multiaddr/issues/359)) ([53c0c1c](https://github.com/multiformats/js-multiaddr/commit/53c0c1c79ab62be09f4f1f4c1f4024203e033d62))

## [12.1.11](https://github.com/multiformats/js-multiaddr/compare/v12.1.10...v12.1.11) (2023-11-30)


### Trivial Changes

* update branch name ([7d0cfd7](https://github.com/multiformats/js-multiaddr/commit/7d0cfd7e0add12ca28d6fc8c139f9573afc4c3c1))


### Dependencies

* bump @libp2p/interface from 0.1.6 to 1.0.0 ([#357](https://github.com/multiformats/js-multiaddr/issues/357)) ([bb58351](https://github.com/multiformats/js-multiaddr/commit/bb58351496a892e1fbd4acacef39d03058abfdc1))

## [12.1.10](https://github.com/multiformats/js-multiaddr/compare/v12.1.9...v12.1.10) (2023-11-06)


### Dependencies

* bump dns-over-http-resolver to 3.0.0 ([#354](https://github.com/multiformats/js-multiaddr/issues/354)) ([f20e553](https://github.com/multiformats/js-multiaddr/commit/f20e55387f474f3860a51f77454afbfca32936e1))

## [12.1.9](https://github.com/multiformats/js-multiaddr/compare/v12.1.8...v12.1.9) (2023-11-06)


### Bug Fixes

* use Multiaddr as class name ([#352](https://github.com/multiformats/js-multiaddr/issues/352)) ([35348cd](https://github.com/multiformats/js-multiaddr/commit/35348cd0a91f3c8fe1d88fadc57d7db1201b83c4))

## [12.1.8](https://github.com/multiformats/js-multiaddr/compare/v12.1.7...v12.1.8) (2023-10-26)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.0.11 ([#351](https://github.com/multiformats/js-multiaddr/issues/351)) ([7de4e23](https://github.com/multiformats/js-multiaddr/commit/7de4e231c6e02bb5ff41c760833001d072e4bfd0))
* **dev:** bump sinon from 15.2.0 to 17.0.0 ([#348](https://github.com/multiformats/js-multiaddr/issues/348)) ([b229e64](https://github.com/multiformats/js-multiaddr/commit/b229e64bdec7897e5840c329b02faa407148e0bb))

## [12.1.7](https://github.com/multiformats/js-multiaddr/compare/v12.1.6...v12.1.7) (2023-08-16)


### Trivial Changes

* add or force update .github/workflows/js-test-and-release.yml ([#336](https://github.com/multiformats/js-multiaddr/issues/336)) ([9e786a0](https://github.com/multiformats/js-multiaddr/commit/9e786a0beaeac2044b5b80139b6090ddd7d1763d))
* delete templates [skip ci] ([#335](https://github.com/multiformats/js-multiaddr/issues/335)) ([853d432](https://github.com/multiformats/js-multiaddr/commit/853d4328e31f2c1d7c5858203bc752c8d7bbfa9d))


### Dependencies

* switch varint for uint8-varint ([#337](https://github.com/multiformats/js-multiaddr/issues/337)) ([166fd43](https://github.com/multiformats/js-multiaddr/commit/166fd43d80c2f7f5061a36d0381582d5ffd5b158))

## [12.1.6](https://github.com/multiformats/js-multiaddr/compare/v12.1.5...v12.1.6) (2023-08-05)


### Dependencies

* switch to @libp2p/interface ([#334](https://github.com/multiformats/js-multiaddr/issues/334)) ([bb14cb2](https://github.com/multiformats/js-multiaddr/commit/bb14cb22df933727599948a8817d44992929ac6e))

## [12.1.5](https://github.com/multiformats/js-multiaddr/compare/v12.1.4...v12.1.5) (2023-07-28)


### Bug Fixes

* make getPeerId return the target peer id from relay addrs ([#325](https://github.com/multiformats/js-multiaddr/issues/325)) ([2b0e353](https://github.com/multiformats/js-multiaddr/commit/2b0e35325c9014db9c3c8aec915ff185dea2f786)), closes [#319](https://github.com/multiformats/js-multiaddr/issues/319)

## [12.1.4](https://github.com/multiformats/js-multiaddr/compare/v12.1.3...v12.1.4) (2023-07-28)


### Bug Fixes

* precalculate multiaddr parts ([#330](https://github.com/multiformats/js-multiaddr/issues/330)) ([cf7e9c6](https://github.com/multiformats/js-multiaddr/commit/cf7e9c6dfffe8c5c2a9120d85a56465e3c856314)), closes [#329](https://github.com/multiformats/js-multiaddr/issues/329)


### Trivial Changes

* update project config ([#326](https://github.com/multiformats/js-multiaddr/issues/326)) ([76fa6f5](https://github.com/multiformats/js-multiaddr/commit/76fa6f57b842010c2f74fffdca35b9a1435dbab9))


### Documentation

* import from @multiformats/multiaddr ([#327](https://github.com/multiformats/js-multiaddr/issues/327)) ([4dedd4b](https://github.com/multiformats/js-multiaddr/commit/4dedd4bf6eeea9aa9847db6affe43b2b003fbee7))


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#328](https://github.com/multiformats/js-multiaddr/issues/328)) ([07d4f8a](https://github.com/multiformats/js-multiaddr/commit/07d4f8ad77f381e0ec7633bdfc9f6de34b818279))
* **dev:** bump aegir from 39.0.13 to 40.0.2 ([#333](https://github.com/multiformats/js-multiaddr/issues/333)) ([3480741](https://github.com/multiformats/js-multiaddr/commit/34807412911acbb4532620260f4144c179642aad))

## [12.1.3](https://github.com/multiformats/js-multiaddr/compare/v12.1.2...v12.1.3) (2023-05-11)


### Dependencies

* **dev:** bump aegir from 38.1.8 to 39.0.6 ([#324](https://github.com/multiformats/js-multiaddr/issues/324)) ([8a84847](https://github.com/multiformats/js-multiaddr/commit/8a84847ee0272b9a324e96467a38570c858e25eb))

## [12.1.2](https://github.com/multiformats/js-multiaddr/compare/v12.1.1...v12.1.2) (2023-04-14)


### Bug Fixes

* only compute path on first getPath() call ([#318](https://github.com/multiformats/js-multiaddr/issues/318)) ([9fd631f](https://github.com/multiformats/js-multiaddr/commit/9fd631f5b521b61f04a642f6b2a710a02ff20e94)), closes [/github.com/libp2p/js-libp2p-tcp/pull/264#issuecomment-1503473722](https://github.com/multiformats//github.com/libp2p/js-libp2p-tcp/pull/264/issues/issuecomment-1503473722)

## [12.1.1](https://github.com/multiformats/js-multiaddr/compare/v12.1.0...v12.1.1) (2023-04-05)


### Bug Fixes

* replace err-code with CodeError ([#317](https://github.com/multiformats/js-multiaddr/issues/317)) ([cb5ff5f](https://github.com/multiformats/js-multiaddr/commit/cb5ff5f8c972f591f4fec36e1489f8e1b0c4c39a))

## [12.1.0](https://github.com/multiformats/js-multiaddr/compare/v12.0.0...v12.1.0) (2023-03-21)


### Features

* add multiaddr filter function ([#305](https://github.com/multiformats/js-multiaddr/issues/305)) ([bcd3cb5](https://github.com/multiformats/js-multiaddr/commit/bcd3cb5c30b7b93db707d9ac7d697b455f0a8a90))

## [12.0.0](https://github.com/multiformats/js-multiaddr/compare/v11.6.1...v12.0.0) (2023-03-17)


### ⚠ BREAKING CHANGES

* webrtc has been renamed webrtc-direct and webrtc-w3c has been renamed webrtc

### Bug Fixes

* Rename webrtc to webrtc-direct and webrtc-w3c to webrtc ([#314](https://github.com/multiformats/js-multiaddr/issues/314)) ([fc33ac8](https://github.com/multiformats/js-multiaddr/commit/fc33ac8bb483d29b51cf3e7da1f4a5f134cc45cb))

## [11.6.1](https://github.com/multiformats/js-multiaddr/compare/v11.6.0...v11.6.1) (2023-03-09)


### Bug Fixes

* survive bad dns record ([#313](https://github.com/multiformats/js-multiaddr/issues/313)) ([1f7f2a0](https://github.com/multiformats/js-multiaddr/commit/1f7f2a0a79671486c893bc023737010d68c9b271))

## [11.6.0](https://github.com/multiformats/js-multiaddr/compare/v11.5.0...v11.6.0) (2023-03-06)


### Features

* Add SNI support ([#312](https://github.com/multiformats/js-multiaddr/issues/312)) ([b44f608](https://github.com/multiformats/js-multiaddr/commit/b44f6086f0eccb8480c7360cf86f047882c0f56a))

## [11.5.0](https://github.com/multiformats/js-multiaddr/compare/v11.4.0...v11.5.0) (2023-03-03)


### Features

* Add webrtc-w3c protocol for browser to browser ([#309](https://github.com/multiformats/js-multiaddr/issues/309)) ([16232d5](https://github.com/multiformats/js-multiaddr/commit/16232d521e13bd2e36d96932316aa86385bdebff))

## [11.4.0](https://github.com/multiformats/js-multiaddr/compare/v11.3.0...v11.4.0) (2023-01-30)


### Features

* add TLS to protocols-table ([#306](https://github.com/multiformats/js-multiaddr/issues/306)) ([50bb433](https://github.com/multiformats/js-multiaddr/commit/50bb4332cafb1fbfd4e7e21be6fcaf42252deb73))

## [11.3.0](https://github.com/multiformats/js-multiaddr/compare/v11.2.0...v11.3.0) (2023-01-17)


### Features

* support ip6zone ([#226](https://github.com/multiformats/js-multiaddr/issues/226)) ([cfacedb](https://github.com/multiformats/js-multiaddr/commit/cfacedb1fbee772eab2fdb443a25b4d90c5ffc1f)), closes [#134](https://github.com/multiformats/js-multiaddr/issues/134)

## [11.2.0](https://github.com/multiformats/js-multiaddr/compare/v11.1.5...v11.2.0) (2023-01-17)


### Features

* add ipcidr protocol ([#303](https://github.com/multiformats/js-multiaddr/issues/303)) ([fe760d3](https://github.com/multiformats/js-multiaddr/commit/fe760d31f45e547963b33185aa48d29cca8475af))


### Dependencies

* **dev:** bump aegir from 37.12.1 to 38.1.0 ([#302](https://github.com/multiformats/js-multiaddr/issues/302)) ([534d8fa](https://github.com/multiformats/js-multiaddr/commit/534d8fa0da2c1c1d1c61b92aa8deb75edc07619e))

## [11.1.5](https://github.com/multiformats/js-multiaddr/compare/v11.1.4...v11.1.5) (2023-01-06)


### Dependencies

* bump multiformats from 10.0.3 to 11.0.0 ([#301](https://github.com/multiformats/js-multiaddr/issues/301)) ([f52b85a](https://github.com/multiformats/js-multiaddr/commit/f52b85a1a3497bf4ece049959babd1045917d052)), closes [#234](https://github.com/multiformats/js-multiaddr/issues/234) [#226](https://github.com/multiformats/js-multiaddr/issues/226) [#234](https://github.com/multiformats/js-multiaddr/issues/234) [#226](https://github.com/multiformats/js-multiaddr/issues/226) [#226](https://github.com/multiformats/js-multiaddr/issues/226)


### Documentation

* update readme ([6f1df24](https://github.com/multiformats/js-multiaddr/commit/6f1df24476af0aad2e2419a2a6cf31227d506daf))

## [11.1.4](https://github.com/multiformats/js-multiaddr/compare/v11.1.3...v11.1.4) (2022-12-16)


### Bug Fixes

* update CI badge link ([#300](https://github.com/multiformats/js-multiaddr/issues/300)) ([111c28d](https://github.com/multiformats/js-multiaddr/commit/111c28d169029e806bc0c4d03d3dbf28911baa9c))

## [11.1.3](https://github.com/multiformats/js-multiaddr/compare/v11.1.2...v11.1.3) (2022-12-14)


### Documentation

* remove redundant block ([#298](https://github.com/multiformats/js-multiaddr/issues/298)) ([864a30a](https://github.com/multiformats/js-multiaddr/commit/864a30ad18ed611597a065c29e762af781e33e4c))

## [11.1.2](https://github.com/multiformats/js-multiaddr/compare/v11.1.1...v11.1.2) (2022-12-14)


### Bug Fixes

* update project to build docs ([#297](https://github.com/multiformats/js-multiaddr/issues/297)) ([5bc66d4](https://github.com/multiformats/js-multiaddr/commit/5bc66d41f69ed45a3efe92a3388fb6d74b30d803))

## [11.1.1](https://github.com/multiformats/js-multiaddr/compare/v11.1.0...v11.1.1) (2022-12-13)


### Bug Fixes

* remove lockfile ([#296](https://github.com/multiformats/js-multiaddr/issues/296)) ([46452b3](https://github.com/multiformats/js-multiaddr/commit/46452b3f6e07515ab591b5eca03e79713d3552e2))

## [11.1.0](https://github.com/multiformats/js-multiaddr/compare/v11.0.12...v11.1.0) (2022-12-10)


### Features

* support /quic-v1 ([#294](https://github.com/multiformats/js-multiaddr/issues/294)) ([7d95ef8](https://github.com/multiformats/js-multiaddr/commit/7d95ef885e3858d3627879ef8021b543e883458d))

## [11.0.12](https://github.com/multiformats/js-multiaddr/compare/v11.0.11...v11.0.12) (2022-12-08)


### Bug Fixes

* update inspect format to be like CID class ([#290](https://github.com/multiformats/js-multiaddr/issues/290)) ([db032e9](https://github.com/multiformats/js-multiaddr/commit/db032e9c597cf91c44984fdc9293b883f4b9a628))


### Documentation

* update reamde with correct global namespace name ([#292](https://github.com/multiformats/js-multiaddr/issues/292)) ([fe36328](https://github.com/multiformats/js-multiaddr/commit/fe36328d300105ac5fb06bbc027bc3676ee73e1c))

## [11.0.11](https://github.com/multiformats/js-multiaddr/compare/v11.0.10...v11.0.11) (2022-12-08)


### Bug Fixes

* include minified bundle in npm tarball ([#291](https://github.com/multiformats/js-multiaddr/issues/291)) ([ac88cba](https://github.com/multiformats/js-multiaddr/commit/ac88cba167ba136d55d04f17ab0db01584d8ab3a))

## [11.0.10](https://github.com/multiformats/js-multiaddr/compare/v11.0.9...v11.0.10) (2022-12-07)


### Bug Fixes

* run docs after release otherwise version number is always wrong ([04e19e1](https://github.com/multiformats/js-multiaddr/commit/04e19e15b5bf24566fd077eb7bfb87a9274d25f6))

## [11.0.9](https://github.com/multiformats/js-multiaddr/compare/v11.0.8...v11.0.9) (2022-12-07)


### Documentation

* publish API docs to github pages on release ([#289](https://github.com/multiformats/js-multiaddr/issues/289)) ([c22e55f](https://github.com/multiformats/js-multiaddr/commit/c22e55f320ad8f2478b9d083cb3cddc7d6985b13))

## [11.0.8](https://github.com/multiformats/js-multiaddr/compare/v11.0.7...v11.0.8) (2022-12-07)


### Bug Fixes

* varint.decode.bytes can now be undefined according to types ([#288](https://github.com/multiformats/js-multiaddr/issues/288)) ([e0a59e5](https://github.com/multiformats/js-multiaddr/commit/e0a59e584623b08026e9179c37bfb4966d8dbfe8))


### Dependencies

* **dev:** bump sinon from 14.0.2 to 15.0.0 ([#287](https://github.com/multiformats/js-multiaddr/issues/287)) ([41f67a7](https://github.com/multiformats/js-multiaddr/commit/41f67a7b70baf1bb16ef336b218607342bf9d338))

## [11.0.7](https://github.com/multiformats/js-multiaddr/compare/v11.0.6...v11.0.7) (2022-11-02)


### Dependencies

* update @chainsafe/is-ip ([#281](https://github.com/multiformats/js-multiaddr/issues/281)) ([fc6b600](https://github.com/multiformats/js-multiaddr/commit/fc6b600a474f43fb15cf1bae2fb8f28401581e88)), closes [/github.com/ChainSafe/is-ip/pull/1#issuecomment-1295761316](https://github.com/multiformats//github.com/ChainSafe/is-ip/pull/1/issues/issuecomment-1295761316)

## [11.0.6](https://github.com/multiformats/js-multiaddr/compare/v11.0.5...v11.0.6) (2022-10-29)


### Bug Fixes

* use @chainsafe/is-ip ([#280](https://github.com/multiformats/js-multiaddr/issues/280)) ([40124ff](https://github.com/multiformats/js-multiaddr/commit/40124ffcdd52a4c88c4c246584230ca2f10533e3))

## [11.0.5](https://github.com/multiformats/js-multiaddr/compare/v11.0.4...v11.0.5) (2022-10-12)


### Dependencies

* bump uint8arrays from 3.x.x to 4.x.x ([#279](https://github.com/multiformats/js-multiaddr/issues/279)) ([4ef82ac](https://github.com/multiformats/js-multiaddr/commit/4ef82acb8a9c594c0c72d3ef46fbe7f281cc981e))

## [11.0.4](https://github.com/multiformats/js-multiaddr/compare/v11.0.3...v11.0.4) (2022-10-12)


### Dependencies

* bump multiformats from 9.9.0 to 10.0.0 ([#278](https://github.com/multiformats/js-multiaddr/issues/278)) ([767bcbe](https://github.com/multiformats/js-multiaddr/commit/767bcbec03603cfc26ad6d80bcee80b9beeb52f6))

## [11.0.3](https://github.com/multiformats/js-multiaddr/compare/v11.0.2...v11.0.3) (2022-09-30)


### Bug Fixes

* use private class field to store cached strings and tuples ([#277](https://github.com/multiformats/js-multiaddr/issues/277)) ([b0809bf](https://github.com/multiformats/js-multiaddr/commit/b0809bfd2a97c1fde7691dd092baaf00e0f3b886))

## [11.0.2](https://github.com/multiformats/js-multiaddr/compare/v11.0.1...v11.0.2) (2022-09-29)


### Bug Fixes

* cache string and tuple representations ([#275](https://github.com/multiformats/js-multiaddr/issues/275)) ([9b18ff4](https://github.com/multiformats/js-multiaddr/commit/9b18ff4ce03d975ba87d878d963dddc5690f102a))

## [11.0.1](https://github.com/multiformats/js-multiaddr/compare/v11.0.0...v11.0.1) (2022-09-27)


### Tests

* webtransport with certhash ([#276](https://github.com/multiformats/js-multiaddr/issues/276)) ([7b9950a](https://github.com/multiformats/js-multiaddr/commit/7b9950adbce39e0bc980e780a8e7595e66383407))

## [11.0.0](https://github.com/multiformats/js-multiaddr/compare/v10.5.0...v11.0.0) (2022-09-21)


### ⚠ BREAKING CHANGES

* the `Multiaddr` class is now an interface

### Features

* convert to interface ([#274](https://github.com/multiformats/js-multiaddr/issues/274)) ([36de98f](https://github.com/multiformats/js-multiaddr/commit/36de98fd531e5ee4df0f7f7848337f3890748341)), closes [#202](https://github.com/multiformats/js-multiaddr/issues/202)


### Bug Fixes

* fix converting strings to IP addresses and back again ([#270](https://github.com/multiformats/js-multiaddr/issues/270)) ([77f063a](https://github.com/multiformats/js-multiaddr/commit/77f063a41834153a94e7291fa9de74538305c251))

## [10.5.0](https://github.com/multiformats/js-multiaddr/compare/v10.4.3...v10.5.0) (2022-09-20)


### Features

* Add webtransport component ([#271](https://github.com/multiformats/js-multiaddr/issues/271)) ([210f156](https://github.com/multiformats/js-multiaddr/commit/210f156e53af8bb58944c7308fd7361c6ef35295))

## [10.4.3](https://github.com/multiformats/js-multiaddr/compare/v10.4.2...v10.4.3) (2022-09-12)


### Bug Fixes

* trim string before parsing IP address ([#269](https://github.com/multiformats/js-multiaddr/issues/269)) ([9924afa](https://github.com/multiformats/js-multiaddr/commit/9924afab4469c8a2b126664a8157f8da5cb0188a))

## [10.4.2](https://github.com/multiformats/js-multiaddr/compare/v10.4.1...v10.4.2) (2022-09-12)


### Bug Fixes

* more specific error messages ([#268](https://github.com/multiformats/js-multiaddr/issues/268)) ([db6bdfb](https://github.com/multiformats/js-multiaddr/commit/db6bdfbf9ffa8928fc041f9934c15a0da419b46a))

## [10.4.1](https://github.com/multiformats/js-multiaddr/compare/v10.4.0...v10.4.1) (2022-09-06)


### Bug Fixes

* dedupe toOptions/nodeAddress code ([#266](https://github.com/multiformats/js-multiaddr/issues/266)) ([de1d31c](https://github.com/multiformats/js-multiaddr/commit/de1d31cbff48d26d5f1bc3b78a093ba01af349a9))

## [10.4.0](https://github.com/multiformats/js-multiaddr/compare/v10.3.5...v10.4.0) (2022-08-30)


### Features

* add support for webrtc and certhash ([#261](https://github.com/multiformats/js-multiaddr/issues/261)) ([#262](https://github.com/multiformats/js-multiaddr/issues/262)) ([e5a8e27](https://github.com/multiformats/js-multiaddr/commit/e5a8e27fb526e3a58af5ebe8873f6cc67b9d4483))

## [10.3.5](https://github.com/multiformats/js-multiaddr/compare/v10.3.4...v10.3.5) (2022-08-30)


### Trivial Changes

* update project config ([#265](https://github.com/multiformats/js-multiaddr/issues/265)) ([4d3ba0c](https://github.com/multiformats/js-multiaddr/commit/4d3ba0cb0fad93189548e7e45d8322477eea1e5f))


### Dependencies

* bump is-ip from 4.0.0 to 5.0.0 ([#260](https://github.com/multiformats/js-multiaddr/issues/260)) ([3cd4699](https://github.com/multiformats/js-multiaddr/commit/3cd4699030a84767e3951646e1af253665a86890))

## [10.3.4](https://github.com/multiformats/js-multiaddr/compare/v10.3.3...v10.3.4) (2022-08-30)


### Bug Fixes

* specify return type of method to to fix linting ([#264](https://github.com/multiformats/js-multiaddr/issues/264)) ([e5f3bf6](https://github.com/multiformats/js-multiaddr/commit/e5f3bf6acb8fc537344b39dc392f15be9de309cd))

## [10.3.3](https://github.com/multiformats/js-multiaddr/compare/v10.3.2...v10.3.3) (2022-07-07)


### Bug Fixes

* return correct family from toOptions with dns4 MultiAddr ([#233](https://github.com/multiformats/js-multiaddr/issues/233)) ([d3f8b05](https://github.com/multiformats/js-multiaddr/commit/d3f8b05436542560330140afa430dddc3a83f327))

## [10.3.2](https://github.com/multiformats/js-multiaddr/compare/v10.3.1...v10.3.2) (2022-07-07)


### Bug Fixes

* use codes instead of strings for dnsaddr detection ([#259](https://github.com/multiformats/js-multiaddr/issues/259)) ([d8431bf](https://github.com/multiformats/js-multiaddr/commit/d8431bf80e38ec3dfdc5fa9b2947326b9c3385b4)), closes [#258](https://github.com/multiformats/js-multiaddr/issues/258)

## [10.3.1](https://github.com/multiformats/js-multiaddr/compare/v10.3.0...v10.3.1) (2022-07-07)


### Bug Fixes

* default to https ports for dnsaddr addresses ([#258](https://github.com/multiformats/js-multiaddr/issues/258)) ([e8bcff7](https://github.com/multiformats/js-multiaddr/commit/e8bcff74866c5484953d2215995a58844646db28))


### Dependencies

* **dev:** bump sinon from 13.0.2 to 14.0.0 ([#240](https://github.com/multiformats/js-multiaddr/issues/240)) ([3c2eaba](https://github.com/multiformats/js-multiaddr/commit/3c2eabaf7a6287e194097d57669af92f4fd599ab))

## [10.3.0](https://github.com/multiformats/js-multiaddr/compare/v10.2.1...v10.3.0) (2022-07-07)


### Features

* allow cancelling in-flight multiaddr resolve ([#257](https://github.com/multiformats/js-multiaddr/issues/257)) ([ddd751b](https://github.com/multiformats/js-multiaddr/commit/ddd751b51bf96b452b44943699dc9f316e32b8c4))

### [10.2.1](https://github.com/multiformats/js-multiaddr/compare/v10.2.0...v10.2.1) (2022-06-24)


### Bug Fixes

* support dns and dnsaddr ([#253](https://github.com/multiformats/js-multiaddr/issues/253)) ([53fb15f](https://github.com/multiformats/js-multiaddr/commit/53fb15f2a29a488722dde11c6331c684db283c63))

## [10.2.0](https://github.com/multiformats/js-multiaddr/compare/v10.1.8...v10.2.0) (2022-06-09)


### Features

* add convert subpath export ([#246](https://github.com/multiformats/js-multiaddr/issues/246)) ([c69283b](https://github.com/multiformats/js-multiaddr/commit/c69283b9c4a82f08c151e246f6bcd7b6806a2989))

### [10.1.8](https://github.com/multiformats/js-multiaddr/compare/v10.1.7...v10.1.8) (2022-03-21)


### Bug Fixes

* remove instanceof from multiaddr check ([#232](https://github.com/multiformats/js-multiaddr/issues/232)) ([5680412](https://github.com/multiformats/js-multiaddr/commit/56804124e5d3944e882ad515f654b8d027d58e20))

### [10.1.7](https://github.com/multiformats/js-multiaddr/compare/v10.1.6...v10.1.7) (2022-03-08)


### Bug Fixes

* fix table types ([#231](https://github.com/multiformats/js-multiaddr/issues/231)) ([4146dfa](https://github.com/multiformats/js-multiaddr/commit/4146dfa9e32d75dc4e6cb0ea1e0a9ebec038a060))

### [10.1.6](https://github.com/multiformats/js-multiaddr/compare/v10.1.5...v10.1.6) (2022-02-28)


### Bug Fixes

* export resolvers ([#229](https://github.com/multiformats/js-multiaddr/issues/229)) ([12e89a7](https://github.com/multiformats/js-multiaddr/commit/12e89a7e5775dfc837440eac9d0cb060555da364))
* infer type after isMultiaddr call ([#227](https://github.com/multiformats/js-multiaddr/issues/227)) ([0720e3a](https://github.com/multiformats/js-multiaddr/commit/0720e3ab0b497112020c139cfed61104cabee0bc))

### [10.1.5](https://github.com/multiformats/js-multiaddr/compare/v10.1.4...v10.1.5) (2022-02-07)


### Bug Fixes

* update deps ([#224](https://github.com/multiformats/js-multiaddr/issues/224)) ([d9ace95](https://github.com/multiformats/js-multiaddr/commit/d9ace95b92eb9db51c4b5dd851a65db55d63ef9d))

### [10.1.4](https://github.com/multiformats/js-multiaddr/compare/v10.1.3...v10.1.4) (2022-02-06)


### Trivial Changes

* switch to unified ci ([#219](https://github.com/multiformats/js-multiaddr/issues/219)) ([b4150b9](https://github.com/multiformats/js-multiaddr/commit/b4150b9445b3d11425d8cea48d083ec857411193))

### [10.1.3](https://github.com/multiformats/js-multiaddr/compare/v10.1.2...v10.1.3) (2022-02-06)


### Bug Fixes

* add return to toOptions ([#223](https://github.com/multiformats/js-multiaddr/issues/223)) ([e5e5f57](https://github.com/multiformats/js-multiaddr/commit/e5e5f5771267f594beb93bb12621fc44e8fca22b))

### [10.1.2](https://github.com/multiformats/js-multiaddr/compare/v10.1.1...v10.1.2) (2022-01-08)


### Trivial Changes

* add semantic release config ([#220](https://github.com/multiformats/js-multiaddr/issues/220)) ([e8a691e](https://github.com/multiformats/js-multiaddr/commit/e8a691e29a572e0e74b9ef3fa11340cbee18cb3f))
* update build ([#218](https://github.com/multiformats/js-multiaddr/issues/218)) ([c04f330](https://github.com/multiformats/js-multiaddr/commit/c04f3302c3d82c35e251302342996f2fb3648fa8))

## [10.0.1](https://github.com/multiformats/js-multiaddr/compare/v10.0.0...v10.0.1) (2021-08-19)



# [10.0.0](https://github.com/multiformats/js-multiaddr/compare/v9.0.2...v10.0.0) (2021-07-06)


### chore

* update to new multiformats ([#200](https://github.com/multiformats/js-multiaddr/issues/200)) ([7e3aff9](https://github.com/multiformats/js-multiaddr/commit/7e3aff9a24218eb1c5a7df0f7b8e9e378796431c))


### BREAKING CHANGES

* uses the CID class from the new multiformats module



## [9.0.2](https://github.com/multiformats/js-multiaddr/compare/v9.0.1...v9.0.2) (2021-06-23)



## [9.0.1](https://github.com/multiformats/js-multiaddr/compare/v9.0.0...v9.0.1) (2021-04-08)


### Bug Fixes

* types property ([#195](https://github.com/multiformats/js-multiaddr/issues/195)) ([54633f4](https://github.com/multiformats/js-multiaddr/commit/54633f493c2cbd85da7c49be200ac385394182b8))



# [9.0.0](https://github.com/multiformats/js-multiaddr/compare/v8.1.2...v9.0.0) (2021-04-08)


### Features

* add types ([#189](https://github.com/multiformats/js-multiaddr/issues/189)) ([7d284e4](https://github.com/multiformats/js-multiaddr/commit/7d284e4ce9285b448cd1287af9702a62ff696d68))


### BREAKING CHANGES

* entry point uses named exports

```js
// before

const multiaddr = require('multiaddr')
multiaddr.resolvers
multiaddr.protocols

// after

const {multiaddr , Multiaddr, protocols, resolvers} = = require('multiaddr')
Multiaddr.resolvers
Multiaddr.protocols
```
- Multiaddr is a normal class now
- `toOptions` output changed to match node 
```js
// before
multiaddr('/ip4/127.0.0.1/tcp/4001').toOptions()
{ family: 'ipv4', host: '127.0.0.1', transport: 'tcp', port: 4001 }

// after
new Multiaddr('/ip4/127.0.0.1/tcp/4001').toOptions()
{ family: 4, host: '127.0.0.1', transport: 'tcp', port: 4001 }
```
- `fromNodeAddress` and `nodeAddress` inputs/outputs now match
```js
// before the family type was not the same between them
multiaddr('/ip4/127.0.0.1/tcp/4001').nodeAddress()
{family: 4, address: '127.0.0.1', port: '4001'}

multiaddr.fromNodeAddress({family: 'IPv4', address: '127.0.0.1', port: '4001'}, 'tcp')
<Multiaddr 047f000001060fa1 - /ip4/127.0.0.1/tcp/4001>

// after 
new Multiaddr('/ip4/127.0.0.1/tcp/4001').nodeAddress()
{family: 4, address: '127.0.0.1', port: 4001}

Multiaddr.fromNodeAddress({family: 4, address: '127.0.0.1', port: '4001'}, 'tcp')
<Multiaddr 047f000001060fa1 - /ip4/127.0.0.1/tcp/4001>
```



## [8.1.2](https://github.com/multiformats/js-multiaddr/compare/v8.1.1...v8.1.2) (2020-12-11)


### Bug Fixes

* tell bundlers to return false for node dns module ([#163](https://github.com/multiformats/js-multiaddr/issues/163)) ([0ac20ba](https://github.com/multiformats/js-multiaddr/commit/0ac20bab74d23b459c144e69b138f58a8bd7201b))



## [8.1.1](https://github.com/multiformats/js-multiaddr/compare/v8.1.0...v8.1.1) (2020-10-30)


### Bug Fixes

* dns require ([#155](https://github.com/multiformats/js-multiaddr/issues/155)) ([4c89dcf](https://github.com/multiformats/js-multiaddr/commit/4c89dcf8ddf38afe6f36827abde22307f8650fe6))



# [8.1.0](https://github.com/multiformats/js-multiaddr/compare/v8.0.0...v8.1.0) (2020-10-29)


### Features

* resolve multiaddrs ([#149](https://github.com/multiformats/js-multiaddr/issues/149)) ([525268b](https://github.com/multiformats/js-multiaddr/commit/525268b3727bb9413e58322059d6ece7ec65e7f7))



<a name="8.0.0"></a>
# [8.0.0](https://github.com/multiformats/js-multiaddr/compare/v7.5.0...v8.0.0) (2020-08-07)


### Bug Fixes

* replace node buffers with uint8arrays ([#140](https://github.com/multiformats/js-multiaddr/issues/140)) ([53398f5](https://github.com/multiformats/js-multiaddr/commit/53398f5))


### BREAKING CHANGES

* - Where node Buffers were returned, now Uint8Arrays are
- The `.buffer` property has been renamed `.bytes` similar to cid@1.0.0

* chore: downgrade aegir



<a name="7.5.0"></a>
# [7.5.0](https://github.com/multiformats/js-multiaddr/compare/v7.4.3...v7.5.0) (2020-06-25)


### Features

* add new memory protocol for testing and other simulation scenarios ([bba22d2](https://github.com/multiformats/js-multiaddr/commit/bba22d2))



<a name="7.4.3"></a>
## [7.4.3](https://github.com/multiformats/js-multiaddr/compare/v7.4.2...v7.4.3) (2020-03-26)



<a name="7.4.2"></a>
## [7.4.2](https://github.com/multiformats/js-multiaddr/compare/v7.4.1...v7.4.2) (2020-03-18)


### Bug Fixes

* add buffer to ip ([#115](https://github.com/multiformats/js-multiaddr/issues/115)) ([deb7c9f](https://github.com/multiformats/js-multiaddr/commit/deb7c9f))



<a name="7.4.1"></a>
## [7.4.1](https://github.com/multiformats/js-multiaddr/compare/v7.4.0...v7.4.1) (2020-03-16)


### Bug Fixes

* use multibase, add buffer, remove ip dep ([#113](https://github.com/multiformats/js-multiaddr/issues/113)) ([f245744](https://github.com/multiformats/js-multiaddr/commit/f245744))



<a name="7.4.0"></a>
# [7.4.0](https://github.com/multiformats/js-multiaddr/compare/v7.3.1...v7.4.0) (2020-02-28)


### Bug Fixes

* update typings and add type test ([#112](https://github.com/multiformats/js-multiaddr/issues/112)) ([87aa7b0](https://github.com/multiformats/js-multiaddr/commit/87aa7b0))



<a name="7.3.1"></a>
## [7.3.1](https://github.com/multiformats/js-multiaddr/compare/v7.3.0...v7.3.1) (2020-02-13)


### Bug Fixes

* inspect deprecation warning ([#109](https://github.com/multiformats/js-multiaddr/issues/109)) ([a79a7af](https://github.com/multiformats/js-multiaddr/commit/a79a7af))



<a name="7.3.0"></a>
# [7.3.0](https://github.com/multiformats/js-multiaddr/compare/v7.2.1...v7.3.0) (2020-02-06)


### Features

* add typescript types + type tests ([#105](https://github.com/multiformats/js-multiaddr/issues/105)) ([1900490](https://github.com/multiformats/js-multiaddr/commit/1900490))



<a name="7.2.1"></a>
## [7.2.1](https://github.com/multiformats/js-multiaddr/compare/v7.2.0...v7.2.1) (2019-11-11)


### Bug Fixes

* ensure b58 can decode hash ([#103](https://github.com/multiformats/js-multiaddr/issues/103)) ([ac440cb](https://github.com/multiformats/js-multiaddr/commit/ac440cb))



<a name="7.2.0"></a>
# [7.2.0](https://github.com/multiformats/js-multiaddr/compare/v7.1.0...v7.2.0) (2019-10-28)


### Features

* support Peer ID represented as CID ([#102](https://github.com/multiformats/js-multiaddr/issues/102)) ([eead174](https://github.com/multiformats/js-multiaddr/commit/eead174))



<a name="7.1.0"></a>
# [7.1.0](https://github.com/multiformats/js-multiaddr/compare/v7.0.0...v7.1.0) (2019-09-10)


### Features

* add decapsulateCode method ([#98](https://github.com/multiformats/js-multiaddr/issues/98)) ([19a3940](https://github.com/multiformats/js-multiaddr/commit/19a3940))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/multiformats/js-multiaddr/compare/v6.1.0...v7.0.0) (2019-09-03)


### Bug Fixes

* make getPeerId resolve the last id ([#95](https://github.com/multiformats/js-multiaddr/issues/95)) ([c32071d](https://github.com/multiformats/js-multiaddr/commit/c32071d))
* return ports as ints not strings ([#87](https://github.com/multiformats/js-multiaddr/issues/87)) ([2a170c3](https://github.com/multiformats/js-multiaddr/commit/2a170c3))



<a name="6.1.0"></a>
# [6.1.0](https://github.com/multiformats/js-multiaddr/compare/v6.0.6...v6.1.0) (2019-06-05)


### Features

* add onion and onion3 support ([#89](https://github.com/multiformats/js-multiaddr/issues/89)) ([b606df3](https://github.com/multiformats/js-multiaddr/commit/b606df3))



<a name="6.0.6"></a>
## [6.0.6](https://github.com/multiformats/js-multiaddr/compare/v6.0.5...v6.0.6) (2019-03-04)


### Bug Fixes

* json round trip works as expected ([#85](https://github.com/multiformats/js-multiaddr/issues/85)) ([1977874](https://github.com/multiformats/js-multiaddr/commit/1977874))



<a name="6.0.5"></a>
## [6.0.5](https://github.com/multiformats/js-multiaddr/compare/v6.0.4...v6.0.5) (2019-02-25)


### Features

* add unix protocol support and update protocol table ([#84](https://github.com/multiformats/js-multiaddr/issues/84)) ([d4d3d9b](https://github.com/multiformats/js-multiaddr/commit/d4d3d9b))



<a name="6.0.4"></a>
## [6.0.4](https://github.com/multiformats/js-multiaddr/compare/v6.0.3...v6.0.4) (2019-01-25)


### Features

* add /p2p-stardust ([#78](https://github.com/multiformats/js-multiaddr/issues/78)) ([54e6837](https://github.com/multiformats/js-multiaddr/commit/54e6837)), closes [libp2p/js-libp2p-websocket-star#70](https://github.com/libp2p/js-libp2p-websocket-star/issues/70)



<a name="6.0.3"></a>
## [6.0.3](https://github.com/multiformats/js-multiaddr/compare/v6.0.2...v6.0.3) (2019-01-08)


### Bug Fixes

* clean up repo and bundle size reduction ([136315a](https://github.com/multiformats/js-multiaddr/commit/136315a))
* increase bundle size limit ([b7fc015](https://github.com/multiformats/js-multiaddr/commit/b7fc015))
* remove unused deps ([3d8cb42](https://github.com/multiformats/js-multiaddr/commit/3d8cb42))
* update max bundle size ([116f227](https://github.com/multiformats/js-multiaddr/commit/116f227))



<a name="6.0.2"></a>
## [6.0.2](https://github.com/multiformats/js-multiaddr/compare/v6.0.1...v6.0.2) (2018-12-17)


### Bug Fixes

* make ipfs the default 421 proto name ([#77](https://github.com/multiformats/js-multiaddr/issues/77)) ([bab6edb](https://github.com/multiformats/js-multiaddr/commit/bab6edb))



<a name="6.0.1"></a>
## [6.0.1](https://github.com/multiformats/js-multiaddr/compare/v6.0.0...v6.0.1) (2018-12-17)


### Features

* add p2p protocol support ([#76](https://github.com/multiformats/js-multiaddr/issues/76)) ([9c0139e](https://github.com/multiformats/js-multiaddr/commit/9c0139e))



<a name="6.0.0"></a>
# [6.0.0](https://github.com/multiformats/js-multiaddr/compare/v5.0.0...v6.0.0) (2018-11-28)


### Bug Fixes

* change UDP code ([e8c3d7d](https://github.com/multiformats/js-multiaddr/commit/e8c3d7d)), closes [#17](https://github.com/multiformats/js-multiaddr/issues/17)


### Features

* add support for quic addresses ([9238d0d](https://github.com/multiformats/js-multiaddr/commit/9238d0d))


### BREAKING CHANGES

* The UDP code was changed in the multicodec table

The UDP code is now `273` instead of `17`. For the full discussion of this change
please see https://github.com/multiformats/multicodec/pull/16.



<a name="5.0.2"></a>
## [5.0.2](https://github.com/multiformats/js-multiaddr/compare/v5.0.1...v5.0.2) (2018-11-05)



<a name="5.0.1"></a>
## [5.0.1](https://github.com/multiformats/js-multiaddr/compare/v5.0.0...v5.0.1) (2018-11-05)


### Features

* add support for quic addresses ([9238d0d](https://github.com/multiformats/js-multiaddr/commit/9238d0d))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/multiformats/js-multiaddr/compare/v4.0.0...v5.0.0) (2018-04-24)


### Features

* Add support for multiaddr node with dns ([5d6b93a](https://github.com/multiformats/js-multiaddr/commit/5d6b93a))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/multiformats/js-multiaddr/compare/v3.2.0...v4.0.0) (2018-04-05)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/multiformats/js-multiaddr/compare/v3.1.0...v3.2.0) (2018-04-05)


### Features

* add ip validations to ip addr formats ([#60](https://github.com/multiformats/js-multiaddr/issues/60)) ([70c138b](https://github.com/multiformats/js-multiaddr/commit/70c138b))
* use class-is module for type checks ([b097af9](https://github.com/multiformats/js-multiaddr/commit/b097af9))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/multiformats/js-multiaddr/compare/v3.0.2...v3.1.0) (2018-03-23)


### Bug Fixes

* avoid constructor.name pattern ([e386738](https://github.com/multiformats/js-multiaddr/commit/e386738))
* use consistent /dnsaddr code ([#59](https://github.com/multiformats/js-multiaddr/issues/59)) ([67fef56](https://github.com/multiformats/js-multiaddr/commit/67fef56))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/multiformats/js-multiaddr/compare/v3.0.1...v3.0.2) (2018-01-07)


### Features

* rename /dns to /dnsaddr to conform with go implementation ([#50](https://github.com/multiformats/js-multiaddr/issues/50)) ([99a1aa4](https://github.com/multiformats/js-multiaddr/commit/99a1aa4))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/multiformats/js-multiaddr/compare/v3.0.0...v3.0.1) (2017-09-05)


### Bug Fixes

* Remove (s) in p2p-websockets-star ([#46](https://github.com/multiformats/js-multiaddr/issues/46)) ([b6a613e](https://github.com/multiformats/js-multiaddr/commit/b6a613e))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/multiformats/js-multiaddr/compare/v2.3.0...v3.0.0) (2017-09-03)


### Features

* fix p2p addrs  ([28d8ce5](https://github.com/multiformats/js-multiaddr/commit/28d8ce5))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/multiformats/js-multiaddr/compare/v2.2.3...v2.3.0) (2017-03-28)


### Features

* don't throw on invalid b58 string in getPeerId ([#43](https://github.com/multiformats/js-multiaddr/issues/43)) ([ec23f14](https://github.com/multiformats/js-multiaddr/commit/ec23f14))



<a name="2.2.3"></a>
## [2.2.3](https://github.com/multiformats/js-multiaddr/compare/v2.2.2...v2.2.3) (2017-03-27)



<a name="2.2.2"></a>
## [2.2.2](https://github.com/multiformats/js-multiaddr/compare/v2.2.1...v2.2.2) (2017-03-16)



<a name="2.2.1"></a>
## [2.2.1](https://github.com/multiformats/js-multiaddr/compare/v2.2.0...v2.2.1) (2017-02-09)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/multiformats/js-multiaddr/compare/v2.1.3...v2.2.0) (2017-01-22)



<a name="2.1.3"></a>
## [2.1.3](https://github.com/multiformats/js-multiaddr/compare/v2.1.1...v2.1.3) (2017-01-16)


### Features

* add webrtc-direct multiaddr ([#36](https://github.com/multiformats/js-multiaddr/issues/36)) ([fb0e667](https://github.com/multiformats/js-multiaddr/commit/fb0e667))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/multiformats/js-multiaddr/compare/v2.1.0...v2.1.1) (2016-11-17)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/multiformats/js-multiaddr/compare/v2.0.3...v2.1.0) (2016-11-17)



<a name="2.0.3"></a>
## [2.0.3](https://github.com/multiformats/js-multiaddr/compare/v2.0.2...v2.0.3) (2016-09-07)


### Features

* add isMultiaddr method ([2aa7abb](https://github.com/multiformats/js-multiaddr/commit/2aa7abb))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/multiformats/js-multiaddr/compare/v2.0.1...v2.0.2) (2016-05-21)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/multiformats/js-multiaddr/compare/v2.0.0...v2.0.1) (2016-05-21)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/multiformats/js-multiaddr/compare/v1.4.1...v2.0.0) (2016-05-17)



<a name="1.4.1"></a>
## [1.4.1](https://github.com/multiformats/js-multiaddr/compare/v1.4.0...v1.4.1) (2016-04-20)


### Bug Fixes

* handle variable sized protocols in protoCodes ([1bce576](https://github.com/multiformats/js-multiaddr/commit/1bce576))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/multiformats/js-multiaddr/compare/v1.3.1...v1.4.0) (2016-04-19)


### Features

* Add support for ipfs addresses. ([0f39678](https://github.com/multiformats/js-multiaddr/commit/0f39678)), closes [#15](https://github.com/multiformats/js-multiaddr/issues/15)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/multiformats/js-multiaddr/compare/v1.3.0...v1.3.1) (2016-04-18)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/multiformats/js-multiaddr/compare/v1.2.0...v1.3.0) (2016-03-12)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/multiformats/js-multiaddr/compare/v1.1.3...v1.2.0) (2016-03-12)



<a name="1.1.3"></a>
## [1.1.3](https://github.com/multiformats/js-multiaddr/compare/v1.1.2...v1.1.3) (2016-03-11)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/multiformats/js-multiaddr/compare/v1.1.1...v1.1.2) (2016-03-11)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/multiformats/js-multiaddr/compare/v1.1.0...v1.1.1) (2015-11-06)



<a name="1.1.0"></a>
# 1.1.0 (2015-11-06)
