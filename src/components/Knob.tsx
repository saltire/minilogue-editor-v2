import { MouseEvent as ReactMouseEvent, useCallback, useRef, useState } from 'react';

import './Knob.css';


const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

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

type KnobProps = {
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
  const knobElement = useRef<HTMLDivElement>(null);

  const angle = mapToRange(value, min, max, angleOffset, angleOffset + arc);

  const move = useCallback((clientX: number, clientY: number) => {
    setValue(prev => {
      const bbox = knobElement.current?.getBoundingClientRect();
      const centerX = bbox ? bbox.left + (bbox.width / 2) : 0;
      const centerY = bbox ? bbox.top + (bbox.height / 2) : 0;
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
      if (newValue !== prev) {
        onChange?.(newValue);
      }
      return newValue;
    });
  }, []);

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

  return (
    <div
      className='Knob'
      role='slider'
      title={`${value}`}
      aria-label={`${value}`}
      aria-valuenow={value}
      tabIndex={-1}
      onMouseDown={onMouseDown}
      onWheel={e => {
        e.preventDefault();
        const { deltaY } = e;

        setValue(prev => {
          let delta = step;
          delta = (deltaY >= 0) ? -delta : delta;
          const newValue = clamp(prev + delta, min, max);
          if (newValue !== prev) {
            onChange?.(newValue);
          }
          return newValue;
        });
      }}
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
