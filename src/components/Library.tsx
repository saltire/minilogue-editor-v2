import './Library.css';
import CheckIcon from '../assets/check.svg';
import ReceiveIcon from '../assets/receive.svg';
import SendIcon from '../assets/send.svg';
import TrashIcon from '../assets/trash.svg';
import { requestProgram, sendProgram } from '../minilogue/midi';
import * as params from '../minilogue/params';
import { Program } from '../minilogue/types';
import { deleteLibraryProgram, setCurrentPosition } from '../slices/librarySlice';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector, useOutput } from '../store';
import Button from './Button';
import LibraryMenu from './LibraryMenu';
import { classList } from '../utils';


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
  getValue: (program: Program) => params.getParameterDisplayStringOrIcon(program.parameters,
    parameter),
}));

/* eslint-disable react/no-array-index-key */
export default function Library() {
  const dispatch = useAppDispatch();
  const library = useAppSelector(({ library: l }) => l.library);
  const currentPosition = useAppSelector(({ library: l }) => l.currentPosition);
  const pending = useAppSelector(({ midi }) => midi.pending);
  const [output, channel] = useOutput();

  return (
    <div className='library'>
      <h3>Library</h3>

      <LibraryMenu />

      <table>
        <thead>
          <tr className='table-head-row'>
            <th className='table-cell table-heading'>#</th>
            {columns.map(column => (
              <th key={column.label} className='table-cell table-heading'>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {library.programs.map((program, i) => (
            <tr key={i} className={classList('table-row', currentPosition === i && 'current')}>
              <td className='table-cell'>{i + 1}</td>

              {columns.map((column, c) => (
                <td key={c} className='table-cell'>{column.getValue(program)}</td>
              ))}

              <td className='table-cell' aria-label='Actions'>
                <div className='row-actions'>
                  <Button
                    title='Load in panel'
                    disabled={pending}
                    onClick={() => {
                      dispatch(setCurrentPosition(i));
                      dispatch(setCurrentProgram(program));
                    }}
                  >
                    <CheckIcon />
                  </Button>

                  <Button
                    title='Request program'
                    disabled={pending}
                    onClick={() => output && requestProgram(output, channel, i)}
                  >
                    <ReceiveIcon />
                  </Button>

                  <Button
                    title='Send program'
                    disabled={pending}
                    onClick={() => output && sendProgram(output, channel, i, program)}
                  >
                    <SendIcon />
                  </Button>

                  <Button
                    title='Delete from library'
                    disabled={pending}
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
