import './Library.css';
import * as params from '../minilogue/params';
import { ProgramParams } from '../minilogue/types';


const parameters = [
  params.PROGRAM_NAME,
  params.VOICE_MODE,
  params.VCO1_WAVE,
  params.VCO2_WAVE,
  params.SLIDER_ASSIGN,
];

const columns = parameters.map(parameter => ({
  accessor: (program: ProgramParams) => params.getParameterDisplayValue(program, parameter),
  label: params.paramData[parameter].title,
}));

export default function Library() {
  return (
    <div className='library'>
      <table className='table'>
        <thead>
          <tr className='table-head-row'>
            {columns.map(column => (
              <th key={column.label} className='table-cell table-heading'>{column.label}</th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}
