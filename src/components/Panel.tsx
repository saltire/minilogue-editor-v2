import './Panel.css';
import SawtoothIcon from '../assets/saw.svg';
import SquareIcon from '../assets/square.svg';
import TriangleIcon from '../assets/triangle.svg';
import * as params from '../minilogue/program';
import Knob from './Knob';
import ParameterKnob from './ParameterKnob';
import LEDArray from './LEDArray';
import ParameterSwitch from './ParameterSwitch';


const WAVE_ICONS = [
  <SawtoothIcon />,
  <TriangleIcon />,
  <SquareIcon />,
];

export default function Panel() {
  return (
    <div className='panel'>
      <header>
        <h1 className='program-title'>
          Program
        </h1>
      </header>

      <div className='panel-controls'>
        <div id='global' className='panel-section row-1-3'>
          <div className='control-group'>
            <div className='control-wrapper'>
              <Knob value={1023} />
            </div>
            <p className='control-label label'>Master</p>
          </div>

          <ParameterKnob
            parameter={params.BPM}
            min={100}
            max={3000}
          />

          <div className='keyboard-octave-leds'>
            <LEDArray parameter={params.KEYBOARD_OCTAVE} />
          </div>

          <ParameterSwitch parameter={params.KEYBOARD_OCTAVE} vertical={false} />
        </div>

        <div id='vcos' className='panel-section col-2-4 row-1-3'>
          <div id='vco1' className='panel-group'>
            <h2 className='panel-group-label label'>VCO 1</h2>
            <ParameterSwitch parameter={params.VCO1_OCTAVE} />
            <LEDArray parameter={params.VCO1_OCTAVE} reverse />
            <ParameterSwitch
              parameter={params.VCO1_WAVE}
              labels={[
                <SawtoothIcon />,
                <TriangleIcon />,
                <SquareIcon />,
              ]}
            />
            <ParameterKnob parameter={params.VCO1_PITCH} />
            <ParameterKnob parameter={params.VCO1_SHAPE} />
          </div>

          <div id='vco2' className='panel-group'>
            <h2 className='panel-group-label label'>VCO 2</h2>
            <ParameterSwitch parameter={params.VCO2_OCTAVE} />
            <LEDArray parameter={params.VCO2_OCTAVE} reverse />
            <ParameterSwitch
              parameter={params.VCO2_WAVE}
              labels={WAVE_ICONS}
            />
            <ParameterKnob parameter={params.VCO2_PITCH} />
            <ParameterKnob parameter={params.VCO2_SHAPE} />
          </div>

          <div id='vco2-mod' className='panel-group pad-left'>
            <h2 className='panel-group-label label'>VCO 2 Modulation</h2>
            <ParameterKnob parameter={params.CROSS_MOD_DEPTH} />
            <ParameterKnob parameter={params.VCO2_PITCH_EG_INT} />
            <ParameterSwitch parameter={params.SYNC} className='control-group-half-width' />
            <ParameterSwitch parameter={params.RING} className='control-group-half-width' />
          </div>
        </div>

        <div id='mixer' className='panel-section panel-group col-6-1 row-1-3'>
          <h2 className='panel-group-label label'>Mixer</h2>
          <ParameterKnob parameter={params.VCO1_LEVEL} />
          <ParameterKnob parameter={params.VCO2_LEVEL} />
          <ParameterKnob parameter={params.NOISE_LEVEL} />
        </div>

        <div id='filter' className='panel-section panel-group col-7-2 row-1-3'>
          <h2 className='panel-group-label label label-raised'>Filter</h2>
          <ParameterKnob parameter={params.CUTOFF} className='large-knob' />
          <ParameterKnob parameter={params.RESONANCE} />
          <ParameterKnob parameter={params.CUTOFF_EG_INT} />
          <p className='label control-label control-label-top'>4-Pole</p>
          <ParameterSwitch parameter={params.CUTOFF_TYPE} className='control-group-two-thirds-width' />
          <ParameterSwitch parameter={params.CUTOFF_KEYBOARD_TRACK} className='control-group-two-thirds-width' />
          <ParameterSwitch parameter={params.CUTOFF_VELOCITY} className='control-group-two-thirds-width' />
        </div>

        <div id='eg-lfo' className='panel-section col-9-4 row-1-3'>
          <div id='amp-eg' className='panel-group'>
            <h2 className='panel-group-label label'>Amp EG</h2>
            <ParameterKnob parameter={params.AMP_EG_ATTACK} />
            <ParameterKnob parameter={params.AMP_EG_DECAY} />
            <ParameterKnob parameter={params.AMP_EG_SUSTAIN} />
            <ParameterKnob parameter={params.AMP_EG_RELEASE} />
          </div>

          <div id='eg' className='panel-group'>
            <h2 className='panel-group-label label'>Amp EG</h2>
            <ParameterKnob parameter={params.EG_ATTACK} />
            <ParameterKnob parameter={params.EG_DECAY} />
            <ParameterKnob parameter={params.EG_SUSTAIN} />
            <ParameterKnob parameter={params.EG_RELEASE} />
          </div>

          <div id='lfo' className='panel-group'>
            <h2 className='panel-group-label label'>LFO</h2>
            <ParameterSwitch
              parameter={params.LFO_WAVE}
              className='control-group-half-width'
              labels={WAVE_ICONS}
            />
            <ParameterSwitch
              parameter={params.LFO_EG}
              className='control-group-half-width'
              showLabels
            />
            <ParameterKnob parameter={params.LFO_RATE} />
            <ParameterKnob parameter={params.LFO_INT} />
            <ParameterSwitch
              parameter={params.LFO_TARGET}
              showLabels
            />
          </div>
        </div>

        <div id='delay-interaction' className='panel-section col-13-4 row-1-2'>
          <div id='delay' className='panel-group'>
            <h2 className='panel-group-label label'>Delay</h2>
            <ParameterKnob parameter={params.DELAY_HI_PASS_CUTOFF} />
            <ParameterKnob parameter={params.DELAY_TIME} />
            <ParameterKnob parameter={params.DELAY_FEEDBACK} />
            <ParameterSwitch parameter={params.DELAY_OUTPUT_ROUTING} showLabels />
          </div>
        </div>
      </div>
    </div>
  );
}
