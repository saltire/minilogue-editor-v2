import { useState } from 'react';

import './Panel.css';
import DownArrowIcon from '../assets/down-arrow.svg';
import SawtoothIcon from '../assets/saw.svg';
import SquareIcon from '../assets/square.svg';
import TriangleIcon from '../assets/triangle.svg';
import UpArrowIcon from '../assets/up-arrow.svg';
import * as params from '../minilogue/params';
import { setCurrentPosition } from '../slices/librarySlice';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';
import Display from './Display';
import Knob from './Knob';
import LEDArray from './LEDArray';
import PanelMenu from './PanelMenu';
import ParameterKnob from './ParameterKnob';
import ParameterSwitch from './ParameterSwitch';
import SliderAssign from './SliderAssign';
import VoiceMode from './VoiceMode';
import { classList } from '../utils';


const WAVE_ICONS = [
  <SawtoothIcon />,
  <TriangleIcon />,
  <SquareIcon />,
];

export default function Panel() {
  const dispatch = useAppDispatch();
  const currentPosition = useAppSelector(({ library: l }) => l.currentPosition);
  const library = useAppSelector(({ library: l }) => l.library);
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const [showExtraParams, setShowExtraParams] = useState(false);

  return (
    <div>
      <PanelMenu />

      <div className='panel'>
        <header>
          <h1 className='program-title'>
            {currentProgram.parameters[params.PROGRAM_NAME]}
          </h1>
        </header>

        <div className='panel-controls'>
          <div id='global' className='panel-section col-1-1 row-1-3'>
            <div className='control-group'>
              <div className='control-wrapper'>
                <Knob value={1023} onChange={() => {}} />
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

            <div id='interaction' className='panel-group align-left'>
              <Display />

              <div className='control-group'>
                <div className='control-wrapper'>
                  <Knob
                    value={currentPosition}
                    max={library.programs.length - 1}
                    onChange={value => {
                      dispatch(setCurrentPosition(value));
                      dispatch(setCurrentProgram(library.programs[value]));
                    }}
                  />
                  <p className='control-label label'>Program/Value</p>
                </div>
              </div>
            </div>
          </div>

          <div id='voice-mode-depth' className='panel-group col-17-1 row-1-2'>
            <div className='control-group'>
              <button type='button' className='shift-button button' title='Shift' aria-label='Shift' />
              <p className='control-label label'>Shift</p>
            </div>
            <ParameterKnob parameter={params.VOICE_MODE_DEPTH} />
          </div>

          <div id='app-controls' className='panel-group col-13-2 row-3-1'>
            <h2 className='panel-group-label label label-small'>Edit</h2>
            <div className='button-group button-group-small'>
              <div>
                <button type='button' className='button' title='Edit Mode' aria-label='Edit Mode' />
                <p className='control-label label'>Edit Mode</p>
              </div>
              <div>
                <button type='button' className='button' title='Write' aria-label='Write' />
                <p className='control-label label'>Write</p>
              </div>
              <div>
                <button type='button' className='button' title='Exit' aria-label='Exit' />
                <p className='control-label label'>Exit</p>
              </div>
            </div>
          </div>

          <div id='sequence-controls' className='panel-group col-15-3 row-3-1 margin-left'>
            <h2 className='panel-group-label label label-small'>Sequencer</h2>
            <div className='button-group button-group-small'>
              <div>
                <button type='button' className='button' title='Step' aria-label='Step' />
                <p className='control-label label'>Step</p>
              </div>
              <div>
                <button type='button' className='button' title='Play' aria-label='Play' />
                <p className='control-label label'>Play</p>
              </div>
              <div>
                <button type='button' className='button' title='Rec' aria-label='Rec' />
                <p className='control-label label'>Rec</p>
              </div>
              <div>
                <button type='button' className='button' title='Rest' aria-label='Rest' />
                <p className='control-label label'>Rest</p>
              </div>
            </div>
          </div>

          <div id='voice-mode' className='panel-group col-13-5 row-4-2'>
            <VoiceMode />
          </div>
        </div>

        <div className={classList('slide', showExtraParams && 'slide-open')}>
          <div id='extra-parameters' className='panel-group extra-parameters'>
            <h2 className='label'>Additional Parameters</h2>
            <ParameterKnob parameter={params.BEND_RANGE_NEGATIVE} min={1} max={12} />
            <ParameterKnob parameter={params.BEND_RANGE_POSITIVE} min={1} max={12} />
            <ParameterKnob parameter={params.PROGRAM_LEVEL} min={1} max={12} />
            <ParameterKnob parameter={params.AMP_VELOCITY} min={1} max={12} />
            <ParameterKnob parameter={params.PORTAMENTO_TIME} min={1} max={12} />
            <ParameterSwitch parameter={params.PORTAMENTO_MODE} />
            <ParameterSwitch parameter={params.PORTAMENTO_BPM} />
            <ParameterSwitch parameter={params.LFO_BPM_SYNC} />
            <ParameterSwitch parameter={params.LFO_KEY_SYNC} />
            <ParameterSwitch parameter={params.LFO_VOICE_SYNC} />
            <SliderAssign />
          </div>
        </div>

        <button
          type='button'
          className='show-extra-params'
          title={`${showExtraParams ? 'Hide' : 'Show'} Additional Parameters`}
          aria-label={`${showExtraParams ? 'Hide' : 'Show'} Additional Parameters`}
          onClick={() => setShowExtraParams(prev => !prev)}
        >
          {showExtraParams ? <UpArrowIcon /> : <DownArrowIcon />}
        </button>
      </div>
    </div>
  );
}
