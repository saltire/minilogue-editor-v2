import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { INIT_PROGRAM } from '../minilogue/program';
import { Program } from '../minilogue/types';


export type ProgramState = {
  currentProgram: Program,
  displayParam: {
    parameter: number,
    value: number,
  } | null,
};

const initialState: ProgramState = {
  currentProgram: INIT_PROGRAM,
  displayParam: null,
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setCurrentProgram: (state, { payload: program }: PayloadAction<Program>) => ({
      ...state,
      currentProgram: program,
      displayParam: null,
    }),

    setPanelParameter: (
      state, { payload: { parameter, value } }: PayloadAction<{ parameter: number, value: number }>,
    ) => ({
      ...state,
      currentProgram: {
        ...state.currentProgram,
        parameters: { ...state.currentProgram.parameters, [parameter]: value },
      },
      displayParam: { parameter, value },
    }),

    clearDisplayParameter: state => ({ ...state, displayParam: null }),
  },
});

export default programSlice;
export const { setCurrentProgram, setPanelParameter, clearDisplayParameter } = programSlice.actions;
