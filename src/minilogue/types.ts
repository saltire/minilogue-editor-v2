export type Program = { [param: number]: string | number | null };

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

export type ParamData = ChoiceParamData | IntegerParamData | StringParamData;

export type Param = {
  id: number,
  title: string,
  label?: string,
  func?: (value: number, program: Program) => number | string,
} & ParamData;
