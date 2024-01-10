// http://www.korg.com/us/support/download/manual/0/544/2890

import { paramData } from './params';
import {
  INTEGER, STRING,
  IntegerSpec, MotionSlot, Note, Program, ProgramParams, ProgramSequence, SequenceStep,
} from './types';


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

// Parse the motion slot parameters into an object.
const decodeMotionSlot = (data: Uint8Array, index: number): MotionSlot => {
  const slotOffset = 112 + (index * 2);
  return {
    motionOn: !!decodeInteger(data, { lowerByteOffset: slotOffset, lowerBitsWidth: 1 }),
    smoothOn: !!decodeInteger(data,
      { lowerByteOffset: slotOffset, lowerBitsWidth: 1, lowerBitsOffset: 1 }),
    parameterId: decodeInteger(data, { lowerByteOffset: slotOffset + 1, lowerBitsWidth: 8 }),
  };
};

const computeStepOffset = (stepIndex: number) => (128 + (stepIndex * 20));

// Parse the note data into an object.
const decodeNote = (data: Uint8Array, stepIndex: number, noteIndex: number): Note => {
  const stepOffset = computeStepOffset(stepIndex);
  const noteOffset = stepOffset + noteIndex;
  return {
    note: decodeInteger(data, { lowerByteOffset: noteOffset, lowerBitsWidth: 7 }),
    velocity: decodeInteger(data, { lowerByteOffset: noteOffset + 4, lowerBitsWidth: 7 }),
    gateTime: decodeInteger(data, { lowerByteOffset: noteOffset + 8, lowerBitsWidth: 7 }),
    triggerSwitch: decodeInteger(data,
      { lowerByteOffset: noteOffset + 8, lowerBitsWidth: 1, lowerBitsOffset: 7 }),
  };
};

// Parse the motion slot data into an array.
const decodeMotionData = (data: Uint8Array, stepIndex: number, motionIndex: number) => {
  const stepOffset = computeStepOffset(stepIndex);
  const motionOffset = stepOffset + 12 + (motionIndex * 2);
  return [...data.slice(motionOffset, motionOffset + 2)];
};

// Parse the sequence step into an object.
const decodeStep = (data: Uint8Array, index: number): SequenceStep => ({
  on: !!decodeInteger(data,
    {
      lowerByteOffset: 108 + (index >= 8 ? 1 : 0),
      lowerBitsWidth: 1,
      lowerBitsOffset: index % 8,
    }),

  motionOn: Array.from({ length: 4 }, (_, motionIndex) => decodeInteger(data,
    {
      lowerByteOffset: 120 + (motionIndex * 2) + (index > 8 ? 1 : 0),
      lowerBitsWidth: 1,
      lowerBitsOffset: index % 8,
    })),

  notes: Array.from({ length: 4 }, (_, noteIndex) => decodeNote(data, index, noteIndex)),

  motions: Array.from({ length: 4 },
    (_, motionIndex) => decodeMotionData(data, index, motionIndex)),

  switch: !!decodeInteger(data,
    {
      lowerByteOffset: 110 + (index >= 8 ? 1 : 0),
      lowerBitsWidth: 1,
      lowerBitsOffset: index % 8,
    }),
});

// Parse the sequence data from the binary format into an object.
const decodeSequence = (data: Uint8Array): ProgramSequence => ({
  motionSlots: Array.from({ length: 4 }, (_, index) => decodeMotionSlot(data, index)),
  steps: Array.from({ length: 16 }, (_, index) => decodeStep(data, index)),
});

// Parse a minilogue program from the binary format into an object.
export const decodeProgram = (data: Uint8Array) => {
  const parsedParams: ProgramParams = {};

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
    parsedParams[id] = value;
  });

  return {
    parameters: parsedParams,
    sequence: decodeSequence(data),
  };
};

// A helper to put the given bidWidth bits from byte value into the buffer in the
// byte at offset, starting at bitOffset
const packBits = (
  buffer: Uint8Array, value: number, offset: number, bitOffset: number, bitWidth: number,
) => {
  const mask = ((1 << bitWidth) - 1);
  buffer[offset] |= (value & mask) << bitOffset; // eslint-disable-line no-param-reassign
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
    buffer[start + i] = charCode; // eslint-disable-line no-param-reassign
  });
};

// Encodes the motion slot parameters to the binary program data buffer.
const encodeMotionSlot = (motionSlot: MotionSlot, index: number, buffer: Uint8Array) => {
  const slotOffset = 112 + (index * 2);
  encodeInteger(buffer, motionSlot.motionOn ? 1 : 0,
    { lowerByteOffset: slotOffset, lowerBitsWidth: 1 });
  encodeInteger(buffer, motionSlot.smoothOn ? 1 : 0,
    { lowerByteOffset: slotOffset, lowerBitsWidth: 1, lowerBitsOffset: 2 });
  encodeInteger(buffer, motionSlot.parameterId,
    { lowerByteOffset: slotOffset + 1, lowerBitsWidth: 8 });
};

// Encodes the note object structure to the binary program data buffer.
const encodeNote = (note: Note, stepIndex: number, noteIndex: number, buffer: Uint8Array) => {
  const stepOffset = computeStepOffset(stepIndex);
  const noteOffset = stepOffset + noteIndex;
  encodeInteger(buffer, note.note, { lowerByteOffset: noteOffset, lowerBitsWidth: 7 });
  encodeInteger(buffer, note.velocity, { lowerByteOffset: noteOffset + 4, lowerBitsWidth: 7 });
  encodeInteger(buffer, note.gateTime, { lowerByteOffset: noteOffset + 8, lowerBitsWidth: 7 });
  encodeInteger(buffer, note.triggerSwitch,
    { lowerByteOffset: noteOffset + 8, lowerBitsWidth: 1, lowerBitsOffset: 7 });
};

// Encodes the motion data to the binary program data buffer.
const encodeMotionData = (
  motionData: number[], stepIndex: number, motionIndex: number, buffer: Uint8Array,
) => {
  const stepOffset = computeStepOffset(stepIndex);
  const motionOffset = stepOffset + 12 + (motionIndex * 2);
  const [first, second] = motionData;
  buffer[motionOffset] = first; // eslint-disable-line no-param-reassign
  buffer[motionOffset + 1] = second; // eslint-disable-line no-param-reassign
};

// Encodes the step object structure to the binary program data buffer.
const encodeStep = (step: SequenceStep, index: number, buffer: Uint8Array) => {
  encodeInteger(buffer, step.on ? 1 : 0,
    {
      lowerByteOffset: 108 + ((index >= 8) ? 1 : 0),
      lowerBitsWidth: 1,
      lowerBitsOffset: index % 8,
    });
  encodeInteger(buffer, step.switch ? 1 : 0,
    {
      lowerByteOffset: 110 + ((index >= 8) ? 1 : 0),
      lowerBitsWidth: 1,
      lowerBitsOffset: index % 8,
    });
  step.motionOn.forEach(
    (motion, motionIndex) => encodeInteger(buffer, step.motionOn[motionIndex] ? 1 : 0,
      {
        lowerByteOffset: 120 + (motionIndex * 2) + ((index >= 8) ? 1 : 0),
        lowerBitsWidth: 1,
        lowerBitsOffset: index % 8,
      }));
  step.notes.forEach((note, noteIndex) => encodeNote(note, index, noteIndex, buffer));
  step.motions.forEach(
    (motion, motionIndex) => encodeMotionData(motion, index, motionIndex, buffer));
};

// Encodes the sequence object structure to the binary program data buffer.
const encodeSequence = (sequence: ProgramSequence, buffer: Uint8Array) => {
  sequence.motionSlots.forEach((motionSlot, index) => encodeMotionSlot(motionSlot, index, buffer));
  sequence.steps.forEach((step, index) => encodeStep(step, index, buffer));
};

// Encode a minilogue program into the binary program data format.
export const encodeProgram = (program: Program) => {
  const encoded = new Uint8Array(448);

  // Add the expected sentinel strings.
  encodeString(encoded, 'PROG', 0, 3);
  encodeString(encoded, 'SEQD', 96, 99);

  Object.values(paramData).forEach(param => {
    const value = program.parameters[param.id];
    if (param.type === INTEGER) {
      encodeInteger(encoded, value as number, param.spec);
    }
    else {
      encodeString(encoded, value as string, param.spec.start, param.spec.end);
    }
  });

  encodeSequence(program.sequence, encoded);

  return encoded;
};

export const INIT_PROGRAM = decodeProgram(INIT_PATCH);
