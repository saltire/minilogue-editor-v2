import { useCallback } from 'react';

import './VoiceMode.css';
import PolyIcon from '../assets/poly.svg';
import DuoIcon from '../assets/duo.svg';
import UnisonIcon from '../assets/unison.svg';
import MonoIcon from '../assets/mono.svg';
import ChordIcon from '../assets/chord.svg';
import ArpIcon from '../assets/arp.svg';
import DelayIcon from '../assets/delay.svg';
import SidechainIcon from '../assets/sidechain.svg';
import { VOICE_MODE, paramData } from '../minilogue/params';
import { ChoiceParamData } from '../minilogue/types';
import { useAppDispatch, useAppSelector } from '../store';
import { classList } from '../utils';
import { setParameter } from '../slices/programSlice';


const icons = [
  <PolyIcon />,
  <DuoIcon />,
  <UnisonIcon />,
  <MonoIcon />,
  <ChordIcon />,
  <ArpIcon />,
  <DelayIcon />,
  <SidechainIcon />,
];
const VOICE_MODE_CHOICES = Object.values((paramData[VOICE_MODE] as ChoiceParamData).choices);

export default function VoiceMode() {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const value = currentProgram.parameters[VOICE_MODE];
  const onChange = useCallback((newValue: number) => dispatch(setParameter(VOICE_MODE, newValue)),
    [dispatch]);

  return (
    <div className='voice-mode-container'>
      <div className='button-group'>
        {VOICE_MODE_CHOICES.map((label, choiceValue) => (
          <div key={label}>
            <button
              type='button'
              className='button'
              title={label}
              aria-label={label}
              onClick={() => onChange(choiceValue)}
            />
            <p className='label'>{label}</p>
            <div>
              <button
                type='button'
                title={label}
                aria-label={label}
                className={classList('voice-mode-light led-array-light',
                  choiceValue === value && 'led-array-light-active')}
                onClick={() => onChange(choiceValue)}
              />
            </div>
            <p>{icons[choiceValue]}</p>
          </div>
        ))}
      </div>
      <p className='control-label label voice-mode-label'>Voice Mode</p>
    </div>
  );
}
