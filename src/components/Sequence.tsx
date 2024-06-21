import { CSSProperties, Fragment } from 'react';
import Select from 'react-select';

import './Sequence.css';
import { motionParameterIds } from '../minilogue/params';
import { useAppDispatch, useAppSelector } from '../store';
import { range, toNote } from '../utils';
import { setMotionSlotParameter } from '../slices/programSlice';


const options = Object.entries(motionParameterIds)
  .map(([key, label]) => ({ label, value: parseInt(key) }));

/* eslint-disable react/no-array-index-key */
export default function Sequence() {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const { steps, motionSlots } = currentProgram.sequence;

  return (
    <div className='Sequence'>
      <div className='grid'>
        {motionSlots
          .filter(slot => slot.motionOn && slot.parameterId)
          .map((slot, s) => (
            <Fragment key={s}>
              <div>
                <Select
                  value={options.find(o => o.value === slot.parameterId)}
                  options={options}
                  onChange={option => option && dispatch(
                    setMotionSlotParameter({ index: s, parameter: option.value }))}
                />
                {slot.smoothOn && <><br />(smooth)</>}
              </div>
              {/* TODO: smoothing, switch */}
              {range(16).map(i => (
                <div
                  key={i}
                  className='fill-value'
                  style={{
                    ['--fill-value' as keyof CSSProperties]:
                      `${((steps[i].motions[s][0] || 0) / 255) * 100}%`,
                  }}
                >
                  {steps[i].motions[s][0]}
                  {!!slot.smoothOn && <><br />{'>'} {steps[i].motions[s][1]}</>}
                </div>
              ))}
            </Fragment>
          ))}

        <div>Notes</div>
        {/* TODO: piano roll view */}
        {/* TODO: velocity, gate time, trigger switch */}
        {steps.map((step, s) => (
          <div key={s}>
            {step.on && step.notes.filter(note => note.note).sort((a, b) => a.note - b.note)
              .map((note, n) => <div key={n}>{toNote(note.note)}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}
