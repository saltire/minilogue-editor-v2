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
  connectPort, disconnectPort, receiveMessage, setProgram, updateBank,
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

          if (messageType === CLOCK) {
            return;
          }

          if (messageType === CONTROL_CHANGE) {
            if (code === BANK_SELECT_HIGH) {
              dispatch(updateBank({ high: value }));
            }
            else if (code === BANK_SELECT_LOW) {
              dispatch(updateBank({ low: value }));
            }

            const [parameter, translated] = messageToParameter(code, value);
            if (parameter !== undefined && translated !== undefined) {
              console.log({ parameter: paramData[parameter].title, value: translated });

              dispatch(setPanelParameter({ parameter, value: translated }));
            }
          }
          else if (messageType === PROGRAM_CHANGE) {
            const { midi: { deviceBank } } = getState();
            dispatch(setProgram(code));

            const index = (deviceBank ?? 0) * 100 + code;
            console.log({ program: index + 1 });

            // const output = getOutputPort(ports);
            // if (output) {
            //   requestProgram(output, index);
            // }
          }
          else {
            console.log({ messageType, channel, code, value });
          }

          dispatch(receiveMessage({
            targetId, messageType, channel, code, value, timeStamp,
          }));
        }
      };

      access.inputs.forEach(input => {
        // console.log({ input });
        dispatch(connectPort(input));
        input.addEventListener('midimessage', handleMessage);
      });

      access.outputs.forEach(output => {
        // console.log({ output });
        dispatch(connectPort(output));
      });

      access.addEventListener('statechange', event => {
        // console.log('statechange', event);

        const { port } = event as MIDIConnectionEvent;
        if (port.state === 'connected') {
          dispatch(connectPort(port));
          if (port.type === 'input') {
            port.addEventListener('midimessage', handleMessage);
          }
        }
        else {
          dispatch(disconnectPort(port));
        }
      });
    })
    .catch(console.error);

  return next => action => next(action);
};

export default midiMiddleware;
