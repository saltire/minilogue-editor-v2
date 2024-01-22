import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Thunk } from './types';
import { Program } from '../minilogue/types';
import { requestCurrentProgram, sendCurrentProgram } from '../minilogue/midi';


export type Message = {
  targetId: string,
  timeStamp: number,
  messageType: number,
  channel: number,
  code: number,
  value: number,
};

type PortsMap = { [portId: string]: MIDIPort | undefined };

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

export const getOutputPort = (ports: PortsMap) => Object.values(ports)
  .filter((port: MIDIPort | undefined): port is MIDIOutput => port?.type === 'output')
  .find(port => port.name?.includes('SOUND'));

export const requestProgram = (): Thunk<{ midi: MidiState }> => (
  (dispatch, getState) => {
    const { midi: { ports } } = getState();
    const output = getOutputPort(ports);
    if (output) {
      requestCurrentProgram(output);
    }
  });

export const sendProgram = (program: Program): Thunk<{ midi: MidiState }> => (
  (dispatch, getState) => {
    const { midi: { ports } } = getState();
    const output = getOutputPort(ports);
    if (output) {
      sendCurrentProgram(output, program);
    }
  });
