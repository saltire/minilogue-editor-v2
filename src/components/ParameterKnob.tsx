import { useAppDispatch, useAppSelector } from '../store';
import { setPanelParameter } from '../slices/programSlice';
import Knob, { KnobProps } from './Knob';


type ParameterKnobProps = Omit<KnobProps, 'value' | 'onChange'> & {
  parameter: string,
  label: string,
};

export default function ParameterKnob({ parameter, label, ...props }: ParameterKnobProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram[parameter];

  return (
    <div className='control-group'>
      <div className='control-wrapper'>
        <Knob
          value={value || 0}
          onChange={newValue => dispatch(setPanelParameter({ parameter, value: newValue }))}
          {...props}
        />
        <p className='control-label label'>{label}</p>
      </div>
    </div>
  );
}
