// http://www.korg.com/us/support/download/manual/0/544/2890

import { params } from './params';
import { INTEGER, STRING, IntegerSpec } from './types';


export type Program = { [param: number]: string | number | null };

const INIT_PATCH_STRING = 'UFJPR0luaXQgUHJvZ3JhbSAgICCAAIAAAID/AAD/AIAAAACA/wAAgAAAgAD/////AED//5CQMDDAMAAgPQDw/MgPIv//5QBmTfr/////////////////////////////U0VRRLAEAhAANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

const INIT_PATCH = new Uint8Array(
  window.atob(INIT_PATCH_STRING).split('').map(c => c.charCodeAt(0)));

// A helper to pull out the bitWidth bits starting at bitOffset from the value byte.
const extractBits = (value: number, bitOffset: number, bitWidth: number) => {
  const mask = ((1 << bitWidth) - 1) << bitOffset;
  return (value & mask) >>> bitOffset;
};

// Parse an integer out of the data buffer.
const decodeInteger = (data: Uint8Array, spec: IntegerSpec) => {
  const {
    upperByteOffset, upperBitsOffset = 0, upperBitsWidth = 8,
    lowerByteOffset, lowerBitsOffset = 0, lowerBitsWidth = 2,
  } = spec;

  let value = 0;
  if (upperByteOffset !== undefined) {
    value = extractBits(data[upperByteOffset], upperBitsOffset, upperBitsWidth);
  }
  if (lowerByteOffset !== undefined) {
    const lower = extractBits(data[lowerByteOffset], lowerBitsOffset, lowerBitsWidth);
    value = (value << lowerBitsWidth) | lower;
  }
  return value;
};

// Parse a minilogue program from the binary format into an object.
export const decodeProgram = (data: Uint8Array) => {
  const parsed: Program = {};
  Object.values(params).forEach(({ id, type, spec }) => {
    let value = null;
    switch (type) {
      case INTEGER: {
        value = decodeInteger(data, spec);
        break;
      }
      case STRING: {
        const { start: stringStart, end: stringEnd } = spec;
        const stringBytes = data.slice(stringStart, stringEnd + 1);
        value = String.fromCharCode.apply(null, Array.from(stringBytes));
        break;
      }
      // case BYTES: {
      //   const { start: bytesStart, end: bytesEnd } = spec;
      //   value = data.slice(bytesStart, bytesEnd + 1);
      //   break;
      // }
      default:
        break;
    }
    parsed[id] = value;
  });
  // parsed.sequence = decodeSequence(data);
  return parsed;
};

export const INIT_PROGRAM = decodeProgram(INIT_PATCH);
