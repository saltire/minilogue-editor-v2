import { PayloadAction, createSlice } from '@reduxjs/toolkit';


export type Program = { [param: number]: number };

export type ProgramState = {
  currentProgram: Program,
};

const initialState: ProgramState = {
  currentProgram: {},
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
