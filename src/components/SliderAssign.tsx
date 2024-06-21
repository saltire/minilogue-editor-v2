import Select from 'react-select';

import { SLIDER_ASSIGN, paramData } from '../minilogue/params';
import { ChoiceParamData } from '../minilogue/types';
import { useAppDispatch, useAppSelector } from '../store';
import { setParameter } from '../slices/programSlice';


const options = Object.entries((paramData[SLIDER_ASSIGN] as ChoiceParamData).choices)
  .map(([key, label]) => ({ label, value: parseInt(key) }));

export default function SliderAssign() {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const value = currentProgram.parameters[SLIDER_ASSIGN];
  const selected = options.find(o => o.value === value);

  return (
    <div className='control-group select-control'>
      <div className='control-wrapper'>
        <Select
          value={selected}
          options={options}
          onChange={option => option && dispatch(
            setParameter(SLIDER_ASSIGN, option.value))}
        />
      </div>
      <p className='control-label label'>Slider Assign</p>
    </div>
  );
}
