import { Middleware } from '@reduxjs/toolkit';

import {
  BANK_SELECT_HIGH, BANK_SELECT_LOW, CLOCK, CONTROL_CHANGE, PROGRAM_CHANGE,
  messageToParameter,
} from '../minilogue/midi';
import { paramData } from '../minilogue/params';
import { decodeProgram } from '../minilogue/program';
import {
  CURRENT_PROGRAM_DATA_DUMP, PROGRAM_DATA_DUMP, GLOBAL_DATA_DUMP,
  DATA_FORMAT_ERROR, DATA_LOAD_COMPLETED, DATA_LOAD_ERROR,
  decodeProgramIndex, decodeSysexData, getSysexFunction,
} from '../minilogue/sysex';
import { RootState } from '../reducer';
import {
  Message,
  connectInput, connectOutput, disconnectInput, disconnectOutput,
  receiveMessage, setProgram, updateBank,
} from '../slices/midiSlice';
import { setCurrentProgram, setPanelParameter } from '../slices/programSlice';
import { setLibraryProgram } from '../slices/librarySlice';


/* eslint-disable no-param-reassign, no-bitwise */

const accessPromise = 'requestMIDIAccess' in navigator
  ? navigator.requestMIDIAccess({ sysex: true })
  : Promise.reject(new Error('WebMIDI access not available.'));

const midiMiddleware: Middleware<object, RootState> = ({ dispatch, getState }) => {
  accessPromise
    .then(access => {
      // console.log({ access });
      // dispatch(storeAccess(access));

      const handleMessage = (event: Event) => {
        const { data, timeStamp, target } = event as MIDIMessageEvent;
        const targetId = (target as MIDIPort).id;

        const { midi: { inputs } } = getState();
        const input = inputs[targetId];

        // Sysex message
        const func = getSysexFunction(data);
        if (func !== undefined) {
          if (func === CURRENT_PROGRAM_DATA_DUMP) {
            const program = decodeProgram(decodeSysexData(data.slice(7, -1)));
            dispatch(setCurrentProgram(program));
          }
          else if (func === PROGRAM_DATA_DUMP) {
            const index = decodeProgramIndex(data.slice(7, 9));
            const program = decodeProgram(decodeSysexData(data.slice(9, -1)));
            dispatch(setLibraryProgram({ index, program }));
          }
          else if (func === GLOBAL_DATA_DUMP) {
            console.log('Global data dump');
          }
          else if (func === DATA_FORMAT_ERROR) {
            console.warn('Data format error');
          }
          else if (func === DATA_LOAD_COMPLETED) {
            console.log('Data load completed');
          }
          else if (func === DATA_LOAD_ERROR) {
            console.warn('Data load error');
          }
        }

        else {
          const [status, code, value] = data;
          const messageType = status >>> 4;
          const channel = status & 0b00001111;

          const message: Message = {
            timeStamp, input: input?.name || targetId, channel, messageType, code, value,
          };

          if (messageType === CLOCK) {
            return;
          }
          if (messageType === CONTROL_CHANGE) {
            if (code === BANK_SELECT_HIGH) {
              message.code = 'Bank select';
              dispatch(updateBank({ high: value }));
            }
            else if (code === BANK_SELECT_LOW) {
              message.code = 'Bank select (fine)';
              dispatch(updateBank({ low: value }));
            }
            else {
              const [parameter, translated] = messageToParameter(code, value);
              message.code = paramData[parameter].title;
              dispatch(setPanelParameter({ parameter, value: translated }));
            }
          }
          else if (messageType === PROGRAM_CHANGE) {
            const { midi: { deviceBank } } = getState();
            dispatch(setProgram(code));

            const index = (deviceBank ?? 0) * 100 + code;
            console.log({ program: index + 1 });

            // const output = useOutputPort();
            // if (output) {
            //   requestProgram(output, index);
            // }
          }
          else {
            console.log({ messageType, channel, code, value });
          }

          dispatch(receiveMessage(message));
        }
      };

      access.inputs.forEach(port => {
        // console.log({ input });
        dispatch(connectInput(port));
        port.addEventListener('midimessage', handleMessage);
      });

      access.outputs.forEach(port => {
        // console.log({ output });
        dispatch(connectOutput({ port, select: port.name === 'minilogue SOUND' }));
      });

      access.addEventListener('statechange', event => {
        // console.log('statechange', event);

        const { port } = event as MIDIConnectionEvent;
        if (port.state === 'connected') {
          dispatch(port.type === 'input' ? connectInput(port)
            : connectOutput({ port, select: port.name === 'minilogue SOUND' }));
          if (port.type === 'input') {
            port.addEventListener('midimessage', handleMessage);
          }
        }
        else {
          dispatch(port.type === 'input' ? disconnectInput(port) : disconnectOutput(port));
        }
      });
    })
    .catch(console.error);

  return next => action => next(action);
};

export default midiMiddleware;
