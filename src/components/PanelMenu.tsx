import { useMemo, useRef } from 'react';

import NewIcon from '../assets/new.svg';
import OpenIcon from '../assets/open.svg';
import ReceiveIcon from '../assets/receive.svg';
import SendIcon from '../assets/send.svg';
import ShuffleIcon from '../assets/shuffle.svg';
import { loadLibraryFile } from '../minilogue/library';
import { getOutputPort, requestCurrentProgram, sendCurrentProgram } from '../minilogue/midi';
import { INIT_PROGRAM } from '../minilogue/program';
import generateRandomProgram from '../minilogue/random';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch, useAppSelector } from '../store';
import ActionMenu from './ActionMenu';
import Button from './Button';


export default function PanelMenu() {
  const dispatch = useAppDispatch();
  const pending = useAppSelector(({ midi }) => midi.pending);
  const ports = useAppSelector(({ midi }) => midi.ports);
  const currentProgram = useAppSelector(({ program }) => program.currentProgram);

  const output = useMemo(() => getOutputPort(ports), [ports]);

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <ActionMenu>
      <Button
        title='Init program'
        onClick={() => dispatch(setCurrentProgram(INIT_PROGRAM))}
      >
        <NewIcon />
      </Button>

      <Button
        title='Load program file'
        onClick={() => fileInput.current?.click()}
      >
        <OpenIcon />
      </Button>
      <input
        ref={fileInput}
        type='file'
        onChange={e => e.target.files?.[0] && loadLibraryFile(e.target.files[0])
          .then(library => library.programs[0] && dispatch(setCurrentProgram(library.programs[0])))}
      />

      <Button
        title='Randomize program'
        onClick={() => dispatch(setCurrentProgram(generateRandomProgram()))}
      >
        <ShuffleIcon />
      </Button>

      <Button
        title='Request program'
        disabled={!output || pending}
        onClick={() => output && requestCurrentProgram(output)}
      >
        <ReceiveIcon />
      </Button>

      <Button
        title='Send program'
        disabled={!output || pending}
        onClick={() => output && sendCurrentProgram(output, currentProgram)}
      >
        <SendIcon />
      </Button>
    </ActionMenu>
  );
}
