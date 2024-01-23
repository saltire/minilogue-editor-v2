import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BitsData, updateBits } from '../minilogue/midi';
import { PortsMap } from '../minilogue/types';


export type Message = {
  targetId: string,
  timeStamp: number,
  messageType: number,
  channel: number,
  code: number,
  value: number,
};

export type MidiState = {
  access: MIDIAccess | null,
  ports: PortsMap,
  messages: Message[],
  deviceBank?: number,
  deviceProgram?: number,
};

const initialState: MidiState = {
  access: null,
  ports: {},
  messages: [],
};

const midiSlice = createSlice({
  name: 'midi',
  initialState,
  reducers: {
    storeAccess: (state, { payload: access }: PayloadAction<MIDIAccess>) => ({ ...state, access }),

    connectPort: (state, { payload: port }: PayloadAction<MIDIPort>) => ({
      ...state,
      ...state.ports[port.id] ? {} : { ports: { ...state.ports, [port.id]: port } },
    }),

    disconnectPort: (state, { payload: port }: PayloadAction<MIDIPort>) => ({
      ...state,
      ...state.ports[port.id] ? {
        ports: Object.fromEntries(Object.entries(state.ports).filter(([id]) => id !== port.id)),
      } : {},
    }),

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
  },
});

export default midiSlice;
export const {
  storeAccess, connectPort, disconnectPort, receiveMessage, updateBank, setProgram,
} = midiSlice.actions;
