import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { sendParameter } from '../minilogue/midi';
import { INIT_PROGRAM } from '../minilogue/program';
import { Program } from '../minilogue/types';
import type { Thunk } from '../reducer';


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

    setMotionSlotParameter: (
      state, { payload: { index, parameter } }: PayloadAction<{ index: number, parameter: number }>,
    ) => ({
      ...state,
      currentProgram: {
        ...state.currentProgram,
        sequence: {
          ...state.currentProgram.sequence,
          motionSlots: state.currentProgram.sequence.motionSlots
            .map((slot, i) => (i !== index ? slot : { ...slot, parameterId: parameter })),
        },
      },
    }),

    clearDisplayParameter: state => ({ ...state, displayParam: null }),
  },
});

export default programSlice;
export const {
  setCurrentProgram, setPanelParameter, setMotionSlotParameter, clearDisplayParameter,
} = programSlice.actions;

export const setParameter = (parameter: number, value: number): Thunk => (
  (dispatch, getState) => {
    const { midi: { outputs, outputId, channel } } = getState();

    dispatch(setPanelParameter({ parameter, value }));

    if (outputId && outputs[outputId]) {
      sendParameter(outputs[outputId] as MIDIOutput, channel, parameter, value);
    }
  });
