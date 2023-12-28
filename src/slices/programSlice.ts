import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ProgramState = {
  currentProgram: { [param: string]: number | undefined },
};

const initialState: ProgramState = {
  currentProgram: {},
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setPanelParameter: (
      state, { payload: { parameter, value } }: PayloadAction<{ parameter: string, value: number }>,
    ) => ({ ...state, currentProgram: { ...state.currentProgram, [parameter]: value } }),
  },
});

export default programSlice;
export const { setPanelParameter } = programSlice.actions;
