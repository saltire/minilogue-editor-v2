import {
  MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent,
  useCallback, useEffect, useRef, useState,
} from 'react';

import './Knob.css';
import { clamp } from '../utils';


const mapToRange = (
  value: number, inLow: number, inHigh: number, outLow: number, outHigh: number,
) => {
  const fromRange = inHigh - inLow;
  const toRange = outHigh - outLow;
  const scale = (value - inLow) / fromRange;
  return Math.round((toRange * scale) + outLow);
};

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
  onChange?: (value: number) => void,
};

const defaults = {
  min: 0,
  max: 1023,
  angleOffset: -135,
  arc: 270,
  step: 1,
};

export default function Knob({ value: initValue, onChange, ...props }: KnobProps) {
  const { min, max, angleOffset, arc, step } = { ...defaults, ...props };

  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  const knobElement = useRef<HTMLDivElement>(null);
  const angle = mapToRange(value, min, max, angleOffset, angleOffset + arc);

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
      const mapped = mapToRange(clamped, minAngle, maxAngle, min, max);
      const newValue = coerceToStep(mapped, min, max, step);

      setValue(newValue);
    }
  }, [knobElement]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    move(e.clientX, e.clientY);
  }, []);

  const onMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const onMouseDown = useCallback((e: ReactMouseEvent) => {
    move(e.clientX, e.clientY);
    e.preventDefault();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const onWheel = useCallback((e: ReactWheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;

    setValue(prev => {
      let delta = step;
      delta = (deltaY >= 0) ? -delta : delta;
      const newValue = clamp(prev + delta, min, max);
      return newValue;
    });
  }, []);

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
