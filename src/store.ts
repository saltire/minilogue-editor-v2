import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import programSlice from './slices/programSlice';


export const store = configureStore({
  reducer: {
    program: programSlice.reducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppStore['dispatch']>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
