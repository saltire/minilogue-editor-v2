import './Library.css';
import * as params from '../minilogue/params';
import { Program } from '../minilogue/types';
import { useAppSelector } from '../store';
import LibraryMenu from './LibraryMenu';


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
  const library = useAppSelector(({ library: l }) => l.library);
  // const currentProgram = useAppSelector(({ library: l }) => l.currentProgram);

  return (
    <div>
      <LibraryMenu />

      <table className='library'>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
