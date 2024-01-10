export type ProgramParams = { [param: number]: string | number | null };

export type Program = {
  parameters: ProgramParams,
  // sequence: ProgramSequence,
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

type IntegerParamData = {
  type: typeof INTEGER,
  spec: IntegerSpec,
};

type ChoiceParamData = IntegerParamData & {
  choices: string[],
  unit?: string,
};

type StringParamData = {
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
