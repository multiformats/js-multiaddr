import { ParseError } from './codec.js'
import type { Codec } from './protocols-table'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import varint  from 'varint'
import { base16 } from 'multiformats/bases/base16'
import { base58btc } from 'multiformats/bases/base58'
import { base64url } from 'multiformats/bases/base64'
import type { BaseDecoder } from 'multiformats/bases/interface'

const encodings: {[prefix: string]: BaseDecoder} = {
    'f': base16,
    'u': base64url,
    'z': base58btc,
};

export class DefaultCerthashCodec implements Codec {
    stringToBytes(stringRepresentation: string): Uint8Array {
        if (stringRepresentation.length < 2) {
            throw ParseError('Not enough length to be a multibase: ' + stringRepresentation);
        }
        let prefix = stringRepresentation[0];
        let encoded = stringRepresentation.slice(1);
        let encoding = encodings[prefix];
        let decoded: Uint8Array;
        if (encoding) {
            decoded = encoding.baseDecode(encoded);
        } else {
            throw new Error('certhash is in a multibase encoding that is not supported by default. Please provide a custom decoder: '+stringRepresentation);
        }
        const size = Uint8Array.from(varint.encode(decoded.length))
        return uint8ArrayConcat([size, decoded], size.length + decoded.length)
    }
    bytesToString(byteRepresentation: Uint8Array): string {
        const size = varint.decode(byteRepresentation)
        const hash = byteRepresentation.slice(varint.decode.bytes)
      
        if (hash.length !== size) {
          throw new Error('inconsistent lengths')
        }
      
        return 'z' + uint8ArrayToString(hash, 'base58btc')
    }
  
}
