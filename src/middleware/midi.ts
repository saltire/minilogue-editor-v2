import { Middleware } from '@reduxjs/toolkit';

import {
  CLOCK, CONTROL_CHANGE, PROGRAM_CHANGE,
  messageToParameter,
} from '../minilogue/midi';
import { paramData } from '../minilogue/params';
import { decodeProgram } from '../minilogue/program';
import { isSysexMessage, parseSysexMessage } from '../minilogue/sysex';
import { RootState } from '../reducer';
import { connectPort, disconnectPort, receiveMessage } from '../slices/midiSlice';
import { setCurrentProgram, setPanelParameter } from '../slices/programSlice';


/* eslint-disable no-param-reassign, no-bitwise */

const accessPromise = 'requestMIDIAccess' in navigator
  ? navigator.requestMIDIAccess({ sysex: true })
  : Promise.reject(new Error('WebMIDI access not available.'));

const midiMiddleware: Middleware<object, RootState> = ({ dispatch }) => {
  accessPromise
    .then(access => {
      // console.log({ access });
      // dispatch(storeAccess(access));

      const handleMessage = (event: Event) => {
        const { data, timeStamp, target } = event as MIDIMessageEvent;
        const targetId = (target as MIDIPort).id;

        // Sysex message
        if (isSysexMessage(data)) {
          const program = parseSysexMessage(data);
          if (program) {
            dispatch(setCurrentProgram(decodeProgram(program)));
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
            // TODO: handle bank / program change

            const [parameter, translated] = messageToParameter(code, value);
            if (parameter !== undefined && translated !== undefined) {
              console.log({ parameter: paramData[parameter].title, value: translated });

              dispatch(setPanelParameter({ parameter, value: translated }));
            }
          }
          else if (messageType === PROGRAM_CHANGE) {
            console.log({ program: code + 1 });

            // const { midi: { ports } } = getState();
            // const output = getOutputPort(ports);
            // if (output) {
            //   requestCurrentProgram(output);
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
        console.log({ input });
        dispatch(connectPort(input));
        input.addEventListener('midimessage', handleMessage);
      });

      access.outputs.forEach(output => {
        console.log({ output });
        dispatch(connectPort(output));
      });

      access.addEventListener('statechange', event => {
        console.log('statechange', event);

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
