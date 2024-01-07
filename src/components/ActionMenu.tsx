import { useMemo } from 'react';

import './ActionMenu.css';
import NewIcon from '../assets/new.svg';
import ReceiveIcon from '../assets/receive.svg';
import SendIcon from '../assets/send.svg';
import ShuffleIcon from '../assets/shuffle.svg';
import { requestCurrentProgram, sendCurrentProgram } from '../minilogue/midi';
import { INIT_PROGRAM } from '../minilogue/program';
import generateRandomProgram from '../minilogue/random';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';
import Button from './Button';


const isOutput = (port: MIDIPort | undefined): port is MIDIOutput => port?.type === 'output';

export default function ActionMenu() {
  const dispatch = useAppDispatch();
  const ports = useAppSelector(({ midi }) => midi.ports);
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const output = useMemo(
    () => Object.values(ports).filter(isOutput).find(port => port.name?.includes('SOUND')),
    [ports]);

  return (
    <div className='action-menu'>
      <Button
        title='Init Program'
        onClick={() => dispatch(setCurrentProgram(INIT_PROGRAM))}
      >
        <NewIcon />
      </Button>

      <Button
        title='Randomize Program'
        onClick={() => dispatch(setCurrentProgram(generateRandomProgram()))}
      >
        <ShuffleIcon />
      </Button>

      <Button
        title='Request Program'
        disabled={!output}
        onClick={() => output && requestCurrentProgram(output)}
      >
        <ReceiveIcon />
      </Button>

      <Button
        title='Send Program'
        disabled={!output}
        onClick={() => output && sendCurrentProgram(output, currentProgram)}
      >
        <SendIcon />
      </Button>
    </div>
  );
}
