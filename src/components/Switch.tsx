import {
  MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent,
  useCallback, useEffect, useRef, useState,
} from 'react';

import './Switch.css';
import { clamp, classList } from '../utils';


type SwitchProps = {
  value: number,
  numPositions: number,
  vertical?: boolean,
  onChange: (value: number) => void,
};

export default function Switch({
  value: initValue, numPositions, vertical = true, onChange,
}: SwitchProps) {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  const rangeEl = useRef<HTMLDivElement>(null);
  const valueEl = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number, clientY: number) => {
    if (rangeEl.current) {
      const { width, height, bottom, left } = rangeEl.current.getBoundingClientRect();
      const size = vertical ? height : width;
      const positionSize = size / numPositions;
      const relativePosition = vertical ? bottom - clientY : clientX - left;
      const positionIndex = clamp(Math.floor(relativePosition / positionSize), 0, numPositions - 1);
      setValue(positionIndex);
    }
  }, [rangeEl]);

  useEffect(() => {
    onChange(value);

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
      if (!rangeEl.current) {
        return prev;
      }
      const { height, width } = rangeEl.current.getBoundingClientRect();
      const size = vertical ? height : width;
      const positionSize = size / (numPositions - 1);
      const delta = Math.round(-deltaY / positionSize);
      const clamped = clamp(prev + delta, 0, numPositions - 1);
      return clamped;
    });
  }, [rangeEl, vertical, numPositions]);

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
