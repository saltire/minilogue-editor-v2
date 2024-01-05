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

export const INTEGER = 0;
export const STRING = 1;

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

export type IntegerSpec = {
  upperByteOffset?: number,
  upperBitsOffset?: number,
  upperBitsWidth?: number,
  lowerByteOffset?: number,
  lowerBitsOffset?: number,
  lowerBitsWidth?: number,
};

type IntegerParamData = {
  type: typeof INTEGER,
  spec: IntegerSpec,
};

type ChoiceParamData = IntegerParamData & {
  choices: string[],
};

type StringParamData = {
  type: typeof STRING,
  spec: {
    start: number,
    end: number,
  },
};

export type ParamData = ChoiceParamData | IntegerParamData | StringParamData;

type Param = {
  id: number,
  title: string,
  label?: string,
} & ParamData;

export const params: { [index: number]: Param } = {
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
    type: INTEGER, // -75 +75
    spec: {
      lowerByteOffset: 104,
      lowerBitsOffset: 0,
      lowerBitsWidth: 8,
    },
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
