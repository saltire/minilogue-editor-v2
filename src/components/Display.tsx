import { useEffect } from 'react';

import './Display.css';
import { getParameterDisplayValue } from '../minilogue/params';
import { clearDisplayParameter } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';


export default function Display() {
  const dispatch = useAppDispatch();
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);
  const displayParam = useAppSelector(({ program }) => program.displayParam);

  useEffect(() => {
    if (displayParam !== null) {
      const timeout = setTimeout(() => dispatch(clearDisplayParameter()), 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [displayParam]);

  return (
    <div className='display-container'>
      <div className='display'>
        {displayParam !== null && (
          <p className='display-contents'>
            {getParameterDisplayValue(currentProgram.parameters, displayParam.parameter)}
          </p>
        )}
      </div>
    </div>
  );
}
