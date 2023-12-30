export type Program = { [param: number]: string | number | null };

type BaseParamData = {
  parameter: number,
};

export type IntegerSpec = {
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

export type ParamData = IntegerParamData | StringParamData;
