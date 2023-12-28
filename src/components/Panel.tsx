import './Panel.css';
import { useAppSelector } from '../store';
import * as programLib from '../minilogue/program';
import Knob from './Knob';
import ParameterKnob from './ParameterKnob';


export default function Panel() {
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  return (
    <div className='panel'>
      <header>
        <h1 className='program-title'>
          Program
        </h1>
      </header>

      <div className='panel-controls'>
        <div className='panel-section'>
          <div className='control-group'>
            <div className='control-wrapper'>
              <Knob value={1023} />
            </div>
            <p className='control-label label'>Master</p>
          </div>

          <ParameterKnob
            parameter={programLib.BPM}
            min={100}
            max={3000}
          />
        </div>
      </div>

      {JSON.stringify(currentProgram)}
    </div>
  );
}
