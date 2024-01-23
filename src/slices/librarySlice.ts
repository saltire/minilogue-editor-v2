import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { INIT_PROGRAM } from '../minilogue/program';
import { Library } from '../minilogue/types';


export type LibraryState = {
  library: Library,
  currentPosition: number,
};

const initialState: LibraryState = {
  library: {
    programs: [INIT_PROGRAM],
  },
  currentPosition: 0,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibrary: (state, { payload: library }: PayloadAction<Library>) => ({
      ...state,
      library,
      currentPosition: 0,
    }),

    deleteLibraryProgram: (state, { payload: index }: PayloadAction<number>) => {
      const programs = [...state.library.programs];
      programs.splice(index, 1);
      if (!programs.length) {
        programs.push(INIT_PROGRAM);
      }
      return { ...state, library: { ...state.library, programs } };
    },

    setCurrentPosition: (state, { payload: currentPosition }: PayloadAction<number>) => ({
      ...state,
      currentPosition,
    }),
  },
});

export default librarySlice;
export const { setLibrary, deleteLibraryProgram, setCurrentPosition } = librarySlice.actions;
