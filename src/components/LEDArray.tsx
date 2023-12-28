import './LEDArray.css';
import { useAppDispatch, useAppSelector } from '../store';
import { DISPLAY_OPTIONS } from '../minilogue/display';
import { setPanelParameter } from '../slices/programSlice';
import { classList } from '../utils';


type LEDArrayProps = {
  parameter: number,
  reverse?: boolean,
};

export default function LEDArray({ parameter, reverse }: LEDArrayProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram[parameter];

  const options = DISPLAY_OPTIONS[parameter];
  if (options.type !== 'choice') {
    return null;
  }
  const choices = Object.entries(options.choices)
    .map(([key, label]) => ({ label, value: parseInt(key) }));
  if (reverse) {
    choices.reverse();
  }

  return (
    <ul className='led-array'>
      {choices.map(choice => (
        <li key={choice.label} className='led-array-value'>
          <button
            type='button'
            title={choice.label}
            aria-label={choice.label}
            className={classList('led-array-light',
              choice.value === value && 'led-array-light-active')}
            onClick={() => dispatch(setPanelParameter({ parameter, value: choice.value }))}
          />
        </li>
      ))}
    </ul>
  );
}
