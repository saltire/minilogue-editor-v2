import {
  MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent,
  useCallback, useEffect, useRef,
} from 'react';

import './Switch.css';
import { clamp, classList } from '../utils';


type SwitchProps = {
  value: number,
  numPositions: number,
  vertical?: boolean,
  onChange: (value: number) => void,
};

export default function Switch({ value, numPositions, vertical = true, onChange }: SwitchProps) {
  const rangeEl = useRef<HTMLDivElement>(null);
  const valueEl = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number, clientY: number) => {
    if (rangeEl.current) {
      const { width, height, bottom, left } = rangeEl.current.getBoundingClientRect();
      const size = vertical ? height : width;
      const positionSize = size / numPositions;
      const relativePosition = vertical ? bottom - clientY : clientX - left;
      const newValue = clamp(Math.floor(relativePosition / positionSize), 0, numPositions - 1);

      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }, [value, rangeEl, vertical, numPositions, onChange]);

  useEffect(() => {
    if (rangeEl.current && valueEl.current) {
      const { height: rangeHeight, width: rangeWidth } = rangeEl.current.getBoundingClientRect();
      const { height: valueHeight, width: valueWidth } = valueEl.current.getBoundingClientRect();
      const rangeSize = vertical ? rangeHeight : rangeWidth;
      const valueSize = vertical ? valueHeight : valueWidth;
      const stepSize = (rangeSize - valueSize) / (numPositions - 1);
      const offset = value * stepSize;
      const styleProperty = vertical ? 'bottom' : 'left';
      valueEl.current.style[styleProperty] = `${offset}px`;
    }
  }, [value, rangeEl, valueEl, vertical, numPositions]);

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

    if (rangeEl.current) {
      const { height, width } = rangeEl.current.getBoundingClientRect();
      const size = vertical ? height : width;
      const positionSize = size / (numPositions - 1);
      const delta = Math.round(-deltaY / positionSize);
      const newValue = clamp(value + delta, 0, numPositions - 1);

      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }, [value, rangeEl, vertical, numPositions, onChange]);

  return (
    <div
      className={classList('switch-range',
        vertical ? 'switch-range-vertical' : 'switch-range-horizontal')}
      ref={rangeEl}
      onWheel={onWheel}
    >
      <div
        className='switch-value'
        ref={valueEl}
        role='button'
        tabIndex={0}
        aria-label={`${value}`}
        onMouseDown={onMouseDown}
      />
    </div>
  );
}
