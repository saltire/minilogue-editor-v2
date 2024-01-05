import { PROGRAM_NAME, paramData } from './params';
import { INIT_PROGRAM } from './program';
import { INTEGER } from './types';


const random = (range: number) => Math.floor(Math.random() * range);

// Random Minilogue program generator.
const generateRandomProgram = (parameters?: number[]) => {
  const newProgram = { ...INIT_PROGRAM };

  Object.values(paramData).forEach(param => {
    if (parameters && !parameters.includes(param.id)) {
      return;
    }

    // TODO: unify parameters and display options, for easier type narrowing?
    if (param.type === INTEGER && 'choices' in param) {
      newProgram[param.id] = random(param.choices.length);
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
      newProgram[param.id] = random(2 ** numBits);
    }
  });

  newProgram[PROGRAM_NAME] = 'Random';
  return newProgram;
};

export default generateRandomProgram;
