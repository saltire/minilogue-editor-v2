import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';

export type Thunk<State = void, ReturnType = void> = ThunkAction<
ReturnType, State, unknown, UnknownAction>;
