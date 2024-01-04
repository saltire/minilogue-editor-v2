import { useCallback } from 'react';

import './ActionMenu.css';
import NewIcon from '../assets/new.svg';
import ReceiveIcon from '../assets/receive.svg';
import ShuffleIcon from '../assets/shuffle.svg';
import { INIT_PROGRAM } from '../minilogue/program';
import generateRandomProgram from '../minilogue/random';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';
import Button from './Button';


const isOutput = (port: MIDIPort | undefined): port is MIDIOutput => port?.type === 'output';

export default function ActionMenu() {
  const dispatch = useAppDispatch();
  const ports = useAppSelector(({ midi }) => midi.ports);

  const requestCurrentProgram = useCallback(() => {
    const channel = 0;
    // const type = 0x40; // set program
    const type = 0x10; // request program

    const message = [0xf0, 0x42, 0x30 | channel, 0x00, 0x01, 0x2c, type, /* data, */ 0xf7];

    const output = Object.values(ports).filter(isOutput).find(port => port.name?.includes('SOUND'));
    console.log(output);
    output?.send(message);
  }, [ports]);

  return (
    <ul className='action-menu'>
      <li>
        <Button
          title='Init Program'
          onClick={() => dispatch(setCurrentProgram(INIT_PROGRAM))}
        >
          <NewIcon />
        </Button>
      </li>

      <li>
        <Button
          title='Randomize Program'
          onClick={() => dispatch(setCurrentProgram(generateRandomProgram()))}
        >
          <ShuffleIcon />
        </Button>
      </li>

      <li>
        <Button
          title='Request Program'
          onClick={() => requestCurrentProgram()}
        >
          <ReceiveIcon />
        </Button>
      </li>
    </ul>
  );
}
