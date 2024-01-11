import { ReactNode } from 'react';

import './ParameterSwitch.css';
import { useAppDispatch, useAppSelector } from '../store';
import { setPanelParameter } from '../slices/programSlice';
import Switch from './Switch';
import { paramData } from '../minilogue/params';
import { classList } from '../utils';


type ParameterSwitchProps = {
  parameter: number,
  className?: string,
  labels?: ReactNode[],
  showLabels?: boolean,
  vertical?: boolean,
};

export default function ParameterSwitch({
  parameter, className, labels, showLabels, vertical,
}: ParameterSwitchProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram.parameters[parameter] as number;

  const param = paramData[parameter];
  if (!('choices' in param)) {
    return null;
  }

  const choices = Object.values(param.choices).reverse();

  return (
    <div className={classList('control-group', className)}>
      <div className='control-wrapper'>
        <Switch
          value={value}
          numPositions={choices.length}
          vertical={vertical}
          onChange={newValue => dispatch(setPanelParameter({ parameter, value: newValue }))}
        />

        {labels && (
          <div className='switch-label-wrapper'>
            <ul className='switch-labels'>
              {labels.map((label, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={`label-${i}`} className='switch-label'>
                  <div className='switch-value-label'>{label}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!labels && showLabels && (
          <div className='switch-label-wrapper'>
            <ul className='switch-labels'>
              {choices.map(label => (
                <li key={label} className='switch-label'>
                  <div className='switch-value-label'>{label}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className='control-label label'>{param.label}</p>
    </div>
  );
}
