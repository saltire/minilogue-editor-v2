import './LEDArray.css';
import { useAppDispatch, useAppSelector } from '../store';
import { params } from '../minilogue/params';
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

  const param = params[parameter];
  if (!('choices' in param)) {
    return null;
  }

  const choices = [...param.choices];
  if (reverse) {
    choices.reverse();
  }

  return (
    <ul className='led-array'>
      {choices.map((label, i) => (
        <li key={label} className='led-array-value'>
          <button
            type='button'
            title={label}
            aria-label={label}
            className={classList('led-array-light',
              value === i && 'led-array-light-active')}
            onClick={() => dispatch(setPanelParameter({ parameter, value: i }))}
          />
        </li>
      ))}
    </ul>
  );
}
