// http://www.korg.com/us/support/download/manual/0/544/2890

import { paramData } from './params';
import { INTEGER, STRING, IntegerSpec, Program } from './types';


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
  Object.values(paramData).forEach(({ id, type, spec }) => {
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

// A helper to put the given bidWidth bits from byte value into the buffer in the
// byte at offset, starting at bitOffset
const packBits = (
  buffer: Uint8Array, value: number, offset: number, bitOffset: number, bitWidth: number,
) => {
  const mask = ((1 << bitWidth) - 1);
  // eslint-disable-next-line no-param-reassign
  buffer[offset] |= (value & mask) << bitOffset;
};

// Pack an integer value into the data buffer.
const encodeInteger = (buffer: Uint8Array, value: number, spec: IntegerSpec) => {
  const {
    upperByteOffset, upperBitsOffset = 0, upperBitsWidth = 8,
    lowerByteOffset, lowerBitsOffset = 0, lowerBitsWidth = 2,
  } = spec;

  if (upperByteOffset !== undefined) {
    const shift = lowerByteOffset === undefined ? 0 : lowerBitsWidth;
    const highBits = value >>> shift;
    packBits(buffer, highBits, upperByteOffset, upperBitsOffset, upperBitsWidth);
  }
  if (lowerByteOffset !== undefined) {
    packBits(buffer, value, lowerByteOffset, lowerBitsOffset, lowerBitsWidth);
  }
};

// Pack a String object into a binary ASCII buffer.
const FILL_CHAR = '?'.charCodeAt(0);
const encodeString = (buffer: Uint8Array, value: string, start: number, end: number) => {
  value.split('').slice(0, (end - start) + 1).forEach((character, i) => {
    let charCode = character.charCodeAt(0);
    charCode = (charCode <= 127) ? charCode : FILL_CHAR;
    // eslint-disable-next-line no-param-reassign
    buffer[start + i] = charCode;
  });
};

// Encode a minilogue program into the binary program data format.
export const encodeProgram = (program: Program) => {
  const encoded = new Uint8Array(448);
  // Add the expected sentinel strings.
  encodeString(encoded, 'PROG', 0, 3);
  encodeString(encoded, 'SEQD', 96, 99);
  Object.values(paramData).forEach(param => {
    const value = program[param.id];
    if (param.type === INTEGER) {
      encodeInteger(encoded, value as number, param.spec);
    }
    else {
      encodeString(encoded, value as string, param.spec.start, param.spec.end);
    }
  });
  // encodeSequence(program.sequence, encoded);
  return encoded;
};

export const INIT_PROGRAM = decodeProgram(INIT_PATCH);
