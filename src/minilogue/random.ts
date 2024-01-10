import { PROGRAM_NAME, paramData } from './params';
import { INIT_PROGRAM } from './program';
import { INTEGER, ProgramParams } from './types';


const random = (range: number) => Math.floor(Math.random() * range);

// Random Minilogue program generator.
const generateRandomProgram = (parameters?: number[]) => {
  const newParams: ProgramParams = {
    ...INIT_PROGRAM.parameters,
    [PROGRAM_NAME]: 'Random',
  };

  Object.values(paramData).forEach(param => {
    if (parameters && !parameters.includes(param.id)) {
      return;
    }

    // TODO: unify parameters and display options, for easier type narrowing?
    if (param.type === INTEGER && 'choices' in param) {
      newParams[param.id] = random(param.choices.length);
    }
    else if (param.type === INTEGER) {
      const {
        upperByteOffset, upperBitsWidth = 8, lowerByteOffset, lowerBitsWidth = 2,
      } = param.spec;
      let numBits = 0;
      if (upperByteOffset !== undefined) {
        numBits += upperBitsWidth;
      }
      if (lowerByteOffset !== undefined) {
        numBits += lowerBitsWidth;
      }
      newParams[param.id] = random(2 ** numBits);
    }
  });

  return {
    parameters: newParams,
    // sequence: {},
  };
};

export default generateRandomProgram;
