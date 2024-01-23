import { combineReducers, ThunkAction, UnknownAction } from '@reduxjs/toolkit';

import librarySlice from './slices/librarySlice';
import midiSlice from './slices/midiSlice';
import programSlice from './slices/programSlice';


export const rootReducer = combineReducers({
  library: librarySlice.reducer,
  midi: midiSlice.reducer,
  program: programSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type Thunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;
