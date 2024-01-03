import { Middleware } from '@reduxjs/toolkit';

import { messageToParameter } from '../minilogue/midi';
import { setPanelParameter } from '../slices/programSlice';
import { DISPLAY_OPTIONS } from '../minilogue/display';
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

        // Ignore clock messages for now.
        if (data[0] !== 0xF8) {
          // console.log('message', event);
          const [status, code, value] = data;
          const messageType = status >>> 4;
          const channel = status & 0b00001111;
          console.log({ messageType, channel, code, value });

          if (messageType === 0xB) {
            const [parameter, translated] = messageToParameter(code, value);
            if (parameter !== undefined && translated !== undefined) {
              const options = DISPLAY_OPTIONS[parameter];
              console.log({ parameter: options.title, value: translated });

              dispatch(setPanelParameter({ parameter, value: translated }));
            }
          }
          // else if (messageType === 0xC) {
          //   console.log({ program: code + 1 });
          // }

          dispatch(receiveMessage({
            targetId, messageType, channel, code, value, timeStamp,
          }));
        }
      };

      access.inputs.forEach(input => {
        console.log({ input });
        const { id, name, manufacturer, state, type } = input;
        dispatch(connectPort({ id, name, manufacturer, state, type }));
        input.addEventListener('midimessage', handleMessage);
      });

      access.outputs.forEach(output => {
        console.log({ output });
        const { id, name, manufacturer, state, type } = output;
        dispatch(connectPort({ id, name, manufacturer, state, type }));
      });

      access.addEventListener('statechange', event => {
        console.log('statechange', event);

        const { port } = event as MIDIConnectionEvent;
        const { id, name, manufacturer, state, type } = port;

        const copy = {
          id, name, manufacturer, state, type,
        };
        if (copy.state === 'connected') {
          dispatch(connectPort({ id, name, manufacturer, state, type }));
          if (type === 'input') {
            port.addEventListener('midimessage', handleMessage);
          }
        }
        else {
          dispatch(disconnectPort({ id, name, manufacturer, state, type }));
        }
      });
    })
    .catch(console.error);

  return next => action => next(action);
};

export default midiMiddleware;
