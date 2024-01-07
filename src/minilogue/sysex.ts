const HIGH_BIT_MASK = 0b10000000;
const LOW_BITS_MASK = 0b01111111;

export const isSysexMessage = (data: Uint8Array) => (
  (data[0] === 0xf0)
  && (data[1] === 0x42)
  && (data[3] === 0x00)
  && (data[4] === 0x01)
  && (data[5] === 0x2c)
);

// Decode the 7-bit MIDI sysex data into an 8-bit data array.
export const decodeSysexData = (data: Uint8Array) => {
  const inputLength = data.length;
  const outputLength = Math.ceil(inputLength * (7 / 8));
  const output = new Uint8Array(outputLength);
  for (let i = 0, outputIndex = 0; i < inputLength; i += 8) {
    const header = data[i];
    for (let j = 1; j < 8; j += 1, outputIndex += 1) {
      const currentByte = data[i + j];
      const highBit = (header << (8 - j)) & HIGH_BIT_MASK;
      output[outputIndex] = highBit ^ currentByte;
    }
  }
  return output;
};

// Encode the 8-bit data array using the 7-bit MIDI sysex convention.
export const encodeSysexData = (data: Uint8Array) => {
  const inputLength = data.length;
  const outputLength = Math.ceil(inputLength * (8 / 7));
  const output = new Uint8Array(outputLength);
  for (let i = 0, headIndex = 0; i < inputLength; headIndex += 8) {
    output[headIndex] = 0;
    for (let j = 0; j < 7 && i < inputLength; j += 1, i += 1) {
      const currentByte = data[i];
      output[headIndex] |= (currentByte & HIGH_BIT_MASK) >>> (7 - j);
      output[headIndex + j + 1] = currentByte & LOW_BITS_MASK;
    }
  }
  return output;
};

export const parseSysexMessage = (data: Uint8Array) => {
  if (data[6] === 0x40) {
    // Current program data dump
    return decodeSysexData(data.slice(7, -1));
  }

  if (data[6] === 0x4c) {
    // Program data dump
    return decodeSysexData(data.slice(9, -1));
  }

  if (data[6] === 0x51) {
    // Global data dump
  }
  else if (data[6] === 0x26) {
    console.warn('Data format error');
  }
  else if (data[6] === 0x23) {
    console.log('Data load completed');
  }
  else if (data[6] === 0x24) {
    console.warn('Data load error');
  }

  return undefined;
};
