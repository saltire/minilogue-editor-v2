import './Panel.css';
import * as programLib from '../minilogue/program';
import Knob from './Knob';
import ParameterKnob from './ParameterKnob';
import LEDArray from './LEDArray';
import ParameterSwitch from './ParameterSwitch';


export default function Panel() {
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

          <div className='keyboard-octave-leds'>
            <LEDArray parameter={programLib.KEYBOARD_OCTAVE} />
          </div>

          <ParameterSwitch parameter={programLib.KEYBOARD_OCTAVE} />
        </div>
      </div>
    </div>
  );
}
