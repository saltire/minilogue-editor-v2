import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BitsData, updateBits } from '../minilogue/midi';
import { PortsMap } from '../minilogue/types';


export type Message = {
  targetId: string,
  input?: string | null,
  timeStamp: number,
  messageType: number,
  channel: number,
  code: number,
  value: number,
};

export type MidiState = {
  access: MIDIAccess | null,
  inputs: PortsMap,
  outputs: PortsMap,
  outputId?: string,
  messages: Message[],
  deviceBank?: number,
  deviceProgram?: number,
  pending?: boolean,
};

const initialState: MidiState = {
  access: null,
  inputs: {},
  outputs: {},
  messages: [],
};

type ConnectPortPayload = {
  port: MIDIPort,
  select?: boolean,
};

const midiSlice = createSlice({
  name: 'midi',
  initialState,
  reducers: {
    storeAccess: (state, { payload: access }: PayloadAction<MIDIAccess>) => ({ ...state, access }),

    connectInput: (state, { payload: port }: PayloadAction<MIDIPort>) => ({
      ...state,
      ...state.inputs[port.id] ? {} : { inputs: { ...state.inputs, [port.id]: port } },
    }),

    connectOutput: (state, { payload: { port, select } }: PayloadAction<ConnectPortPayload>) => ({
      ...state,
      ...state.outputs[port.id] ? {} : { outputs: { ...state.outputs, [port.id]: port } },
      ...select ? { outputId: port.id } : {},
    }),

    disconnectInput: (state, { payload: port }: PayloadAction<MIDIPort>) => ({
      ...state,
      ...state.inputs[port.id] ? {
        inputs: Object.fromEntries(Object.entries(state.inputs).filter(([id]) => id !== port.id)),
      } : {},
    }),

    disconnectOutput: (state, { payload: port }: PayloadAction<MIDIPort>) => ({
      ...state,
      ...state.outputs[port.id] ? {
        outputs: Object.fromEntries(Object.entries(state.outputs).filter(([id]) => id !== port.id)),
      } : {},
    }),

    setOutputId: (state, { payload: outputId }: PayloadAction<string>) => ({ ...state, outputId }),

    receiveMessage: (state, { payload: message }: PayloadAction<Message>) => ({
      ...state,
      messages: [...state.messages.slice(-99), message],
    }),

    updateBank: (state, { payload }: PayloadAction<BitsData>) => ({
      ...state,
      deviceBank: updateBits(state.deviceBank, payload),
    }),

    setProgram: (state, { payload: deviceProgram }: PayloadAction<number>) => ({
      ...state,
      deviceProgram,
    }),

    setPending: (state, { payload: pending }: PayloadAction<boolean>) => ({ ...state, pending }),
  },
});

export default midiSlice;
export const {
  storeAccess, connectInput, connectOutput, disconnectInput, disconnectOutput, setOutputId,
  receiveMessage, updateBank, setProgram, setPending,
} = midiSlice.actions;
