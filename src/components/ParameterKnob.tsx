import { useAppDispatch, useAppSelector } from '../store';
import { setParameter } from '../slices/programSlice';
import Knob, { KnobProps } from './Knob';
import { paramData, getParameterDisplayString } from '../minilogue/params';
import { classList } from '../utils';


type ParameterKnobProps = Omit<KnobProps, 'value' | 'onChange'> & {
  className?: string,
  parameter: number,
};

export default function ParameterKnob({ className, parameter, ...props }: ParameterKnobProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram.parameters[parameter] as number;

  return (
    <div
      className={classList('control-group', className)}
      title={getParameterDisplayString(currentProgram, parameter)}
    >
      <div className='control-wrapper'>
        <Knob
          value={value || 0}
          onChange={newValue => dispatch(setParameter(parameter, newValue))}
          {...props}
        />
        <p className='control-label label'>{paramData[parameter].label}</p>
      </div>
    </div>
  );
}
