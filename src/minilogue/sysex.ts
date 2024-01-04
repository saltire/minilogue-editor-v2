const HIGH_BIT_MASK = 0b10000000;

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

export const parseSysexMessage = (data: Uint8Array) => {
  let sysexData;
  // Current program data dump
  if (data[6] === 0x40) {
    sysexData = data.slice(7, -1);
  }
  // Program data dump
  else if (data[6] === 0x4c) {
    sysexData = data.slice(9, -1);
  }

  return sysexData && decodeSysexData(sysexData);
};
