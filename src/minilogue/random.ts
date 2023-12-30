import { DISPLAY_OPTIONS } from './display';
import { INIT_PROGRAM, PARAMETERS, PROGRAM_NAME } from './program';
import { IntegerSpec } from './types';


const random = (range: number) => Math.floor(Math.random() * range);

// Random Minilogue program generator.
const generateRandomProgram = (parameters?: number[]) => {
  const newProgram = { ...INIT_PROGRAM };

  PARAMETERS.forEach(param => {
    if (parameters && !parameters.includes(param.parameter)) {
      return;
    }

    // TODO: unify parameters and display options, for easier type narrowing?
    const options = DISPLAY_OPTIONS[param.parameter];
    if (options.type === 'choice') {
      const choices = Object.keys(options.choices);
      newProgram[param.parameter] = parseInt(choices[random(choices.length)]);
    }
    else if (options.type === 'integer') {
      const {
        upperByteOffset, upperBitsWidth = 8, lowerByteOffset, lowerBitsWidth = 2,
      } = param.spec as IntegerSpec;
      let numBits = 0;
      if (upperByteOffset !== undefined) {
        numBits += upperBitsWidth;
      }
      if (lowerByteOffset !== undefined) {
        numBits += lowerBitsWidth;
      }
      newProgram[param.parameter] = random(2 ** numBits);
    }
  });

  newProgram[PROGRAM_NAME] = 'Random';
  return newProgram;
};

export default generateRandomProgram;
