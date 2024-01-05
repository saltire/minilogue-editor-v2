import { useAppDispatch, useAppSelector } from '../store';
import { setPanelParameter } from '../slices/programSlice';
import Knob, { KnobProps } from './Knob';
import { getParameterDisplayValue } from '../minilogue/display';
import { params } from '../minilogue/params';
import { classList } from '../utils';


type ParameterKnobProps = Omit<KnobProps, 'value' | 'onChange'> & {
  className?: string,
  parameter: number,
};

export default function ParameterKnob({ className, parameter, ...props }: ParameterKnobProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram[parameter] as number;

  return (
    <div
      className={classList('control-group', className)}
      title={getParameterDisplayValue(currentProgram, parameter)}
    >
      <div className='control-wrapper'>
        <Knob
          value={value || 0}
          onChange={newValue => dispatch(setPanelParameter({ parameter, value: newValue }))}
          {...props}
        />
        <p className='control-label label'>{params[parameter].label}</p>
      </div>
    </div>
  );
}
