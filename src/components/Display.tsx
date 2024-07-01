import { useEffect } from 'react';

import './Display.css';
import { PROGRAM_NAME, getParameterDisplayValue } from '../minilogue/params';
import { clearDisplayParameter } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';


export default function Display() {
  const dispatch = useAppDispatch();
  const currentPosition = useAppSelector(({ library: l }) => l.currentPosition);
  const library = useAppSelector(({ library: l }) => l.library);
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
  }, [dispatch, displayParam]);

  return (
    <div className='display-container'>
      <div className='display'>
        <p className='display-contents'>
          {displayParam !== null ? (
            getParameterDisplayValue(currentProgram.parameters, displayParam.parameter)
          ) : (
            <>
              {`000${currentPosition + 1}`.slice(-3)}<br />
              {library.programs[currentPosition].parameters[PROGRAM_NAME]}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
