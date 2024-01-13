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

    deleteLibraryProgram: (state, { payload: index }: PayloadAction<number>) => {
      const programs = [...state.library.programs];
      programs.splice(index, 1);
      if (!programs.length) {
        programs.push(INIT_PROGRAM);
      }
      return { ...state, library: { ...state.library, programs } };
    },
  },
});

export default librarySlice;
export const { setLibrary, deleteLibraryProgram } = librarySlice.actions;
