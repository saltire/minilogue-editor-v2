import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import midiMiddleware from './middleware/midi';
import { rootReducer, RootState } from './reducer';


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
    .concat(midiMiddleware),
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// custom hooks

export const useOutput = (): [MIDIOutput | undefined, number] => {
  const outputs = useAppSelector(({ midi }) => midi.outputs);
  const outputId = useAppSelector(({ midi }) => midi.outputId);
  const channel = useAppSelector(({ midi }) => midi.channel);
  return [
    outputId ? outputs[outputId] as MIDIOutput | undefined : undefined,
    channel,
  ];
};
