import './Library.css';
import CheckIcon from '../assets/check.svg';
import TrashIcon from '../assets/trash.svg';
import * as params from '../minilogue/params';
import { Program } from '../minilogue/types';
import { deleteLibraryProgram, setCurrentPosition } from '../slices/librarySlice';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';
import LibraryMenu from './LibraryMenu';
import Button from './Button';


const parameters = [
  params.PROGRAM_NAME,
  params.VOICE_MODE,
  params.VCO1_WAVE,
  params.VCO2_WAVE,
  params.SLIDER_ASSIGN,
];

const columns = parameters.map(parameter => ({
  parameter,
  label: params.paramData[parameter].title,
  getValue: (program: Program) => params.getParameterDisplayValue(program.parameters, parameter),
}));

/* eslint-disable react/no-array-index-key */
export default function Library() {
  const dispatch = useAppDispatch();
  const library = useAppSelector(({ library: l }) => l.library);
  // const currentProgram = useAppSelector(({ library: l }) => l.currentProgram);

  return (
    <div className='library'>
      <h3>Library</h3>

      <LibraryMenu />

      <table>
        <thead>
          <tr className='table-head-row'>
            {columns.map(column => (
              <th key={column.label} className='table-cell table-heading'>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {library.programs.map((program, i) => (
            <tr key={i} className='table-row'>
              {columns.map((column, c) => (
                <td key={c} className='table-cell'>{column.getValue(program)}</td>
              ))}

              <td className='table-cell'>
                <div className='row-actions'>
                  <Button
                    title='Load in panel'
                    aria-label='Load in panel'
                    onClick={() => {
                      dispatch(setCurrentPosition(i));
                      dispatch(setCurrentProgram(program));
                    }}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    title='Delete from library'
                    aria-label='Delete from library'
                    onClick={() => dispatch(deleteLibraryProgram(i))}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
