import './LEDArray.css';
import { useAppDispatch, useAppSelector } from '../store';
import { paramData } from '../minilogue/params';
import { setParameter } from '../slices/programSlice';
import { classList } from '../utils';


type LEDArrayProps = {
  parameter: number,
  reverse?: boolean,
};

export default function LEDArray({ parameter, reverse }: LEDArrayProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram.parameters[parameter];

  const param = paramData[parameter];
  if (!('choices' in param)) {
    return null;
  }

  const choices = Object.entries(param.choices)
    .map(([key, label]) => ({ label, value: parseInt(key) }));
  if (reverse) {
    choices.reverse();
  }

  return (
    <ul className='led-array'>
      {choices.map(({ label, value: choiceValue }) => (
        <li key={label} className='led-array-value'>
          <button
            type='button'
            title={label}
            aria-label={label}
            className={classList('led-array-light',
              choiceValue === value && 'led-array-light-active')}
            onClick={() => dispatch(setParameter(parameter, choiceValue))}
          />
        </li>
      ))}
    </ul>
  );
}
