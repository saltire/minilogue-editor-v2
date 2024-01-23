import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
  },
});

export default midiSlice;
export const { storeAccess, connectPort, disconnectPort, receiveMessage } = midiSlice.actions;
