import { useRef } from 'react';

import NewIcon from '../assets/new.svg';
import OpenIcon from '../assets/open.svg';
import { loadLibrarianFile } from '../minilogue/library';
import { INIT_PROGRAM } from '../minilogue/program';
import { setLibrary } from '../slices/librarySlice';
import { useAppDispatch } from '../store';
import ActionMenu from './ActionMenu';
import Button from './Button';


export default function LibraryMenu() {
  const dispatch = useAppDispatch();

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
          .then(library => dispatch(setLibrary(library)))}
      />
    </ActionMenu>
  );
}
