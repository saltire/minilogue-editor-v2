import { useRef } from 'react';

import NewIcon from '../assets/new.svg';
import OpenIcon from '../assets/open.svg';
import ReceiveIcon from '../assets/receive.svg';
import SendIcon from '../assets/send.svg';
import { loadLibrarianFile } from '../minilogue/library';
import { getOutputPort, requestLibrary, sendLibrary } from '../minilogue/midi';
import { INIT_PROGRAM } from '../minilogue/program';
import { setLibrary } from '../slices/librarySlice';
import { setPending } from '../slices/midiSlice';
import { useAppDispatch, useAppSelector } from '../store';
import ActionMenu from './ActionMenu';
import Button from './Button';


export default function LibraryMenu() {
  const dispatch = useAppDispatch();
  const library = useAppSelector(({ library: l }) => l.library);
  const pending = useAppSelector(({ midi }) => midi.pending);
  const ports = useAppSelector(({ midi }) => midi.ports);

  const output = getOutputPort(ports);

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <ActionMenu>
      <Button
        title='New Library'
        onClick={() => dispatch(setLibrary({ programs: [INIT_PROGRAM] }))}
      >
        <NewIcon />
      </Button>

      <Button
        title='Load Library File'
        onClick={() => fileInput.current?.click()}
      >
        <OpenIcon />
      </Button>
      <input
        ref={fileInput}
        type='file'
        onChange={e => e.target.files?.[0] && loadLibrarianFile(e.target.files[0])
          .then(newLib => dispatch(setLibrary(newLib)))}
      />

      <Button
        title='Request Library'
        disabled={!output || pending}
        onClick={() => {
          if (output) {
            dispatch(setPending(true));
            requestLibrary(output)
              .catch(console.error)
              .finally(() => dispatch(setPending(false)));
          }
        }}
      >
        <ReceiveIcon />
      </Button>

      <Button
        title='Send Library'
        disabled={!output || pending}
        onClick={() => {
          if (output) {
            dispatch(setPending(true));
            sendLibrary(output, library)
              .catch(console.error)
              .finally(() => dispatch(setPending(false)));
          }
        }}
      >
        <SendIcon />
      </Button>
    </ActionMenu>
  );
}
