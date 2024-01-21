import {
  MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent, useCallback, useRef,
} from 'react';

import './Knob.css';
import { clamp, mapToRange } from '../utils';


const coerceToStep = (value: number, low: number, high: number, step: number) => {
  const adjusted = value - low;
  const nearestStep = Math.round(adjusted / step) * step;
  return Math.max(low, Math.min(high, low + nearestStep));
};

export type KnobProps = {
  value: number,
  min?: number,
  max?: number,
  angleOffset?: number,
  arc?: number,
  step?: number,
  onChange: (value: number) => void,
};

const defaults = {
  min: 0,
  max: 1023,
  angleOffset: -135,
  arc: 270,
  step: 1,
};

export default function Knob({ value, onChange, ...props }: KnobProps) {
  const { min, max, angleOffset, arc, step } = { ...defaults, ...props };

  const knobElement = useRef<HTMLDivElement>(null);
  const angle = Math.round(mapToRange(value, min, max, angleOffset, angleOffset + arc));

  const move = useCallback((clientX: number, clientY: number) => {
    if (knobElement.current) {
      const { width, height, top, left } = knobElement.current.getBoundingClientRect();
      const centerX = left + (width / 2);
      const centerY = top + (height / 2);
      const dX = clientX - centerX;
      const dY = clientY - centerY;

      let newAngle = Math.atan2(dY, dX) * (180 / Math.PI);
      if (dX <= 0 && dY >= 0) {
        newAngle -= 270;
      }
      else {
        newAngle += 90;
      }
      const minAngle = angleOffset;
      const maxAngle = angleOffset + arc;
      const clamped = clamp(newAngle, minAngle, maxAngle);
      const mapped = Math.round(mapToRange(clamped, minAngle, maxAngle, min, max));
      const newValue = coerceToStep(mapped, min, max, step);
      onChange(newValue);
    }
  }, [knobElement, min, max, angleOffset, arc, step, onChange]);

  const onMouseDown = useCallback((e: ReactMouseEvent) => {
    move(e.clientX, e.clientY);
    e.preventDefault();

    const onMouseMove = (ev: MouseEvent) => {
      move(ev.clientX, ev.clientY);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [move]);

  const onWheel = useCallback((e: ReactWheelEvent) => {
    const { deltaY } = e;

    let delta = step;
    delta = (deltaY >= 0) ? -delta : delta;
    const newValue = clamp(value + delta, min, max);
    onChange(newValue);
  }, [value, min, max, step, onChange]);

  return (
    <div
      className='knob-container'
      role='slider'
      title={`${value}`}
      aria-label={`${value}`}
      aria-valuenow={value}
      tabIndex={-1}
      onMouseDown={onMouseDown}
      onWheel={onWheel}
    >
      <div
        className='knob-value'
        ref={knobElement}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className='knob-value-inner' />
      </div>
    </div>
  );
}
