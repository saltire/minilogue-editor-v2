// http://www.korg.com/us/support/download/manual/0/544/2890

import { Program } from './types';


const INIT_PATCH_STRING = 'UFJPR0luaXQgUHJvZ3JhbSAgICCAAIAAAID/AAD/AIAAAACA/wAAgAAAgAD/////AED//5CQMDDAMAAgPQDw/MgPIv//5QBmTfr/////////////////////////////U0VRRLAEAhAANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

const INIT_PATCH = new Uint8Array(
  window.atob(INIT_PATCH_STRING).split('').map(c => c.charCodeAt(0)));

// Parameter codes
export const PROGRAM_NAME = 1;
export const VCO1_PITCH = 2;
export const VCO1_SHAPE = 3;
export const VCO2_PITCH = 4;
export const VCO2_SHAPE = 5;
export const CROSS_MOD_DEPTH = 6;
export const VCO2_PITCH_EG_INT = 7;
export const VCO1_LEVEL = 8;
export const VCO2_LEVEL = 9;
export const NOISE_LEVEL = 10;
export const CUTOFF = 11;
export const RESONANCE = 12;
export const CUTOFF_EG_INT = 13;
export const AMP_VELOCITY = 14;
export const AMP_EG_ATTACK = 15;
export const AMP_EG_DECAY = 16;
export const AMP_EG_SUSTAIN = 17;
export const AMP_EG_RELEASE = 18;
export const EG_ATTACK = 19;
export const EG_DECAY = 20;
export const EG_SUSTAIN = 21;
export const EG_RELEASE = 22;
export const LFO_RATE = 23;
export const LFO_INT = 24;
export const DELAY_HI_PASS_CUTOFF = 25;
export const DELAY_TIME = 26;
export const DELAY_FEEDBACK = 27;
export const VCO1_OCTAVE = 28;
export const VCO1_WAVE = 29;
export const VCO2_OCTAVE = 30;
export const VCO2_WAVE = 31;
export const SYNC = 32;
export const RING = 33;
export const CUTOFF_VELOCITY = 34;
export const CUTOFF_KEYBOARD_TRACK = 35;
export const CUTOFF_TYPE = 36;
export const LFO_TARGET = 37;
export const LFO_EG = 38;
export const LFO_WAVE = 39;
export const DELAY_OUTPUT_ROUTING = 40;
export const PORTAMENTO_TIME = 41;
export const VOICE_MODE = 42;
export const VOICE_MODE_DEPTH = 43;
export const BEND_RANGE_POSITIVE = 44;
export const BEND_RANGE_NEGATIVE = 45;
export const LFO_KEY_SYNC = 46;
export const LFO_BPM_SYNC = 47;
export const LFO_VOICE_SYNC = 48;
export const PORTAMENTO_BPM = 49;
export const PORTAMENTO_MODE = 50;
export const PROGRAM_LEVEL = 51;
export const SLIDER_ASSIGN = 52;
export const KEYBOARD_OCTAVE = 53;
export const BPM = 54;
export const STEP_LENGTH = 55;
export const SWING = 56;
export const DEFAULT_GATE_TIME = 57;
export const STEP_RESOLUTION = 58;

// Parameter data types
const INTEGER = 0;
const STRING = 1;
// const BYTES = 2;

type BaseParamData = {
  parameter: number,
};

type IntegerSpec = {
  upperByteOffset?: number,
  upperBitsOffset?: number,
  upperBitsWidth?: number,
  lowerByteOffset?: number,
  lowerBitsOffset?: number,
  lowerBitsWidth?: number,
};

type IntegerParamData = BaseParamData & {
  type: 0,
  spec: IntegerSpec,
};

type StringParamData = BaseParamData & {
  type: 1,
  spec: {
    start: number,
    end: number,
  },
};

type ParamData = IntegerParamData | StringParamData;

export const PARAMETERS: ParamData[] = [
  {
    parameter: PROGRAM_NAME,
    type: STRING,
    spec: {
      start: 4,
      end: 15,
    },
  },
  {
    parameter: VCO1_PITCH,
    type: INTEGER,
    spec: {
      upperByteOffset: 20,
      lowerByteOffset: 52,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: VCO1_SHAPE,
    type: INTEGER,
    spec: {
      upperByteOffset: 21,
      lowerByteOffset: 52,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: VCO2_PITCH,
    type: INTEGER,
    spec: {
      upperByteOffset: 22,
      lowerByteOffset: 53,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: VCO2_SHAPE,
    type: INTEGER,
    spec: {
      upperByteOffset: 23,
      lowerByteOffset: 53,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: CROSS_MOD_DEPTH,
    type: INTEGER,
    spec: {
      upperByteOffset: 24,
      lowerByteOffset: 54,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: VCO2_PITCH_EG_INT,
    type: INTEGER,
    spec: {
      upperByteOffset: 25,
      lowerByteOffset: 54,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: VCO1_LEVEL,
    type: INTEGER,
    spec: {
      upperByteOffset: 26,
      lowerByteOffset: 54,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: VCO2_LEVEL,
    type: INTEGER,
    spec: {
      upperByteOffset: 27,
      lowerByteOffset: 54,
      lowerBitsOffset: 6,
    },
  },
  {
    parameter: NOISE_LEVEL,
    type: INTEGER,
    spec: {
      upperByteOffset: 28,
      lowerByteOffset: 55,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: CUTOFF,
    type: INTEGER,
    spec: {
      upperByteOffset: 29,
      lowerByteOffset: 55,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: RESONANCE,
    type: INTEGER,
    spec: {
      upperByteOffset: 30,
      lowerByteOffset: 55,
      lowerBitsOffset: 6,
    },
  },
  {
    parameter: CUTOFF_EG_INT,
    type: INTEGER,
    spec: {
      upperByteOffset: 31,
      lowerByteOffset: 56,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: AMP_VELOCITY,
    type: INTEGER,
    spec: {
      lowerByteOffset: 33,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: AMP_EG_ATTACK,
    type: INTEGER,
    spec: {
      upperByteOffset: 34,
      lowerByteOffset: 57,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: AMP_EG_DECAY,
    type: INTEGER,
    spec: {
      upperByteOffset: 35,
      lowerByteOffset: 57,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: AMP_EG_SUSTAIN,
    type: INTEGER,
    spec: {
      upperByteOffset: 36,
      lowerByteOffset: 57,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: AMP_EG_RELEASE,
    type: INTEGER,
    spec: {
      upperByteOffset: 37,
      lowerByteOffset: 57,
      lowerBitsOffset: 6,
    },
  },
  {
    parameter: EG_ATTACK,
    type: INTEGER,
    spec: {
      upperByteOffset: 38,
      lowerByteOffset: 58,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: EG_DECAY,
    type: INTEGER,
    spec: {
      upperByteOffset: 39,
      lowerByteOffset: 58,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: EG_SUSTAIN,
    type: INTEGER,
    spec: {
      upperByteOffset: 40,
      lowerByteOffset: 58,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: EG_RELEASE,
    type: INTEGER,
    spec: {
      upperByteOffset: 41,
      lowerByteOffset: 58,
      lowerBitsOffset: 6,
    },
  },
  {
    parameter: LFO_RATE,
    type: INTEGER,
    spec: {
      upperByteOffset: 42,
      lowerByteOffset: 59,
      lowerBitsOffset: 0,
    },
  },
  {
    parameter: LFO_INT,
    type: INTEGER,
    spec: {
      upperByteOffset: 43,
      lowerByteOffset: 59,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: DELAY_HI_PASS_CUTOFF,
    type: INTEGER,
    spec: {
      upperByteOffset: 49,
      lowerByteOffset: 62,
      lowerBitsOffset: 2,
    },
  },
  {
    parameter: DELAY_TIME,
    type: INTEGER,
    spec: {
      upperByteOffset: 50,
      lowerByteOffset: 62,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: DELAY_FEEDBACK,
    type: INTEGER,
    spec: {
      upperByteOffset: 51,
      lowerByteOffset: 62,
      lowerBitsOffset: 6,
    },
  },
  {
    parameter: VCO1_OCTAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 52,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: VCO1_WAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 52,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: VCO2_OCTAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 53,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: VCO2_WAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 53,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: SYNC,
    type: INTEGER,
    spec: {
      lowerByteOffset: 55,
      lowerBitsOffset: 0,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: RING,
    type: INTEGER,
    spec: {
      lowerByteOffset: 55,
      lowerBitsOffset: 1,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: CUTOFF_VELOCITY,
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 2,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: CUTOFF_KEYBOARD_TRACK,
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 4,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: CUTOFF_TYPE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 6,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: LFO_TARGET,
    type: INTEGER,
    spec: {
      lowerByteOffset: 59,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: LFO_EG,
    type: INTEGER,
    spec: {
      lowerByteOffset: 59,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: LFO_WAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 60,
      lowerBitsOffset: 0,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: DELAY_OUTPUT_ROUTING,
    type: INTEGER,
    spec: {
      lowerByteOffset: 60,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
  },
  {
    parameter: PORTAMENTO_TIME,
    type: INTEGER,
    spec: {
      lowerByteOffset: 61,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: VOICE_MODE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 64,
      lowerBitsOffset: 0,
      lowerBitsWidth: 3,
    },
  },
  {
    parameter: VOICE_MODE_DEPTH,
    type: INTEGER,
    spec: {
      upperByteOffset: 70,
      lowerByteOffset: 64,
      lowerBitsOffset: 4,
    },
  },
  {
    parameter: BEND_RANGE_POSITIVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 66,
      lowerBitsOffset: 0,
      lowerBitsWidth: 4,
    },
  },
  {
    parameter: BEND_RANGE_NEGATIVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 66,
      lowerBitsOffset: 4,
      lowerBitsWidth: 4,
    },
  },
  {
    parameter: LFO_KEY_SYNC,
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 0,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: LFO_BPM_SYNC,
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 1,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: LFO_VOICE_SYNC,
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 2,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: PORTAMENTO_BPM,
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 3,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: PORTAMENTO_MODE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 4,
      lowerBitsWidth: 1,
    },
  },
  {
    parameter: PROGRAM_LEVEL,
    type: INTEGER,
    spec: {
      lowerByteOffset: 71,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: SLIDER_ASSIGN,
    type: INTEGER,
    spec: {
      lowerByteOffset: 72, // This doesn't match the spec
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: KEYBOARD_OCTAVE,
    type: INTEGER,
    spec: {
      lowerByteOffset: 73,
      lowerBitsOffset: 0,
      lowerBitsWidth: 3,
    },
  },
  {
    parameter: BPM,
    type: INTEGER,
    spec: {
      upperByteOffset: 101,
      upperBitsWidth: 4,
      lowerByteOffset: 100,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: STEP_LENGTH,
    type: INTEGER,
    spec: {
      lowerByteOffset: 103,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: SWING,
    type: INTEGER,
    spec: {
      lowerByteOffset: 104,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: DEFAULT_GATE_TIME,
    type: INTEGER,
    spec: {
      lowerByteOffset: 105,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  {
    parameter: STEP_RESOLUTION,
    type: INTEGER,
    spec: {
      lowerByteOffset: 106,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
];

// A helper to pull out the bitWidth bits starting at bitOffset from the value byte.
/* eslint-disable no-bitwise */
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
const decodeProgram = (data: Uint8Array) => {
  const parsed: Program = {};
  PARAMETERS.forEach(({ parameter, type, spec }) => {
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
    parsed[parameter] = value;
  });
  // parsed.sequence = decodeSequence(data);
  return parsed;
};

const INIT_PROGRAM = decodeProgram(INIT_PATCH);

export { INIT_PROGRAM };
