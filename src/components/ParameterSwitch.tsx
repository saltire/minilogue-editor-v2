import { useAppDispatch, useAppSelector } from '../store';
import { setPanelParameter } from '../slices/programSlice';
import Switch from './Switch';
import { DISPLAY_OPTIONS, getParameterPanelLabel } from '../minilogue/display';


type ParameterSwitchProps = {
  parameter: number,
  labels?: string[],
};

export default function ParameterSwitch({ parameter, labels }: ParameterSwitchProps) {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const value = currentProgram[parameter];

  const options = DISPLAY_OPTIONS[parameter];
  if (options.type !== 'choice') {
    return null;
  }

  return (
    <div className='control-group'>
      <div className='control-wrapper'>
        <Switch
          value={value}
          numPositions={Object.keys(options.choices).length}
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
      </div>

      <p className='control-label label'>
        {getParameterPanelLabel(parameter)}
      </p>
    </div>
  );
}
