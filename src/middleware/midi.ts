import { Middleware } from '@reduxjs/toolkit';

import { DISPLAY_OPTIONS } from '../minilogue/display';
import { messageToParameter } from '../minilogue/midi';
import { decodeProgram } from '../minilogue/program';
import { isSysexMessage, parseSysexMessage } from '../minilogue/sysex';
import { setCurrentProgram, setPanelParameter } from '../slices/programSlice';
import { connectPort, disconnectPort, receiveMessage } from '../slices/midiSlice';


/* eslint-disable no-param-reassign, no-bitwise */

const accessPromise = 'requestMIDIAccess' in navigator
  ? navigator.requestMIDIAccess({ sysex: true })
  : Promise.reject(new Error('WebMIDI access not available.'));

const midiMiddleware: Middleware = ({ dispatch }) => {
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

        // Ignore clock messages for now.
        else if (data[0] !== 0xf8) {
          console.log('message', event);
          const [status, code, value] = data;
          const messageType = status >>> 4;
          const channel = status & 0b00001111;
          // console.log({ messageType, channel, code, value });

          if (messageType === 0xb) {
            const [parameter, translated] = messageToParameter(code, value);
            if (parameter !== undefined && translated !== undefined) {
              const options = DISPLAY_OPTIONS[parameter];
              console.log({ parameter: options.title, value: translated });

              dispatch(setPanelParameter({ parameter, value: translated }));
            }
          }
          // else if (messageType === 0xc) {
          //   console.log({ program: code + 1 });
          // }

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
