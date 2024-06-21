export const CURRENT_PROGRAM_DATA_DUMP_REQUEST = 0x10; // Ask for the current program
export const PROGRAM_DATA_DUMP_REQUEST = 0x1c; // Ask for a specific program
export const GLOBAL_DATA_DUMP_REQUEST = 0x0e; // Ask for global data
export const CURRENT_PROGRAM_DATA_DUMP = 0x40; // Set the current program
export const PROGRAM_DATA_DUMP = 0x4c; // Set a specific program
export const GLOBAL_DATA_DUMP = 0x51; // Set global data

export const DATA_FORMAT_ERROR = 0x26;
export const DATA_LOAD_COMPLETED = 0x23;
export const DATA_LOAD_ERROR = 0x24;

export const HIGH_BIT_MASK = 0b10000000;
export const LOW_BITS_MASK = 0b01111111;

export const getSysexFunction = (data: Uint8Array) => ((
  (data[0] === 0xf0)
  && (data[1] === 0x42)
  && (data[2] >> 4 === 0x3) // Lower half is the channel.
  && (data[3] === 0x00)
  && (data[4] === 0x01)
  && (data[5] === 0x2c))
  ? data[6] : undefined);

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

export const decodeProgramIndex = (data: Uint8Array) => (
  (data[0] & LOW_BITS_MASK) | ((data[1] << 7) & HIGH_BIT_MASK));

export const encodeProgramIndex = (number: number) => new Uint8Array([
  number & LOW_BITS_MASK,
  (number & HIGH_BIT_MASK) >>> 7,
]);
