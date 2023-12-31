import * as params from './program';
import { mapToRange } from '../utils';


const CODE_TO_PARAMETER: { [index: number]: number } = {
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

const messageToParameter = (code: number, value: number) => {
  const parameterValue = code in CODE_TO_CONVERSIONS
    ? CODE_TO_CONVERSIONS[code].to(value)
    : Math.round(mapToRange(value, 0, 127, 0, 1023));

  return [CODE_TO_PARAMETER[code], parameterValue];
};

export { CODE_TO_PARAMETER, messageToParameter };
