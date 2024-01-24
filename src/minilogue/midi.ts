import * as params from './params';
import { encodeProgram } from './program';
import {
  CURRENT_PROGRAM_DATA_DUMP, CURRENT_PROGRAM_DATA_DUMP_REQUEST,
  PROGRAM_DATA_DUMP, PROGRAM_DATA_DUMP_REQUEST,
  HIGH_BIT_MASK, LOW_BITS_MASK,
  encodeProgramIndex, encodeSysexData, GLOBAL_DATA_DUMP_REQUEST,
} from './sysex';
import { Library, PortsMap, Program } from './types';
import { delay, mapToRange, range, series } from '../utils';


// MIDI message types
export const CONTROL_CHANGE = 0xb;
export const PROGRAM_CHANGE = 0xc;
export const CLOCK = 0xf;

export const BANK_SELECT_HIGH = 0x0;
export const BANK_SELECT_LOW = 0x20;

export const CODE_TO_PARAMETER: { [index: number]: number } = {
  16: params.AMP_EG_ATTACK,
  17: params.AMP_EG_DECAY,
  18: params.AMP_EG_SUSTAIN,
  19: params.AMP_EG_RELEASE,
  20: params.EG_ATTACK,
  21: params.EG_DECAY,
  22: params.EG_SUSTAIN,
  23: params.EG_RELEASE,
  24: params.LFO_RATE,
  26: params.LFO_INT,
  27: params.VOICE_MODE_DEPTH,
  29: params.DELAY_HI_PASS_CUTOFF,
  30: params.DELAY_TIME,
  31: params.DELAY_FEEDBACK,
  33: params.NOISE_LEVEL,
  34: params.VCO1_PITCH,
  35: params.VCO2_PITCH,
  36: params.VCO1_SHAPE,
  37: params.VCO2_SHAPE,
  39: params.VCO1_LEVEL,
  40: params.VCO2_LEVEL,
  41: params.CROSS_MOD_DEPTH,
  42: params.VCO2_PITCH_EG_INT,
  43: params.CUTOFF,
  44: params.RESONANCE,
  45: params.CUTOFF_EG_INT,
  48: params.VCO1_OCTAVE,
  49: params.VCO2_OCTAVE,
  50: params.VCO1_WAVE,
  51: params.VCO2_WAVE,
  56: params.LFO_TARGET,
  57: params.LFO_EG,
  58: params.LFO_WAVE,
  80: params.SYNC,
  81: params.RING,
  82: params.CUTOFF_VELOCITY,
  83: params.CUTOFF_KEYBOARD_TRACK,
  84: params.CUTOFF_TYPE,
  88: params.DELAY_OUTPUT_ROUTING,
};

const toTwoChoice = (value: number) => [0, 127].indexOf(value);
const toThreeChoice = (value: number) => [0, 64, 127].indexOf(value);
const toFourChoice = (value: number) => [0, 42, 84, 127].indexOf(value);

const twoChoiceToMIDIValue = (choice: number) => [0, 127][choice];
const threeChoiceToMIDIValue = (choice: number) => [0, 64, 127][choice];
const fourChoiceToMIDIValue = (choice: number) => [0, 42, 84, 127][choice];

type Conversions = {
  to: (value: number) => number | undefined,
  from: (value: number) => number | undefined,
};

const TWO_CHOICE_CONVERSIONS = {
  to: toTwoChoice,
  from: twoChoiceToMIDIValue,
};
const THREE_CHOICE_CONVERSIONS = {
  to: toThreeChoice,
  from: threeChoiceToMIDIValue,
};
const FOUR_CHOICE_CONVERSIONS = {
  to: toFourChoice,
  from: fourChoiceToMIDIValue,
};

const CODE_TO_CONVERSIONS: { [index: number]: Conversions } = {
  48: FOUR_CHOICE_CONVERSIONS,
  49: FOUR_CHOICE_CONVERSIONS,
  50: THREE_CHOICE_CONVERSIONS,
  51: THREE_CHOICE_CONVERSIONS,
  56: THREE_CHOICE_CONVERSIONS,
  57: THREE_CHOICE_CONVERSIONS,
  58: THREE_CHOICE_CONVERSIONS,
  64: FOUR_CHOICE_CONVERSIONS,
  65: FOUR_CHOICE_CONVERSIONS,
  66: THREE_CHOICE_CONVERSIONS,
  67: THREE_CHOICE_CONVERSIONS,
  80: TWO_CHOICE_CONVERSIONS,
  81: TWO_CHOICE_CONVERSIONS,
  82: THREE_CHOICE_CONVERSIONS,
  83: THREE_CHOICE_CONVERSIONS,
  84: TWO_CHOICE_CONVERSIONS,
  88: THREE_CHOICE_CONVERSIONS,
  90: THREE_CHOICE_CONVERSIONS,
  91: THREE_CHOICE_CONVERSIONS,
  92: THREE_CHOICE_CONVERSIONS,
};

export const messageToParameter = (code: number, value: number) => {
  const parameterValue = code in CODE_TO_CONVERSIONS
    ? CODE_TO_CONVERSIONS[code].to(value)
    : Math.round(mapToRange(value, 0, 127, 0, 1023));

  return [CODE_TO_PARAMETER[code], parameterValue];
};

const channel = 0;

const buildMessage = (type: number, data?: number[] | Uint8Array) => [
  0xf0, 0x42, 0x30 | channel, 0x00, 0x01, 0x2c, type, ...data ?? [], 0xf7,
];

export const requestCurrentProgram = (output: MIDIOutput) => {
  output.send(buildMessage(CURRENT_PROGRAM_DATA_DUMP_REQUEST));
};

export const requestProgram = (output: MIDIOutput, index: number) => {
  output.send(buildMessage(PROGRAM_DATA_DUMP_REQUEST, encodeProgramIndex(index)));
};

export const requestLibrary = (output: MIDIOutput) => series(range(200), async i => {
  requestProgram(output, i);
  await delay(150); // TODO: listen for response before proceeding to next request.
});

export const requestGlobalData = (output: MIDIOutput) => {
  output.send(buildMessage(GLOBAL_DATA_DUMP_REQUEST));
};

export const sendCurrentProgram = (output: MIDIOutput, program: Program) => {
  output.send(buildMessage(CURRENT_PROGRAM_DATA_DUMP, encodeSysexData(encodeProgram(program))));
};

export const sendProgram = (output: MIDIOutput, index: number, program: Program) => {
  output.send(buildMessage(PROGRAM_DATA_DUMP, [
    ...encodeProgramIndex(index),
    ...encodeSysexData(encodeProgram(program)),
  ]));
};

export const sendLibrary = (output: MIDIOutput, library: Library) => series(library.programs,
  async (program, i) => {
    sendProgram(output, i, program);
    await delay(150); // TODO: listen for response before proceeding to next request.
  });

export const getOutputPort = (ports: PortsMap) => Object.values(ports)
  .filter((port: MIDIPort | undefined): port is MIDIOutput => port?.type === 'output')
  .find(port => port.name?.includes('SOUND'));

export type BitsData = {
  high?: number,
  low?: number,
};
export const updateBits = (current: number | undefined, { high, low }: BitsData) => (
  ((high !== undefined ? (high << 7) : (current ?? 0)) & HIGH_BIT_MASK)
  | ((low ?? current ?? 0) & LOW_BITS_MASK));
