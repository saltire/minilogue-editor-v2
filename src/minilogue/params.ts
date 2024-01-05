import { INTEGER, STRING, ParamData, Program } from './types';
import { mapToRange } from '../utils';


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

const WAVE_CHOICES = [
  'Square',
  'Triangle',
  'Sawtooth',
];

const OCTAVE_CHOICES = [
  "16'",
  "8'",
  "4'",
  "2'",
];

const SWITCH_CHOICES = [
  'Off',
  'On',
];

const THREE_WAY_CHOICES = [
  '0',
  '50',
  '100',
];

const splitRanges = (
  value: number, ranges: { fromRange: [number, number], toRange: [number, number] }[],
) => {
  // max exclusive?
  const maxIndex = ranges.length - 1;
  const { fromRange, toRange } = ranges.find(({ fromRange: range }, index) => (
    (range[0] <= value) && (index === maxIndex ? range[1] >= value : range[1] > value)
  )) ?? { fromRange: [0, 0], toRange: [0, 0] };
  return mapToRange(value, fromRange[0], fromRange[1], toRange[0], toRange[1]);
};

const rangeToChoice = (value: number, ranges: { min: number, max: number, value: string }[]) => {
  // inclusive
  const found = ranges.find(({ min, max }) => (value >= min) && (value <= max));
  return found?.value || '';
};

const pitchToCents = (value: number) => (
  splitRanges(
    value,
    [
      { fromRange: [0, 4], toRange: [-1200, -1200] },
      { fromRange: [4, 356], toRange: [-1200, -256] },
      { fromRange: [356, 476], toRange: [-256, -16] },
      { fromRange: [476, 492], toRange: [-16, 0] },
      { fromRange: [492, 532], toRange: [0, 0] },
      { fromRange: [532, 548], toRange: [0, 16] },
      { fromRange: [548, 668], toRange: [16, 256] },
      { fromRange: [668, 1020], toRange: [256, 1200] },
      { fromRange: [1020, 1023], toRange: [1200, 1200] },
    ],
  ));

const pitchEGIntToCents = (value: number) => (
  splitRanges(
    value,
    [
      { fromRange: [0, 4], toRange: [-4800, -4800] },
      { fromRange: [4, 356], toRange: [-4800, -1024] },
      { fromRange: [356, 476], toRange: [-1024, -64] },
      { fromRange: [476, 492], toRange: [-64, 0] },
      { fromRange: [492, 532], toRange: [0, 0] },
      { fromRange: [532, 548], toRange: [0, 64] },
      { fromRange: [548, 668], toRange: [64, 1024] },
      { fromRange: [668, 1020], toRange: [1024, 4800] },
      { fromRange: [1020, 1023], toRange: [4800, 4800] },
    ],
  ));

const cutoffEGIntToPercent = (value: number) => {
  /*
  0   ~ 11   : -100 (%)
  11  ~ 492  : - ((492 - value) * (492 - value) * 4641 * 100) / 0x40000000 (%)
  492 ~ 532  : 0 (%)
  532 ~ 1013 : ((value - 532) * (value - 532) * 4641 * 100) / 0x40000000 (%)
  1013~1023  : 100 (%)
  */
  let percent;
  if ((value >= 0) && (value < 11)) {
    percent = -100;
  }
  else if ((value >= 11) && (value < 492)) {
    percent = -((492 - value) * (492 - value) * 4641 * 100) / 0x40000000;
  }
  else if ((value >= 492) && (value < 532)) {
    percent = 0;
  }
  else if ((value >= 532) && (value < 1013)) {
    percent = ((value - 532) * (value - 532) * 4641 * 100) / 0x40000000;
  }
  else if ((value >= 1013) && (value <= 1023)) {
    percent = 100;
  }
  return percent || 0;
};

const translateVoiceModeDepth = (value: number, program: Program) => {
  switch (program[VOICE_MODE]) {
    case 0: // POLY
      return `${Math.round(mapToRange(value, 0, 1023, 0, 8))}`;
    case 1: // DUO
    case 2: // UNISON
      return `${Math.round(mapToRange(value, 0, 1023, 0, 50))}`;
    case 4: // CHORD
      return rangeToChoice(
        value,
        [
          { min: 0, max: 73, value: '5th' },
          { min: 74, max: 146, value: 'sus2' },
          { min: 147, max: 219, value: 'm' },
          { min: 220, max: 292, value: 'Maj' },
          { min: 293, max: 365, value: 'sus4' },
          { min: 366, max: 438, value: 'm7' },
          { min: 439, max: 511, value: '7' },
          { min: 512, max: 585, value: '7sus4' },
          { min: 586, max: 658, value: 'Maj7' },
          { min: 659, max: 731, value: 'aug' },
          { min: 732, max: 804, value: 'dim' },
          { min: 805, max: 877, value: 'm7b5' },
          { min: 878, max: 950, value: 'mMaj7' },
          { min: 951, max: 1023, value: 'Maj7b5' },
        ],
      );
    case 5: // DELAY
      return rangeToChoice(
        value,
        [
          { min: 0, max: 85, value: '1/192' },
          { min: 86, max: 170, value: '1/128' },
          { min: 171, max: 255, value: '1/64' },
          { min: 256, max: 341, value: '1/48' },
          { min: 342, max: 426, value: '1/32' },
          { min: 427, max: 511, value: '1/24' },
          { min: 521, max: 597, value: '1/16' },
          { min: 598, max: 682, value: '1/12' },
          { min: 683, max: 767, value: '1/8' },
          { min: 768, max: 853, value: '1/6' },
          { min: 854, max: 938, value: '3/16' },
          { min: 939, max: 1023, value: '1/4' },
        ],
      );
    case 6: // ARP
      return rangeToChoice(
        value,
        [
          { min: 0, max: 78, value: 'Manual 1' },
          { min: 79, max: 157, value: 'Manual 2' },
          { min: 158, max: 236, value: 'Rise 1' },
          { min: 237, max: 315, value: 'Rise 2' },
          { min: 316, max: 393, value: 'Fall 1' },
          { min: 394, max: 472, value: 'Fall 2' },
          { min: 473, max: 551, value: 'Rise Fall 1' },
          { min: 552, max: 630, value: 'Rise Fall 2' },
          { min: 631, max: 708, value: 'Poly 1' },
          { min: 709, max: 787, value: 'Poly 2' },
          { min: 788, max: 866, value: 'Random 1' },
          { min: 867, max: 945, value: 'Random 2' },
          { min: 946, max: 1023, value: 'Random 3' },
        ],
      );
    case 7: // SIDECHAIN
    default:
      return `${value}`;
  }
};

const translateLFORate = (value: number, program: Program) => {
  if (!program[LFO_BPM_SYNC]) {
    return `${value}`;
  }
  return rangeToChoice(
    value,
    [
      { min: 0, max: 63, value: '4' },
      { min: 64, max: 127, value: '2' },
      { min: 128, max: 191, value: '1' },
      { min: 192, max: 255, value: '3/4' },
      { min: 256, max: 319, value: '1/2' },
      { min: 320, max: 383, value: '3/8' },
      { min: 384, max: 447, value: '1/3' },
      { min: 448, max: 511, value: '1/4' },
      { min: 512, max: 575, value: '3/16' },
      { min: 576, max: 639, value: '1/6' },
      { min: 640, max: 703, value: '1/8' },
      { min: 704, max: 767, value: '1/12' },
      { min: 768, max: 831, value: '1/16' },
      { min: 832, max: 895, value: '1/24' },
      { min: 896, max: 959, value: '1/32' },
      { min: 960, max: 1023, value: '1/36' },
    ],
  );
};

export const paramData: { [index: number]: ParamData } = {
  [PROGRAM_NAME]: {
    id: PROGRAM_NAME,
    title: 'Program Name',
    type: STRING,
    spec: {
      start: 4,
      end: 15,
    },
  },
  [VCO1_PITCH]: {
    id: VCO1_PITCH,
    title: 'VCO1 Pitch',
    label: 'Pitch',
    type: INTEGER,
    spec: {
      upperByteOffset: 20,
      lowerByteOffset: 52,
      lowerBitsOffset: 0,
    },
    func: pitchToCents,
    unit: 'Cents',
  },
  [VCO1_SHAPE]: {
    id: VCO1_SHAPE,
    title: 'VCO1 Shape',
    label: 'Shape',
    type: INTEGER,
    spec: {
      upperByteOffset: 21,
      lowerByteOffset: 52,
      lowerBitsOffset: 2,
    },
  },
  [VCO2_PITCH]: {
    id: VCO2_PITCH,
    title: 'VCO2 Pitch',
    label: 'Pitch',
    type: INTEGER,
    spec: {
      upperByteOffset: 22,
      lowerByteOffset: 53,
      lowerBitsOffset: 0,
    },
    func: pitchToCents,
    unit: 'Cents',
  },
  [VCO2_SHAPE]: {
    id: VCO2_SHAPE,
    title: 'VCO2 Shape',
    label: 'Shape',
    type: INTEGER,
    spec: {
      upperByteOffset: 23,
      lowerByteOffset: 53,
      lowerBitsOffset: 2,
    },
  },
  [CROSS_MOD_DEPTH]: {
    id: CROSS_MOD_DEPTH,
    title: 'Cross Mod Depth',
    label: 'Cross Mod Depth',
    type: INTEGER,
    spec: {
      upperByteOffset: 24,
      lowerByteOffset: 54,
      lowerBitsOffset: 0,
    },
  },
  [VCO2_PITCH_EG_INT]: {
    id: VCO2_PITCH_EG_INT,
    title: 'VCO2 Pitch EG Int',
    label: 'Pitch EG Int',
    type: INTEGER,
    spec: {
      upperByteOffset: 25,
      lowerByteOffset: 54,
      lowerBitsOffset: 2,
    },
    func: pitchEGIntToCents,
    unit: 'Cents',
  },
  [VCO1_LEVEL]: {
    id: VCO1_LEVEL,
    title: 'VCO1 Level',
    label: 'VCO1',
    type: INTEGER,
    spec: {
      upperByteOffset: 26,
      lowerByteOffset: 54,
      lowerBitsOffset: 4,
    },
  },
  [VCO2_LEVEL]: {
    id: VCO2_LEVEL,
    title: 'VCO2 Level',
    label: 'VCO2',
    type: INTEGER,
    spec: {
      upperByteOffset: 27,
      lowerByteOffset: 54,
      lowerBitsOffset: 6,
    },
  },
  [NOISE_LEVEL]: {
    id: NOISE_LEVEL,
    title: 'Noise Level',
    label: 'Noise',
    type: INTEGER,
    spec: {
      upperByteOffset: 28,
      lowerByteOffset: 55,
      lowerBitsOffset: 2,
    },
  },
  [CUTOFF]: {
    id: CUTOFF,
    title: 'Cutoff',
    label: 'Cutoff',
    type: INTEGER,
    spec: {
      upperByteOffset: 29,
      lowerByteOffset: 55,
      lowerBitsOffset: 4,
    },
  },
  [RESONANCE]: {
    id: RESONANCE,
    title: 'Resonance',
    label: 'Resonance',
    type: INTEGER,
    spec: {
      upperByteOffset: 30,
      lowerByteOffset: 55,
      lowerBitsOffset: 6,
    },
  },
  [CUTOFF_EG_INT]: {
    id: CUTOFF_EG_INT,
    title: 'Cutoff EG Int',
    label: 'EG Int',
    type: INTEGER,
    spec: {
      upperByteOffset: 31,
      lowerByteOffset: 56,
      lowerBitsOffset: 0,
    },
    func: cutoffEGIntToPercent,
    unit: '%',
  },
  [AMP_VELOCITY]: {
    id: AMP_VELOCITY,
    title: 'Amp Velocity',
    label: 'Velocity',
    type: INTEGER,
    spec: {
      lowerByteOffset: 33,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  [AMP_EG_ATTACK]: {
    id: AMP_EG_ATTACK,
    title: 'Amp EG Attack',
    label: 'Attack',
    type: INTEGER,
    spec: {
      upperByteOffset: 34,
      lowerByteOffset: 57,
      lowerBitsOffset: 0,
    },
  },
  [AMP_EG_DECAY]: {
    id: AMP_EG_DECAY,
    title: 'Amp EG Decay',
    label: 'Decay',
    type: INTEGER,
    spec: {
      upperByteOffset: 35,
      lowerByteOffset: 57,
      lowerBitsOffset: 2,
    },
  },
  [AMP_EG_SUSTAIN]: {
    id: AMP_EG_SUSTAIN,
    title: 'Amp EG Sustain',
    label: 'Sustain',
    type: INTEGER,
    spec: {
      upperByteOffset: 36,
      lowerByteOffset: 57,
      lowerBitsOffset: 4,
    },
  },
  [AMP_EG_RELEASE]: {
    id: AMP_EG_RELEASE,
    title: 'Amp EG Release',
    label: 'Release',
    type: INTEGER,
    spec: {
      upperByteOffset: 37,
      lowerByteOffset: 57,
      lowerBitsOffset: 6,
    },
  },
  [EG_ATTACK]: {
    id: EG_ATTACK,
    title: 'EG Attack',
    label: 'Attack',
    type: INTEGER,
    spec: {
      upperByteOffset: 38,
      lowerByteOffset: 58,
      lowerBitsOffset: 0,
    },
  },
  [EG_DECAY]: {
    id: EG_DECAY,
    title: 'EG Decay',
    label: 'Decay',
    type: INTEGER,
    spec: {
      upperByteOffset: 39,
      lowerByteOffset: 58,
      lowerBitsOffset: 2,
    },
  },
  [EG_SUSTAIN]: {
    id: EG_SUSTAIN,
    title: 'EG Sustain',
    label: 'Sustain',
    type: INTEGER,
    spec: {
      upperByteOffset: 40,
      lowerByteOffset: 58,
      lowerBitsOffset: 4,
    },
  },
  [EG_RELEASE]: {
    id: EG_RELEASE,
    title: 'EG Release',
    label: 'Release',
    type: INTEGER,
    spec: {
      upperByteOffset: 41,
      lowerByteOffset: 58,
      lowerBitsOffset: 6,
    },
  },
  [LFO_RATE]: {
    id: LFO_RATE,
    title: 'LFO Rate',
    label: 'Rate',
    type: INTEGER,
    spec: {
      upperByteOffset: 42,
      lowerByteOffset: 59,
      lowerBitsOffset: 0,
    },
    func: translateLFORate,
  },
  [LFO_INT]: {
    id: LFO_INT,
    title: 'LFO Int',
    label: 'Int',
    type: INTEGER,
    spec: {
      upperByteOffset: 43,
      lowerByteOffset: 59,
      lowerBitsOffset: 2,
    },
  },
  [DELAY_HI_PASS_CUTOFF]: {
    id: DELAY_HI_PASS_CUTOFF,
    title: 'Delay Hi Pass Cutoff',
    label: 'Hi Pass Cutoff',
    type: INTEGER,
    spec: {
      upperByteOffset: 49,
      lowerByteOffset: 62,
      lowerBitsOffset: 2,
    },
  },
  [DELAY_TIME]: {
    id: DELAY_TIME,
    title: 'Delay Time',
    label: 'Time',
    type: INTEGER,
    spec: {
      upperByteOffset: 50,
      lowerByteOffset: 62,
      lowerBitsOffset: 4,
    },
  },
  [DELAY_FEEDBACK]: {
    id: DELAY_FEEDBACK,
    title: 'Delay Feedback',
    label: 'Feedback',
    type: INTEGER,
    spec: {
      upperByteOffset: 51,
      lowerByteOffset: 62,
      lowerBitsOffset: 6,
    },
  },
  [VCO1_OCTAVE]: {
    id: VCO1_OCTAVE,
    title: 'VCO1 Octave',
    label: 'Octave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 52,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
    choices: OCTAVE_CHOICES,
  },
  [VCO1_WAVE]: {
    id: VCO1_WAVE,
    title: 'VCO1 Wave',
    label: 'Wave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 52,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
    choices: WAVE_CHOICES,
  },
  [VCO2_OCTAVE]: {
    id: VCO2_OCTAVE,
    title: 'VCO2 Octave',
    label: 'Octave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 53,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
    choices: OCTAVE_CHOICES,
  },
  [VCO2_WAVE]: {
    id: VCO2_WAVE,
    title: 'VCO2 Wave',
    label: 'Wave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 53,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
    choices: WAVE_CHOICES,
  },
  [SYNC]: {
    id: SYNC,
    title: 'Oscillator Sync',
    label: 'Sync',
    type: INTEGER,
    spec: {
      lowerByteOffset: 55,
      lowerBitsOffset: 0,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [RING]: {
    id: RING,
    title: 'Ring Modulation',
    label: 'Ring',
    type: INTEGER,
    spec: {
      lowerByteOffset: 55,
      lowerBitsOffset: 1,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [CUTOFF_VELOCITY]: {
    id: CUTOFF_VELOCITY,
    title: 'Cutoff Velocity',
    label: 'Velocity',
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 2,
      lowerBitsWidth: 1,
    },
    choices: THREE_WAY_CHOICES,
  },
  [CUTOFF_KEYBOARD_TRACK]: {
    id: CUTOFF_KEYBOARD_TRACK,
    title: 'Cutoff Keyboard Track',
    label: 'Key Track',
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 4,
      lowerBitsWidth: 1,
    },
    choices: THREE_WAY_CHOICES,
  },
  [CUTOFF_TYPE]: {
    id: CUTOFF_TYPE,
    title: 'Filter Type',
    label: '2-Pole',
    type: INTEGER,
    spec: {
      lowerByteOffset: 56,
      lowerBitsOffset: 6,
      lowerBitsWidth: 1,
    },
    choices: [
      '2-Pole',
      '4-Pole',
    ],
  },
  [LFO_TARGET]: {
    id: LFO_TARGET,
    title: 'LFO Target',
    label: 'Target',
    type: INTEGER,
    spec: {
      lowerByteOffset: 59,
      lowerBitsOffset: 4,
      lowerBitsWidth: 2,
    },
    choices: [
      'Cutoff',
      'Shape',
      'Pitch',
    ],
  },
  [LFO_EG]: {
    id: LFO_EG,
    title: 'LFO EG',
    label: 'EG Mod',
    type: INTEGER,
    spec: {
      lowerByteOffset: 59,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
    choices: [
      'Off',
      'Rate',
      'Int',
    ],
  },
  [LFO_WAVE]: {
    id: LFO_WAVE,
    title: 'LFO Wave',
    label: 'Wave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 60,
      lowerBitsOffset: 0,
      lowerBitsWidth: 2,
    },
    choices: WAVE_CHOICES,
  },
  [DELAY_OUTPUT_ROUTING]: {
    id: DELAY_OUTPUT_ROUTING,
    title: 'Delay Output Routing',
    label: 'Output Routing',
    type: INTEGER,
    spec: {
      lowerByteOffset: 60,
      lowerBitsOffset: 6,
      lowerBitsWidth: 2,
    },
    choices: [
      'Bypass',
      'Pre-Filter',
      'Post-Filter',
    ],
  },
  [PORTAMENTO_TIME]: {
    id: PORTAMENTO_TIME,
    title: 'Portamento Time',
    label: 'Portamento Time',
    type: INTEGER,
    spec: {
      lowerByteOffset: 61,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    func: value => (value === 0 ? 'Off' : `${value}`), // 0,1-127 => Off,1-127
  },
  [VOICE_MODE]: {
    id: VOICE_MODE,
    title: 'Voice Mode',
    label: 'Voice Mode',
    type: INTEGER,
    spec: {
      lowerByteOffset: 64,
      lowerBitsOffset: 0,
      lowerBitsWidth: 3,
    },
    choices: [
      'Poly',
      'Duo',
      'Unison',
      'Mono',
      'Chord',
      'Delay',
      'Arp',
      'Sidechain',
    ],
  },
  [VOICE_MODE_DEPTH]: {
    id: VOICE_MODE_DEPTH,
    title: 'Voice Mode Depth',
    label: 'Voice Mode Depth',
    type: INTEGER,
    spec: {
      upperByteOffset: 70,
      lowerByteOffset: 64,
      lowerBitsOffset: 4,
    },
    func: translateVoiceModeDepth,
  },
  [BEND_RANGE_POSITIVE]: {
    id: BEND_RANGE_POSITIVE,
    title: 'Bend Range Positive',
    label: 'Bend Range (+)',
    type: INTEGER,
    spec: {
      lowerByteOffset: 66,
      lowerBitsOffset: 0,
      lowerBitsWidth: 4,
    },
  },
  [BEND_RANGE_NEGATIVE]: {
    id: BEND_RANGE_NEGATIVE,
    title: 'Bend Range Negative',
    label: 'Bend Range (-)',
    type: INTEGER,
    spec: {
      lowerByteOffset: 66,
      lowerBitsOffset: 4,
      lowerBitsWidth: 4,
    },
  },
  [LFO_KEY_SYNC]: {
    id: LFO_KEY_SYNC,
    title: 'LFO Key Sync',
    label: 'LFO Key Sync',
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 0,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [LFO_BPM_SYNC]: {
    id: LFO_BPM_SYNC,
    title: 'LFO BPM Sync',
    label: 'LFO BPM Sync',
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 1,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [LFO_VOICE_SYNC]: {
    id: LFO_VOICE_SYNC,
    title: 'LFO Voice Sync',
    label: 'LFO Voice Sync',
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 2,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [PORTAMENTO_BPM]: {
    id: PORTAMENTO_BPM,
    title: 'Portamento BPM',
    label: 'Portamento BPM',
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 3,
      lowerBitsWidth: 1,
    },
    choices: SWITCH_CHOICES,
  },
  [PORTAMENTO_MODE]: {
    id: PORTAMENTO_MODE,
    title: 'Portamento Mode',
    label: 'Portamento Mode',
    type: INTEGER,
    spec: {
      lowerByteOffset: 69,
      lowerBitsOffset: 4,
      lowerBitsWidth: 1,
    },
    choices: [
      'Auto',
      'On',
    ],
  },
  [PROGRAM_LEVEL]: {
    id: PROGRAM_LEVEL,
    title: 'Program Level',
    label: 'Program Level',
    type: INTEGER,
    spec: {
      lowerByteOffset: 71,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    // 77~127=-25~+25
    func: value => (((value >= 77) && (value <= 127)) ? mapToRange(value, 77, 127, -25, 25) : 0),
  },
  [SLIDER_ASSIGN]: {
    id: SLIDER_ASSIGN,
    title: 'Slider Assign',
    label: 'Slider Assign',
    type: INTEGER,
    spec: {
      lowerByteOffset: 72, // This doesn't match the spec
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    choices: [
      'Pitch Bend',
      'Gate Time',
      'VCO1 Pitch',
      'VCO1 Shape',
      'VCO2 Pitch',
      'VCO2 Shape',
      'Cross Mod Depth',
      'VCO2 Pitch EG Int',
      'VCO1 Level',
      'VCO2 Level',
      'Noise Level',
      'Cutoff',
      'Resonance',
      'Filter EG Int',
      'Amp EG Attack',
      'Amp EG Decay',
      'Amp EG Sustain',
      'Amp EG Release',
      'EG Attack',
      'EG Decay',
      'EG Sustain',
      'EG Release',
      'LFO Rate',
      'LFO Int',
      'Delay Hi Pass Cutoff',
      'Delay Time',
      'Delay Feedback',
      'Portamento Time',
      'Voice Mode Depth',
    ],
  },
  [KEYBOARD_OCTAVE]: {
    id: KEYBOARD_OCTAVE,
    title: 'Keyboard Octave',
    label: 'Octave',
    type: INTEGER,
    spec: {
      lowerByteOffset: 73,
      lowerBitsOffset: 0,
      lowerBitsWidth: 3,
    },
    choices: [
      '-2',
      '-1',
      '0',
      '1',
      '2',
    ],
  },
  [BPM]: {
    id: BPM,
    title: 'BPM',
    label: 'Tempo',
    type: INTEGER,
    spec: {
      upperByteOffset: 101,
      upperBitsWidth: 4,
      lowerByteOffset: 100,
      lowerBitsWidth: 8,
    },
    func: value => value, // 100~3000=10.0~300.0
  },
  [STEP_LENGTH]: {
    id: STEP_LENGTH,
    title: 'Step Length',
    type: INTEGER,
    spec: {
      lowerByteOffset: 103,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
  },
  [SWING]: {
    id: SWING,
    title: 'Swing',
    type: INTEGER,
    spec: {
      lowerByteOffset: 104,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    func: value => mapToRange(value, 0, 127, -75, 75), // -75 +75
  },
  [DEFAULT_GATE_TIME]: {
    id: DEFAULT_GATE_TIME,
    title: 'Default Gate Time',
    type: INTEGER,
    spec: {
      lowerByteOffset: 105,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    func: value => mapToRange(value, 0, 71, 0, 100), // 0-71 -> 0-100%
    unit: '%',
  },
  [STEP_RESOLUTION]: {
    id: STEP_RESOLUTION,
    title: 'Step Resolution',
    type: INTEGER,
    spec: {
      lowerByteOffset: 106,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
    choices: [
      '1/16',
      '1/8',
      '1/4',
      '1/2',
      '1/1',
    ],
  },
};

export const getParameterDisplayValue = (program: Program, parameter: number) => {
  const param = paramData[parameter];
  const value = program[parameter];

  let parsedValue = 'choices' in param ? param.choices[value as number]
    : (param.func?.(value as number, program) ?? value);

  if (typeof parsedValue === 'number') {
    parsedValue = Math.round(parsedValue);
  }

  return `${parsedValue}${'unit' in param && param.unit ? ` ${param.unit}` : ''}`;
};
