import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import midiMiddleware from './middleware/midi';
import midiSlice from './slices/midiSlice';
import programSlice from './slices/programSlice';


export const store = configureStore({
  reducer: {
    midi: midiSlice.reducer,
    program: programSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat(midiMiddleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppStore['dispatch']>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
