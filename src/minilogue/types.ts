import { ComponentType, SVGProps } from 'react';

export type ProgramParams = { [param: number]: string | number | null };

export type MotionSlot = {
  motionOn: boolean,
  smoothOn: boolean,
  parameterId: number,
};

export type Note = {
  note: number,
  velocity: number,
  gateTime: number,
  triggerSwitch: number,
};

export type SequenceStep = {
  on: boolean,
  motionOn: number[],
  notes: Note[],
  motions: number[][],
  switch: boolean,
};

export type ProgramSequence = {
  motionSlots: MotionSlot[],
  steps: SequenceStep[],
};

export type Program = {
  parameters: ProgramParams,
  sequence: ProgramSequence,
};

export type Library = {
  name?: string | null,
  author?: string | null,
  version?: string | null,
  date?: string | null,
  prefix?: string | null,
  copyright?: string | null,
  programs: Program[],
  favorites?: number[],
};

export const INTEGER = 0;
export const STRING = 1;

export type IntegerSpec = {
  upperByteOffset?: number,
  upperBitsOffset?: number,
  upperBitsWidth?: number,
  lowerByteOffset?: number,
  lowerBitsOffset?: number,
  lowerBitsWidth?: number,
};

export type IntegerParamData = {
  type: typeof INTEGER,
  spec: IntegerSpec,
};

export type ChoiceParamData = IntegerParamData & {
  choices: { [index: number]: string },
  choiceIcons?: { [index: number]: ComponentType<SVGProps<SVGSVGElement>> },
  unit?: string,
};

export type StringParamData = {
  type: typeof STRING,
  spec: {
    start: number,
    end: number,
  },
};

export type ParamData = {
  id: number,
  title: string,
  label?: string,
  func?: (value: number, program: ProgramParams) => number | string,
} & (ChoiceParamData | IntegerParamData | StringParamData);

export type PortsMap = { [portId: string]: MIDIPort | undefined };
