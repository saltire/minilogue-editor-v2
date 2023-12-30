import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { INIT_PROGRAM } from '../minilogue/program';
import { Program } from '../minilogue/types';


export type ProgramState = {
  currentProgram: Program,
};

const initialState: ProgramState = {
  currentProgram: INIT_PROGRAM,
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setPanelParameter: (
      state, { payload: { parameter, value } }: PayloadAction<{ parameter: number, value: number }>,
    ) => ({ ...state, currentProgram: { ...state.currentProgram, [parameter]: value } }),
  },
});

export default programSlice;
export const { setPanelParameter } = programSlice.actions;
