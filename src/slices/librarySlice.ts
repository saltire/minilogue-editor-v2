import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Library } from '../minilogue/types';
import { INIT_PROGRAM } from '../minilogue/program';


export type LibraryState = {
  library: Library,
  currentProgram: number,
};

const initialState: LibraryState = {
  library: {
    programs: [INIT_PROGRAM],
  },
  currentProgram: 0,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibrary: (state, { payload: library }: PayloadAction<Library>) => ({ ...state, library }),
  },
});

export default librarySlice;
export const { setLibrary } = librarySlice.actions;
